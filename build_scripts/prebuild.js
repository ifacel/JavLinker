const lifecycleEvent = process.env.npm_lifecycle_event;
if (!require('fs').existsSync('release')) {
    require('fs').mkdirSync('release')
}
if (lifecycleEvent === 'prebuild:firefox' || lifecycleEvent === 'predev:firefox') {
    console.info("clean firefox dist");
    require('fs').rmSync('dist_firefox', { recursive: true, force: true })
    console.info("set firefox manifest");
    require('fs').copyFileSync('manifest_firefox.json', 'manifest.json')
} else if (lifecycleEvent === 'prebuild:chrome' || lifecycleEvent === 'predev:chrome') {
    console.info("clean chrome dist");
    require('fs').rmSync('dist_chrome', { recursive: true, force: true })
    console.info("set chrome manifest");
    require('fs').copyFileSync('manifest_chrome.json', 'manifest.json')
}