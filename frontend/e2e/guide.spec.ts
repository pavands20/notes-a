import { expect, test } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

test("[AC-026][NFR-005] app is reachable in a browser and backend is healthy", async ({
  page,
  request,
}) => {
  const health = await request.get(`${API}/health`);
  expect(health.ok()).toBeTruthy();
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
  await page.goto("/notes");
  await expect(page.getByRole("button", { name: "Add note" })).toBeVisible();
});
