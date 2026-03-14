import { execSync } from 'child_process';
import * as fs from 'fs';

const lifecycleEvent = process.env.npm_lifecycle_event;

if (!fs.existsSync('release')) {
    fs.mkdirSync('release')
}

switch (lifecycleEvent) {
    case 'postbuild:chrome': {
        const cmd = `npx web-ext build --source-dir ./dist_chrome --artifacts-dir ./release/chrome --overwrite-dest`;
        execSync(cmd, { stdio: 'inherit' });
        break;
    }
    case 'postbuild:firefox': {
        const cmd = `npx web-ext build --source-dir ./dist_firefox --artifacts-dir ./release/firefox --overwrite-dest`;
        execSync(cmd, { stdio: 'inherit' });
        break;
    }
    case 'postdev:firefox': {
        const cmd = `npx web-ext run --source-dir dist_firefox`;
        execSync(cmd, { stdio: 'inherit' });
        break;
    }
}
