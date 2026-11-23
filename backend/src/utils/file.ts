import fs from 'fs';
import path from 'path';
import { TMP_DIR, IMAGES_DIR } from '../config';
import BadRequestError from '../errors/bad-request-error';

export function isFileInTmp(fileName?: string) {
  return (
    !!fileName
    && fs.existsSync(path.resolve(TMP_DIR, path.basename(fileName)))
  );
}

export const moveFileToImages = (fileName?: string) => {
  if (!fileName) {
    throw new BadRequestError('Не передано имя файла изображения');
  }
  const base = path.basename(fileName);
  const src = path.resolve(TMP_DIR, base);
  if (!fs.existsSync(src)) {
    throw new BadRequestError('Файл изображения не найден на сервере');
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  const dest = path.resolve(IMAGES_DIR, base);
  fs.renameSync(src, dest);
  return `/images/${base}`;
};

export const removeFileFromImages = (fileName?: string) => {
  if (!fileName) return;
  const filePath = path.resolve(IMAGES_DIR, path.basename(fileName));
  fs.unlink(filePath, () => {});
};
