import { execSync } from 'child_process';
import * as fs from 'fs';

const lifecycleEvent = process.env.npm_lifecycle_event;

if (!fs.existsSync('release')) {
    fs.mkdirSync('release')
}
const version = process.env.npm_package_version;

function getVersion(distDir: string): string {
    const path = `${distDir}/manifest.json`;
    if (!fs.existsSync(path)) {
        throw new Error(`找不到 ${path}，检查 Vite outDir 是否正确`);
    }
    const manifest = JSON.parse(fs.readFileSync(path, 'utf-8'));
    if (!manifest.version) {
        throw new Error(`${path} 里没有 version 字段`);
    }
    return manifest.version;
}
//加一个文件名后缀

function buildZip(distDir: string, outDir: string, platform: string, suffix: string) {
    const version = getVersion(distDir);
    const filename = `jav_linker-${version}-${platform}${suffix}`;
    const cmd = `npx web-ext build --source-dir ${distDir} --artifacts-dir ${outDir} --overwrite-dest --filename "${filename}"`;
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
}

switch (lifecycleEvent) {
    case 'postbuild:chrome': {
        buildZip('./dist_chrome', './release', 'chrome', ".zip");
        // const cmd = `npx web-ext build --source-dir ./dist_chrome --artifacts-dir ./release --overwrite-dest --filename "javlinker-${version}-chrome.zip"`;
        // execSync(cmd, { stdio: 'inherit' });
        break;
    }
    case 'postbuild:firefox': {
        buildZip('./dist_firefox', './release', 'firefox', ".xpi");
        // const cmd = `npx web-ext build --source-dir ./dist_firefox --artifacts-dir ./release --overwrite-dest --filename "javlinker-${version}-firefox.zip"`;
        // execSync(cmd, { stdio: 'inherit' });
        break;
    }
    case 'postdev:firefox': {
        const cmd = `npx web-ext run --source-dir dist_firefox`;
        execSync(cmd, { stdio: 'inherit' });
        break;
    }
}
