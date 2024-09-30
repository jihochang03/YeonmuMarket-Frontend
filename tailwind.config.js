/** @type {import('tailwindcss').Config} */
const headerHeight = 75;

export default {
  content: [
    "./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      spacing: {
        "main-frame": `calc(100vh * 0.6)`,
        "header-height": `${headerHeight}px`,
        "main-height": `calc(100vh - ${headerHeight}px)`,
      },
      colors: {
        "darker": "#F8F9FD",
        "button": "#E8DEF8",
        "dark-button": "#2C2C2C",
        "status-done": "#CFF7D3",
        "status-ing": "#FFE8A3",
        "status-wait": "#FDD3D0"

      }
    },
  },
  plugins: [],
}

