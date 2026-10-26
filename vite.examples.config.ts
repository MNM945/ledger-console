import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './', plugins:[react()],
  build:{outDir:'dist-examples',cssCodeSplit:false,rollupOptions:{input:'article-examples.html',output:{inlineDynamicImports:true}}},
});
