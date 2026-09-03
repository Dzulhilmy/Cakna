import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	server: {
		port: parseInt(process.env.PORT ?? '3001')
	},
	ssr: {
		noExternal: ['svelte-sonner']
	}
});
