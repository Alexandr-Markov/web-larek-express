import { CronJob } from 'cron';
import fs from 'fs';
import path from 'path';
import { TMP_DIR } from '../config';

const cleanupTempFiles = () => {
  fs.readdir(TMP_DIR, (err, files) => {
    if (err) return;
    const now = Date.now();
    files.forEach((name) => {
      const filePath = path.resolve(TMP_DIR, name);
      fs.stat(filePath, (statErr, stats) => {
        if (!statErr && now - stats.mtimeMs > 30 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
};

const job = new CronJob('0 * * * * *', cleanupTempFiles);

const startTempCleanup = () => {
  job.start();
};

export default startTempCleanup;
