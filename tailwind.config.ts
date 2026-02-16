import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        card: "#18181b",
        muted: "#27272a",
        accent: "#14b8a6",
      },
    },
  },
  plugins: [],
};

export default config;
