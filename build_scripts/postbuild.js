const { execSync } = require('child_process');
const lifecycleEvent = process.env.npm_lifecycle_event;

if (!require('fs').existsSync('release')) {
    require('fs').mkdirSync('release')
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