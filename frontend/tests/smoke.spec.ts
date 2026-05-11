import { expect, test } from "@playwright/test";

test("homepage smoke flow creates a task", async ({ page }) => {
  const taskTitle = `playwright-smoke-${Date.now()}`;

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Task Manager" })).toBeVisible();

  await page.getByLabel("Title").fill(taskTitle);
  await page.getByRole("button", { name: "Add Task" }).click();

  await expect(page.getByLabel("Title")).toHaveValue("");
  await expect(page.locator("span").filter({ hasText: taskTitle })).toBeVisible();
});
