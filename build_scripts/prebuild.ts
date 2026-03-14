import * as fs from 'fs';

const lifecycleEvent = process.env.npm_lifecycle_event;

if (!fs.existsSync('release')) {
    fs.mkdirSync('release')
}

switch (lifecycleEvent) {
    case 'prebuild:firefox':
    case 'predev:firefox':
        console.info("clean firefox dist");
        fs.rmSync('dist_firefox', { recursive: true, force: true })
        break;

    case 'prebuild:chrome':
    case 'predev:chrome':
        console.info("clean chrome dist");
        fs.rmSync('dist_chrome', { recursive: true, force: true })
        break;
}
