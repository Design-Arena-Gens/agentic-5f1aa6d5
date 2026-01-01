import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF"
        },
        accent: "#06B6D4",
        surface: "#0B1120"
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(79,70,229,0.2), transparent 40%), radial-gradient(circle at 80% 30%, rgba(6,182,212,0.2), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;

