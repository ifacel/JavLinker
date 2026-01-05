const { execSync } = require('child_process');
const lifecycleEvent = process.env.npm_lifecycle_event;

if (!require('fs').existsSync('release')) {
    require('fs').mkdirSync('release')
}
if (lifecycleEvent === 'postbuild:firefox') {
    const cmd = `npx web-ext build -s dist_firefox --artifacts-dir release --overwrite-dest `;
    execSync(cmd, { stdio: 'inherit' });
} else if (lifecycleEvent === 'postbuild:chrome') {
    const cmd = `npx crx pack dist_chrome -o release/JavLinker.crx -p JavLinker.pem`;
    execSync(cmd, { stdio: 'inherit' });
}