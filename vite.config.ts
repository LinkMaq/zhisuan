import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBase = process.env.VITE_BASE_PATH ?? (repositoryName ? `/${repositoryName}/` : "/");

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? githubPagesBase : "/",
  plugins: [react(), tailwindcss()],
});
