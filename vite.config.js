import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { redact } from "@tanstack/redact/vite";

export default defineConfig(({ mode }) => ({
  plugins: mode === "react" ? [react()] : [react(), redact()],
  define: {
    __RUNTIME__: JSON.stringify(mode === "react" ? "React" : "Redact"),
  },
}));
