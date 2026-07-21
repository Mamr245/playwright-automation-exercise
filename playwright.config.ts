import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html']
  ],
  use: {
    baseURL: 'https://automationexercise.com',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-qa',
    trace: 'on-first-retry',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
})
