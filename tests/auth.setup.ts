import { expect, test } from "@playwright/test"

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/")
  await page.getByRole("link", { name: "Sign in" }).click()
  await page.getByPlaceholder("placeholder@example.com").click()
  await page
    .getByPlaceholder("placeholder@example.com")
    .fill("johnDoe12@gmail.com")
  await page.getByLabel("Password").click()
  await page.getByLabel("Password").fill("123456Jd!")
  await page.getByRole("button", { name: "Continue Sign in" }).click()
  await page.goto("http://localhost:3000/")
  await expect(page.getByRole("img", { name: "John Doe" })).toBeVisible()
})
