import { defineConfig, loadEnv } from 'vite'
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react'
dotenv.config({ path: '../.env' });
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
