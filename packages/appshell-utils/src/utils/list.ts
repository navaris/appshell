import fs from 'fs';
import path from 'path';

const findFiles = (dirPath: string, files: string[], depth: number, target: RegExp) => {
  const dir = fs.readdirSync(dirPath);

  if (depth > 0) {
    dir.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        // eslint-disable-next-line no-param-reassign
        files = findFiles(path.join(dirPath, file), files, depth - 1, target);
      } else if (!target || path.basename(file).match(target)) {
        files.push(path.join(dirPath, file));
      }
    });
  }

  return files;
};

/**
 * Lists all files found in dirPath or its subdirectories
 * @param dirPath directory to search
 * @param depth depth to which the search should execute
 * @param target filename to filter results on
 * @returns list of paths for all files found
 */
const list = (dirPath: string, depth = 1, target: string | RegExp = /.*/) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const regex = target instanceof RegExp ? target : new RegExp(`^(${target})\$`);
  return findFiles(dirPath, [], depth, regex);
};

export default list;
