/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode
        'saas-light-bg': '#F1FAEE',
        'saas-light-text': '#1D3557',
        'saas-primary': '#457B9D',
        'saas-accent': '#E63946',
        // Dark Mode
        'saas-dark-bg': '#1D3557',
        'saas-dark-text': '#F1FAEE',
        'saas-dark-primary': '#A8DADC',
      }
    },
  },
  plugins: [],
}