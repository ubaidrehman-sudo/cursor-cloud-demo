import { expect, test } from "@playwright/test";

test("homepage smoke flow creates a task", async ({ page }) => {
  const taskTitle = `playwright-smoke-${Date.now()}`;
  const tasks: Array<{
    id: number;
    title: string;
    status: "TODO";
    priority: "low" | "medium" | "high";
    createdAt: string;
  }> = [];
  let nextId = 1;

  await page.route("**/tasks", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(tasks),
      });
      return;
    }

    if (method === "POST") {
      const body = route.request().postDataJSON() as {
        title?: string;
        priority?: "low" | "medium" | "high";
      };
      const task = {
        id: nextId++,
        title: body.title ?? "",
        status: "TODO" as const,
        priority: body.priority ?? "medium",
        createdAt: new Date().toISOString(),
      };
      tasks.unshift(task);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(task),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Task Manager" })).toBeVisible();

  await page.getByLabel("Title").fill(taskTitle);
  await page.getByRole("button", { name: "Add Task" }).click();

  await expect(page.getByLabel("Title")).toHaveValue("");
  await expect(page.locator("span").filter({ hasText: taskTitle })).toBeVisible();
});
