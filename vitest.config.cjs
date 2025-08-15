/** @type {import('vitest/config').UserConfig} */
module.exports = {
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      exclude: [
        "src/index.ts",
        "dist",
        "src/types/**",
        "src/**/*.d.ts",
        "vitest.config.cjs",
      ],
    },
  },
};
