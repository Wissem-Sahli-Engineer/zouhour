/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8B5CF6",
          dark: "#7c4de0",
          wash: "#ede9fe",
        },
        accent: {
          pink: "#EC4899",
          yellow: "#F5D033",
          orange: "#F0924B",
        },
        ink: "#1a1a1a",
        muted: "#8a8a8f",
        line: "#e7e7ea",
        canvas: "#e9e9ec",
        surface: "#f4f4f6",
        danger: "#e0455f",
        success: "#12a150",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        label: ["12.5px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.45" }],
        btn: ["14.5px", { lineHeight: "1.2", fontWeight: "600" }],
      },
      spacing: {
        4.5: "18px",
        11.5: "45px",
      },
      borderRadius: {
        card: "24px",
        btn: "12px",
        field: "10px",
        drop: "18px",
        thumb: "6px",
        nav: "12px",
      },
      boxShadow: {
        login: "0 30px 60px -20px rgba(0,0,0,0.25)",
        soft: "0 10px 30px rgba(0,0,0,0.05)",
        bar: "0 4px 20px rgba(0,0,0,0.05)",
        toast: "0 10px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
