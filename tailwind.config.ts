import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema "Oráculo de Tassa" - Paleta Azul de Thassa com toques de Âmbar/Dourado
        thassa: {
          900: "#0a0e1a", // Fundo escuro principal (slate-900 profundo)
          800: "#0f1626",
          700: "#1a2332",
          600: "#243049",
          500: "#2d3e5c",
          400: "#3b4f6e",
          300: "#4a5f7d",
        },
        amber: {
          400: "#fbbf24", // Toque de dourado/âmbar para destaque
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        // Cabeçalhos: Beleren (serifada elegante - remete à fantasia MTG)
        // Inter (sem serifa limpa para interface)
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        "thassa-glow": "0 0 20px -5px rgba(59, 130, 246, 0.3)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px -5px rgba(59, 130, 246, 0.4)" },
          "50%": { boxShadow: "0 0 20px -5px rgba(59, 130, 246, 0.6)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;