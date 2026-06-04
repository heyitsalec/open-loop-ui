import { copyFileSync, existsSync, mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
if (existsSync('src/styles.css')) {
  copyFileSync('src/styles.css', 'dist/styles.css');
}
