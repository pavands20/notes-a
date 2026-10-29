import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Screen from "./Notes";

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function note(id: number, text: string, created_at: string) {
  return { id, text, created_at };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetchImpl(handler: (url: string, init?: RequestInit) => Response) {
  (fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    async (url: string, init?: RequestInit) => handler(url, init),
  );
}

describe("Notes screen", () => {
  it("[AC-001] fetches from GET /notes and lists newest first", async () => {
    mockFetchImpl((url) => {
      expect(url).toContain("/notes");
      return jsonResponse([
        note(1, "older", "2024-01-01T00:00:00Z"),
        note(2, "newer", "2024-02-01T00:00:00Z"),
      ]);
    });
    render(<Screen />);
    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("newer")).toBeInTheDocument();
    expect(within(items[1]).getByText("older")).toBeInTheDocument();
  });

  it("[AC-002] shows each note's text and a creation timestamp", async () => {
    mockFetchImpl(() => jsonResponse([note(1, "hello world", "2024-03-05T10:30:00Z")]));
    render(<Screen />);
    expect(await screen.findByText("hello world")).toBeInTheDocument();
    const time = document.querySelector("time");
    expect(time).toBeInTheDocument();
    expect(time?.getAttribute("dateTime")).toBe(new Date("2024-03-05T10:30:00Z").toISOString());
  });

  it("[AC-003] shows the empty-state message and no error when there are no notes", async () => {
    mockFetchImpl(() => jsonResponse([]));
    render(<Screen />);
    expect(
      await screen.findByText("No notes yet. Add the first one above."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument();
  });

  it("[AC-004] shows all notes returned with no pagination", async () => {
    const many = Array.from({ length: 15 }, (_, i) =>
      note(i + 1, `note ${i + 1}`, `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`),
    );
    mockFetchImpl(() => jsonResponse(many));
    render(<Screen />);
    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(15);
  });

  it("[AC-006] submitting valid text POSTs, prepends the note and clears the input", async () => {
    const user = userEvent.setup();
    mockFetchImpl((url, init) => {
      if ((init?.method ?? "GET") === "GET" || !init) {
        return jsonResponse([note(1, "existing", "2024-01-01T00:00:00Z")]);
      }
      if (init.method === "POST") {
        return jsonResponse(note(2, "new note", "2024-05-01T00:00:00Z"), 201);
      }
      throw new Error("unexpected call");
    });
    render(<Screen />);
    await screen.findByText("existing");
    const textbox = screen.getByLabelText(/note \(max 280 characters\)/i);
    await user.type(textbox, "new note");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    const items = await screen.findAllByRole("listitem");
    expect(within(items[0]).getByText("new note")).toBeInTheDocument();
    expect(within(items[0]).getByText(/\d{4}/)).toBeInTheDocument();
    expect((textbox as HTMLTextAreaElement).value).toBe("");
  });

  it("[AC-007 / NFR-001] renders HTML/script-like text literally, not as markup", async () => {
    const malicious = "<script>alert('x')</script>";
    mockFetchImpl(() => jsonResponse([note(1, malicious, "2024-01-01T00:00:00Z")]));
    render(<Screen />);
    expect(await screen.findByText(malicious)).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });

  it("[AC-008] blocks submit on empty/whitespace input, makes no POST, shows the empty message", async () => {
    const user = userEvent.setup();
    mockFetchImpl(() => jsonResponse([]));
    render(<Screen />);
    await screen.findByText("No notes yet. Add the first one above.");
    const textbox = screen.getByLabelText(/note \(max 280 characters\)/i);
    await user.type(textbox, "   ");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(
      await within(document.getElementById("note-error") as HTMLElement).findByText(
        "A note cannot be empty",
      ),
    ).toBeInTheDocument();
    const postCalls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([, init]) => init?.method === "POST",
    );
    expect(postCalls).toHaveLength(0);
  });

  it("[AC-009] blocks submit over 280 characters, makes no POST, shows the limit message", async () => {
    const user = userEvent.setup();
    mockFetchImpl(() => jsonResponse([]));
    render(<Screen />);
    await screen.findByText("No notes yet. Add the first one above.");
    const textbox = screen.getByLabelText(/note \(max 280 characters\)/i);
    await user.type(textbox, "a".repeat(281));
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(
      await within(document.getElementById("note-error") as HTMLElement).findByText(
        /280 character/i,
      ),
    ).toBeInTheDocument();
    const postCalls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([, init]) => init?.method === "POST",
    );
    expect(postCalls).toHaveLength(0);
  });

  it("[AC-011] accepts exactly 280 characters and submits", async () => {
    const user = userEvent.setup();
    const text = "a".repeat(280);
    mockFetchImpl((url, init) => {
      if (init?.method === "POST") {
        expect(JSON.parse(init.body as string).text).toBe(text);
        return jsonResponse(note(2, text, "2024-05-01T00:00:00Z"), 201);
      }
      return jsonResponse([]);
    });
    render(<Screen />);
    await screen.findByText("No notes yet. Add the first one above.");
    const textbox = screen.getByLabelText(/note \(max 280 characters\)/i);
    await user.type(textbox, text);
    await user.click(screen.getByRole("button", { name: /add note/i }));
    await waitFor(() => {
      expect(
        (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.some(
          ([, init]) => init?.method === "POST",
        ),
      ).toBe(true);
    });
  });

  it("[AC-014 / NFR-008] deleting a note calls DELETE and removes it immediately without confirmation", async () => {
    const user = userEvent.setup();
    mockFetchImpl((url, init) => {
      if (init?.method === "DELETE") {
        expect(url).toContain("/notes/1");
        return jsonResponse(undefined, 204);
      }
      return jsonResponse([note(1, "to delete", "2024-01-01T00:00:00Z")]);
    });
    render(<Screen />);
    await screen.findByText("to delete");
    await user.click(screen.getByRole("button", { name: /delete note: to delete/i }));
    await waitFor(() => {
      expect(screen.queryByText("to delete")).not.toBeInTheDocument();
    });
  });

  it("[AC-016] any note shows a delete control with no login or ownership UI", async () => {
    mockFetchImpl(() => jsonResponse([note(1, "anyone's note", "2024-01-01T00:00:00Z")]));
    render(<Screen />);
    expect(
      await screen.findByRole("button", { name: /delete note: anyone's note/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/log ?in/i)).not.toBeInTheDocument();
  });

  it("[AC-017 / NFR-007] a 404 on delete refetches the list instead of crashing", async () => {
    const user = userEvent.setup();
    let getCount = 0;
    mockFetchImpl((url, init) => {
      if (init?.method === "DELETE") {
        return jsonResponse({ detail: "not found" }, 404);
      }
      getCount += 1;
      if (getCount === 1) {
        return jsonResponse([note(1, "gone already", "2024-01-01T00:00:00Z")]);
      }
      return jsonResponse([]);
    });
    render(<Screen />);
    await screen.findByText("gone already");
    await user.click(screen.getByRole("button", { name: /delete note: gone already/i }));
    expect(
      await screen.findByText("No notes yet. Add the first one above."),
    ).toBeInTheDocument();
    expect(getCount).toBeGreaterThanOrEqual(2);
  });

  it("a failed load shows a friendly error rather than crashing", async () => {
    mockFetchImpl(() => jsonResponse({ detail: "boom" }, 500));
    render(<Screen />);
    expect(
      await screen.findByText(/couldn't load your notes/i),
    ).toBeInTheDocument();
  });

  it("a rejected POST shows a validation message and keeps the draft", async () => {
    const user = userEvent.setup();
    mockFetchImpl((url, init) => {
      if (init?.method === "POST") {
        return jsonResponse({ detail: "invalid" }, 422);
      }
      return jsonResponse([]);
    });
    render(<Screen />);
    await screen.findByText("No notes yet. Add the first one above.");
    const textbox = screen.getByLabelText(/note \(max 280 characters\)/i);
    await user.type(textbox, "a valid draft");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(await screen.findByText(/couldn't save that note/i)).toBeInTheDocument();
    expect((textbox as HTMLTextAreaElement).value).toBe("a valid draft");
  });
});
