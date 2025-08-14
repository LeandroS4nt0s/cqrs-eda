import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      exclude: [
        "src/index.ts",
        "src/types/**",
        "src/**/*.d.ts",
        "vitest.config.ts",
      ],
    },
  },
});
