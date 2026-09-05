/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F7F3",
        surface: "#FFFFFF",
        ink: "#171A1C",
        muted: "#52585B",
        faint: "#6B7275",
        border: "#E4E1D8",
        current: {
          DEFAULT: "#176B87",
          dark: "#124F63",
          light: "#E4EFF2",
        },
        success: {
          DEFAULT: "#2F7D5C",
          light: "#E5F1EB",
        },
        warn: {
          DEFAULT: "#A9702F",
          light: "#F3EBDE",
        },
        danger: {
          DEFAULT: "#B54339",
          light: "#F5E7E4",
        },
      },
      fontFamily: {
        sans: [
          "General Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1120px",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(23, 26, 28, 0.04), 0 1px 1px rgba(23, 26, 28, 0.03)",
        card: "0 2px 8px rgba(23, 26, 28, 0.06)",
        raised: "0 8px 24px rgba(23, 26, 28, 0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        dot1: "pulse 1.2s ease-in-out infinite",
        dot2: "pulse 1.2s ease-in-out 0.15s infinite",
        dot3: "pulse 1.2s ease-in-out 0.3s infinite",
      },
    },
  },
  plugins: [],
};
