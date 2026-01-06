import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import chrome_manifest from './manifest_chrome.json'
import firefox_manifest from './manifest_firefox.json'

export default defineConfig(({ mode }) => {
    console.log("mode:" + mode);

    switch (mode) {
        case 'chrome':
            return {
                plugins: [crx({ manifest: chrome_manifest })],
                server: {
                    port: 5173,
                    strictPort: true,
                    // --- 关键配置开始 ---
                    cors: true, // 允许所有源跨域
                    hmr: {
                        host: 'localhost',
                    },
                    // --- 关键配置结束 ---
                },
                build: {
                    outDir: 'dist_chrome',
                }
            }
        case 'firefox':
            return {
                plugins: [crx({ manifest: firefox_manifest, browser: 'firefox' })],
                server: {
                    port: 5174,
                    strictPort: true,
                    // --- 关键配置开始 ---
                    cors: true, // 允许所有源跨域
                    hmr: {
                        host: 'localhost',
                    },
                    // --- 关键配置结束 ---
                },
                build: {
                    outDir: 'dist_firefox',
                }
            }
    }
})