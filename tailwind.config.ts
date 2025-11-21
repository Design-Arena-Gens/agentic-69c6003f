import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4f46e5",
          foreground: "#ffffff",
        },
      },
      boxShadow: {
        card: "0 10px 25px -5px rgba(79,70,229,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
