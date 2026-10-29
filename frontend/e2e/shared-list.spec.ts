import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

async function clearNotes(request: APIRequestContext) {
  const res = await request.get(`${API}/notes`);
  const notes = (await res.json()) as { id: number }[];
  for (const n of notes) await request.delete(`${API}/notes/${n.id}`);
}

const input = (page: Page) => page.getByLabel(/Note \(max 280 characters\)/);
const addButton = (page: Page) => page.getByRole("button", { name: "Add note" });
const items = (page: Page) => page.locator("section[aria-labelledby='notes-list-title'] li");

test.describe.configure({ mode: "serial" });

// US-002 / AC-005: the list is one shared board, not a per-visitor view. Each test here
// opens a brand-new, unrelated browser context per "visitor" -- no shared cookies, local
// storage or auth state -- and never performs any login step, because the app has none.
test.describe("shared notes list is the same for every visitor", () => {
  test.beforeEach(async ({ request }) => {
    await clearNotes(request);
  });
  test.afterEach(async ({ request }) => {
    await clearNotes(request);
  });

  test("[AC-005] a note added by one visitor is seen by another visitor who opens the page", async ({
    browser,
  }) => {
    // Visitor A adds a note from a fresh, isolated context.
    const contextA = await browser.newContext();
    const visitorA = await contextA.newPage();
    await visitorA.goto("/notes");
    await input(visitorA).fill("shared across visitors");
    await addButton(visitorA).click();
    await expect(items(visitorA).first()).toContainText("shared across visitors");
    await contextA.close();

    // Visitor B opens the page from an entirely separate browser context: no cookies,
    // no storage, no auth state carried over from visitor A, and no login performed.
    const contextB = await browser.newContext();
    const visitorB = await contextB.newPage();
    await visitorB.goto("/notes");
    await expect(items(visitorB)).toHaveCount(1);
    await expect(items(visitorB).first()).toContainText("shared across visitors");
    await expect(visitorB.getByText(/log ?in/i)).toHaveCount(0);
    await contextB.close();
  });

  test("[AC-005] visitor B reloading the page picks up a note added by visitor A after B's first load", async ({
    browser,
  }) => {
    const contextB = await browser.newContext();
    const visitorB = await contextB.newPage();
    await visitorB.goto("/notes");
    await expect(items(visitorB)).toHaveCount(0);

    const contextA = await browser.newContext();
    const visitorA = await contextA.newPage();
    await visitorA.goto("/notes");
    await input(visitorA).fill("added while visitor B was already open");
    await addButton(visitorA).click();
    await expect(items(visitorA).first()).toContainText("added while visitor B was already open");
    await contextA.close();

    // Visitor B never logs in; reloading is the only action available to see new notes.
    await visitorB.reload();
    await expect(items(visitorB)).toHaveCount(1);
    await expect(items(visitorB).first()).toContainText("added while visitor B was already open");
    await contextB.close();
  });
});
