import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fx-risk-lot-calculator/', // GitHub Pages の下層パス
})
