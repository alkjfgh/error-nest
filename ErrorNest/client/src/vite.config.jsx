import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    root: './src',
    // 기타 다른 설정들...

    esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        loader: {
            '.js': 'jsx' // .js 파일의 로더를 'jsx'로 설정
        },
    },

    resolve: {
        alias: {
            // 다른 설정들...
            '.js': '.jsx', // .js 파일을 .jsx 파일로 해석
        },
    },


    plugins: [react()]
});
