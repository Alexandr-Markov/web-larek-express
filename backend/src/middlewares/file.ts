import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';
import { TMP_DIR } from '../config';
import BadRequestError from '../errors/bad-request-error';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
];

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

const fileMiddleware = multer({
  storage: multer.diskStorage({
    destination: TMP_DIR,
    filename: (_req, file, cb) => {
      cb(
        null,
        `${randomBytes(16).toString('hex')}${path.extname(file.originalname)}`,
      );
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new BadRequestError(
        'Недопустимый тип файла. Разрешены: png, jpg, jpeg, gif, svg',
      ),
    );
  },
});

export default fileMiddleware;
