import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f0f10",
        paper: "#050505",
        accent: "#ff0033",
        soft: "#f1f1f1",
        slate: "#606060"
      },
      boxShadow: {
        card: "0 18px 42px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "app-glow":
          "radial-gradient(circle at top, rgba(255, 0, 51, 0.22), transparent 24%), radial-gradient(circle at right 20%, rgba(255, 255, 255, 0.06), transparent 18%), linear-gradient(180deg, #090909 0%, #050505 100%)"
      }
    }
  },
  plugins: []
};

export default config;
