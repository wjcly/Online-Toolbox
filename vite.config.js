import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        // 修复 @zzk-1015/vue-onlyoffice-local 的样式导入问题
        extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.css'],
    },
    publicDir: 'public',
    // 优化依赖预构建
    optimizeDeps: {
        include: ['@zzk-1015/vue-onlyoffice-local'],
    },
});
