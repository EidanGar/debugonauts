import testAuthData from "@/playwright/.auth/user.json"
import { expect, test as setup } from "@playwright/test"

const authFile = "playwright/.auth/user.json"

// TODO: Test user authentication with playwright

setup("authenticate", async ({ page }) => {
  await page.goto("/auth/signin")
  await page.getByLabel("Email").fill(testAuthData.email)
  await page.getByLabel("Password").fill(testAuthData.password)
  await page.getByRole("button", { name: /continue/i }).click()

  await expect(page.getByTestId("user-avatar")).toBeVisible()

  await page.context().storageState({ path: authFile })
})
