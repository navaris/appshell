import fs from 'fs';
import path from 'path';

/**
 * Safely copies files and makes directories if they don't exist.
 * @param pattern { from: @type string, to: @type string }
 * @returns void
 */
export default (pattern: { from: string; to: string }) => {
  if (fs.existsSync(pattern.from)) {
    if (!fs.existsSync(path.dirname(pattern.to))) {
      fs.mkdirSync(path.dirname(pattern.to));
    }
    fs.copyFileSync(pattern.from, pattern.to);
  }
};
