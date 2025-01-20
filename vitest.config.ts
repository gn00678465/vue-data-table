import { fileURLToPath } from "node:url"
import { configDefaults, defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**", "packages/**", "docs/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
    },
  }),
)