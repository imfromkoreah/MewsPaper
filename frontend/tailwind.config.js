// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",             // <- HTML 파일
    "./src/**/*.{js,ts,jsx,tsx}" // <- React 컴포넌트들
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
