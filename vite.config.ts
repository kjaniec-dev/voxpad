import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync } from 'node:fs'

const localUiDist = '/Users/kjaniec-dev/dev/projects/kj-product-kit-starter/packages/ui/dist/index.js'
const localUiCss = '/Users/kjaniec-dev/dev/projects/kj-product-kit-starter/packages/ui/dist/ui.css'
const useLocalUiDist = existsSync(localUiDist) && existsSync(localUiCss)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: useLocalUiDist
      ? [
          { find: /^@kjaniec-dev\/ui$/, replacement: localUiDist },
          { find: /^@kjaniec-dev\/ui\/ui\.css$/, replacement: localUiCss },
        ]
      : [],
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: useLocalUiDist ? ['@kjaniec-dev/ui'] : [],
  },
})
