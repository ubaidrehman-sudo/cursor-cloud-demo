import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
