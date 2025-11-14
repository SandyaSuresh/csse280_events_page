import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions:{
      input: {
        'main': 'login.html',
        'menu': 'index.html',
        'explore': 'explore.html',
        'events': 'events.html',
        'profile': 'profile.html'
      }
    }
  }
})
