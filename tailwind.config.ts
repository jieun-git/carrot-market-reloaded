import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--roboto-text)",
        rubik: "var(--rubik-text)",
        metallica: "var(--metallica-text)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
