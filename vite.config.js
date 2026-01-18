import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tailwind plugin is not needed here, remove this:
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react()],
});
