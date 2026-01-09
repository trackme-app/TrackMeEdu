import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const envDir = path.resolve(process.cwd(), '../../');
    const env = loadEnv(mode, envDir, '');
    return {
        server: {
            proxy: {
                '/api': {
                    target: 'http://api-gateway:3000',
                    changeOrigin: false,
                },
            },
        },
        plugins: [
            react(),
            {
                name: 'html-env-transform',
                transformIndexHtml(html) {
                    return html.replace(/%(\w+)%/g, (match, p1) => {
                        return env[p1] ?? match;
                    });
                },
            },
        ],
    };
});
