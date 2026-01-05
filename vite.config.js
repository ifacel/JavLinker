import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig(({ mode }) => {
    return {
        plugins: [crx({ manifest })],
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
            outDir: mode === 'chrome' ? 'dist_chrome' : 'dist_firefox',
        }
    }
})