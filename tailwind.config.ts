import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        united: {
          red: "#e21b22",
          deep: "#070d10",
          panel: "#0d171b",
          line: "#24343a",
          gold: "#f2b705",
          green: "#22c55e"
        }
      },
      boxShadow: {
        glow: "0 0 28px rgba(226, 27, 34, 0.18)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.24)"
      }
    }
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    })
  ]
};

export default config;
