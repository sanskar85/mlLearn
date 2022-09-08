/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				dark: '#1F1E1E',
				light: '#F9EDED',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
};
