// Import the tw-elements plugin using ES module syntax
import twElementsPlugin from "tw-elements/dist/plugin.cjs";
import tailwindcssAnimated from "tailwindcss-animated";
import tailwindcssPatterns from "tailwindcss-patterns";
import flowbitePlugin from "flowbite/plugin";
/** @type {import('tailwindcss').Config} */

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/tw-elements/dist/js/**/*.js",
		"node_modules/flowbite-react/lib/esm/**/*.js",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
	],
	transform: {},
	theme: {
		fontFamily: {
			bebas: ["Bebas Neue", "sans-serif"],
			cairoPlay: ["Cairo Play", "sans-serif"],
			jaldi: ["Jaldi", "sans-serif"],
			muktaVaani: ["Mukta Vaani", "sans-serif"],
			poppins: ["Poppins", "sans-serif"],
			ptSansCaption: ["PT Sans Caption", "sans-serif"],
		},
		extend: {
			colors: {
				darkieGreen: {
					100: "#e3e8e0",
					200: "#c7d2c1",
					300: "#acbba1",
					400: "#90a582",
					500: "#748e63",
					600: "#5d724f",
					700: "#46553b",
					800: "#2e3928",
					900: "#171c14",
				},
				lightieGreen: "#99B080",
				middieBlue: "#101720",
				trumpieOrange: "#F9B572",
			},
		},
	},
	plugins: [
		twElementsPlugin,
		tailwindcssAnimated,
		tailwindcssPatterns,
		flowbitePlugin,
	],
	darkMode: "class",
	safelist: [
		"!duration-[0ms]",
		"!delay-[0ms]",
		'html.js :where([class*="taos:"]:not(.taos-init))',
	],
};
