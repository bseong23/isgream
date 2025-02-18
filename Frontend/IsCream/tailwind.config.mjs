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
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-10%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        slideDown: "slideDown 0.3s ease-out"
      }
    }
  },
  plugins: []
};
