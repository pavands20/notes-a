import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

const uid = () => Math.random().toString(16).slice(2, 12) + Date.now().toString(16);

async function seed(request: APIRequestContext, text: string) {
  const res = await request.post(`${API}/notes`, { data: { text } });
  expect(res.status()).toBe(201);
  return (await res.json()) as { id: number; text: string };
}

async function deleteByPrefix(request: APIRequestContext, prefix: string) {
  const res = await request.get(`${API}/notes`);
  const notes = (await res.json()) as { id: number; text: string }[];
  for (const n of notes) {
    if (n.text.startsWith(prefix)) await request.delete(`${API}/notes/${n.id}`);
  }
}

const input = (page: Page) => page.getByLabel(/Note \(max 280 characters\)/);
const addButton = (page: Page) => page.getByRole("button", { name: "Add note" });
const items = (page: Page) => page.locator("section[aria-labelledby='notes-list-title'] li");

const PREFIX = "qa-us002-";

test.describe("shared notes", () => {
  test.afterEach(async ({ request }) => {
    await deleteByPrefix(request, PREFIX);
  });

  test("[AC-005] a note added by visitor A is visible to visitor B without login, and after reload", async ({
    browser,
  }) => {
    const text = `${PREFIX}shared-${uid()}`;

    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    try {
      const a = await contextA.newPage();
      await a.goto("/notes");
      await input(a).fill(text);
      await addButton(a).click();
      await expect(items(a).filter({ hasText: text })).toHaveCount(1);

      const b = await contextB.newPage();
      await b.goto("/notes");
      await expect(items(b).filter({ hasText: text })).toHaveCount(1);
      await expect(b.getByRole("textbox", { name: /password|username|email/i })).toHaveCount(0);

      await b.reload();
      await expect(items(b).filter({ hasText: text })).toHaveCount(1);
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });

  test("[AC-012] notes list items offer no edit control and text is not contenteditable", async ({
    page,
    request,
  }) => {
    const texts = [`${PREFIX}one-${uid()}`, `${PREFIX}two-${uid()}`];
    for (const t of texts) await seed(request, t);

    await page.goto("/notes");
    for (const t of texts) {
      await expect(items(page).filter({ hasText: t })).toHaveCount(1);
    }

    for (const t of texts) {
      const li = items(page).filter({ hasText: t });
      const editName = /edit|update|modify/i;
      await expect(li.getByRole("button", { name: editName })).toHaveCount(0);
      await expect(li.getByRole("link", { name: editName })).toHaveCount(0);
      await expect(li.getByRole("textbox")).toHaveCount(0);
      await expect(li.locator("input, textarea, select, a")).toHaveCount(0);

      // the only button is Delete note
      const buttons = li.getByRole("button");
      await expect(buttons).toHaveCount(1);
      await expect(buttons.first()).toHaveAccessibleName(/^Delete note/);

      // nothing is contenteditable
      await expect(li.locator("[contenteditable]:not([contenteditable='false'])")).toHaveCount(0);
      const editable = await li.locator("p").evaluateAll((els) =>
        els.map((e) => (e as HTMLElement).isContentEditable),
      );
      expect(editable.length).toBeGreaterThan(0);
      expect(editable.every((v) => v === false)).toBe(true);
    }
  });
});
