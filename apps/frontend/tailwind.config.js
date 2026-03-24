/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3F59",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [],
};
