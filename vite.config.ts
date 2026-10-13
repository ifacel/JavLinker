import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
    console.log("mode:" + mode);

    if (mode === 'firefox') {
        return {
            plugins: [crx({ manifest: { ...manifest, version: pkg.version }, browser: 'firefox' })],
            server: {
                port: 5174,
                strictPort: true,
                cors: true,
                hmr: {
                    host: 'localhost',
                },
            },
            build: {
                outDir: 'dist_firefox',
            }
        }
    }

    // 默认为 chrome 配置，确保函数始终返回一个有效的 UserConfig 对象
    return {
        plugins: [crx({ manifest: { ...manifest, version: pkg.version } })],
        server: {
            port: 5173,
            strictPort: true,
            cors: true,
            hmr: {
                host: 'localhost',
            },
        },
        build: {
            outDir: 'dist_chrome',
        }
    }
})
