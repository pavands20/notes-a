import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

async function clearNotes(request: APIRequestContext) {
  const res = await request.get(`${API}/notes`);
  const notes = (await res.json()) as { id: number }[];
  for (const n of notes) await request.delete(`${API}/notes/${n.id}`);
}

async function seed(request: APIRequestContext, text: string) {
  const res = await request.post(`${API}/notes`, { data: { text } });
  expect(res.status()).toBe(201);
  return (await res.json()) as { id: number; text: string; created_at: string };
}

const input = (page: Page) => page.getByLabel(/Note \(max 280 characters\)/);
const addButton = (page: Page) => page.getByRole("button", { name: "Add note" });

const items = (page: Page) => page.locator("section[aria-labelledby='notes-list-title'] li");
const errorBox = (page: Page) => page.locator("#note-error");

test.describe.configure({ mode: "serial" });

test.describe("notes page", () => {
  test.beforeEach(async ({ request, page }) => {
    await clearNotes(request);
    page.on("dialog", async (d) => {
      throw new Error(`unexpected dialog: ${d.message()}`);
    });
  });
  test.afterEach(async ({ request }) => {
    await clearNotes(request);
  });

  test("[AC-001][AC-002] lists seeded notes newest first with text and timestamp", async ({ page, request }) => {
    await seed(request, "first note");
    await seed(request, "second note");
    await seed(request, "third note");
    await page.goto("/notes");
    await expect(items(page)).toHaveCount(3);
    await expect(items(page).nth(0)).toContainText("third note");
    await expect(items(page).nth(1)).toContainText("second note");
    await expect(items(page).nth(2)).toContainText("first note");
    for (let i = 0; i < 3; i++) {
      const t = items(page).nth(i).locator("time");
      await expect(t).toBeVisible();
      await expect(t).not.toHaveText("");
    }
  });

  test("[AC-003][NFR-007] empty state shown with no error when there are no notes", async ({ page }) => {
    await page.goto("/notes");
    await expect(page.getByText(/No notes yet/)).toBeVisible();
    await expect(items(page)).toHaveCount(0);
    await expect(errorBox(page)).toHaveText("");
  });

  test("[AC-004] many notes are all shown without pagination", async ({ page, request }) => {
    for (let i = 1; i <= 30; i++) await seed(request, `bulk note ${i}`);
    await page.goto("/notes");
    await expect(items(page)).toHaveCount(30);
    await expect(items(page).first()).toContainText("bulk note 30");
    await expect(items(page).last()).toContainText("bulk note 1");
  });

  test("[AC-006][NFR-008] adding a note puts it on top with a timestamp and clears input", async ({ page, request }) => {
    await seed(request, "older note");
    await page.goto("/notes");
    await input(page).fill("my new note");
    await addButton(page).click();
    await expect(items(page).first()).toContainText("my new note");
    await expect(items(page).first().locator("time")).toBeVisible();
    await expect(input(page)).toHaveValue("");
    await expect(items(page)).toHaveCount(1 + 1);
  });

  test("[AC-007][NFR-001] markup is displayed as literal text and no script executes", async ({ page }) => {
    const payload = "<b>x</b><script>alert(1)</script>";
    await page.goto("/notes");
    await input(page).fill(payload);
    await addButton(page).click();
    await expect(items(page).first()).toContainText(payload);
    await expect(items(page).first().locator("b, script")).toHaveCount(0);
    // a dialog would throw via the handler in beforeEach
    await page.reload();
    await expect(items(page).first()).toContainText(payload);
    await expect(items(page).first().locator("b, script")).toHaveCount(0);
  });

  test("[AC-008][NFR-007] empty and whitespace submit creates no note and shows message", async ({ page, request }) => {
    await page.goto("/notes");
    await addButton(page).click();
    await expect(errorBox(page)).toContainText(/cannot be empty/i);
    await input(page).fill("   ");
    await addButton(page).click();
    await expect(errorBox(page)).toContainText(/cannot be empty/i);
    await expect(items(page)).toHaveCount(0);
    const list = (await (await request.get(`${API}/notes`)).json()) as unknown[];
    expect(list).toHaveLength(0);
  });

  test("[AC-009][NFR-007] 281 characters creates no note and shows the limit message", async ({ page, request }) => {
    await page.goto("/notes");
    await input(page).fill("a".repeat(281));
    await addButton(page).click();
    await expect(errorBox(page)).toContainText(/280 characters/);
    await expect(items(page)).toHaveCount(0);
    const list = (await (await request.get(`${API}/notes`)).json()) as unknown[];
    expect(list).toHaveLength(0);
  });

  test("[AC-011] exactly 280 characters is accepted", async ({ page, request }) => {
    await page.goto("/notes");
    await input(page).fill("b".repeat(280));
    await addButton(page).click();
    await expect(items(page)).toHaveCount(1);
    await expect(errorBox(page)).toHaveText("");
    const list = (await (await request.get(`${API}/notes`)).json()) as { text: string }[];
    expect(list).toHaveLength(1);
    expect(list[0].text).toHaveLength(280);
  });

  test("[AC-014] delete removes the note immediately with no confirm dialog", async ({ page, request }) => {
    await seed(request, "keep me");
    await seed(request, "delete me");
    await page.goto("/notes");
    await expect(items(page)).toHaveCount(2);
    await page.getByRole("button", { name: "Delete note: delete me" }).click();
    await expect(items(page)).toHaveCount(1);
    await expect(page.getByText("delete me")).toHaveCount(0);
  });

  test("[AC-015][AC-016][AC-018] deleted note stays gone and remaining notes persist after reload", async ({ page, request }) => {
    await seed(request, "persist one");
    await seed(request, "persist two");
    await seed(request, "remove me");
    await page.goto("/notes");
    await page.getByRole("button", { name: "Delete note: remove me" }).click();
    await expect(items(page)).toHaveCount(2);
    await page.reload();
    await expect(items(page)).toHaveCount(2);
    await expect(items(page).nth(0)).toContainText("persist two");
    await expect(items(page).nth(1)).toContainText("persist one");
    await expect(page.getByText("remove me")).toHaveCount(0);
    const list = (await (await request.get(`${API}/notes`)).json()) as { text: string }[];
    expect(list.map((n) => n.text)).toEqual(["persist two", "persist one"]);
  });

  test("[AC-017][NFR-007] deleting a note already deleted elsewhere refreshes the list without crashing", async ({ page, request }) => {
    const gone = await seed(request, "already gone");
    await seed(request, "still here");
    const errors: Error[] = [];
    page.on("pageerror", (e) => errors.push(e));
    await page.goto("/notes");
    await expect(items(page)).toHaveCount(2);
    const del = await request.delete(`${API}/notes/${gone.id}`);
    expect(del.status()).toBe(204);
    await page.getByRole("button", { name: "Delete note: already gone" }).click();
    await expect(items(page)).toHaveCount(1);
    await expect(items(page).first()).toContainText("still here");
    await expect(page.getByRole("heading", { name: "Add a note" })).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});
