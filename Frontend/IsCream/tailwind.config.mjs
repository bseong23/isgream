// tailwind.config.mjs
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["MyFont", "sans-serif"]
      },
      colors: {
        "custom-green": "#009E28"
      }
    }
  },
  plugins: []
};
