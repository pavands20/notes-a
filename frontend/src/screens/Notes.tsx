// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { apiFetch } from "@/lib/api";

const { Select } = UI;

const { Search } = Icons;

const PRODUCT = "Notes A";
const SCREEN = "Notes board";
const mix = (colour, percent) => `color-mix(in srgb, ${colour} ${percent}%, transparent)`;

const ROWS = [
  {
    id: "R-2201",
    name: "Riverside onboarding",
    owner: "M. Chen",
    status: "Open",
    priority: "High",
    due: "Oct 14",
    value: 12400,
  },
  {
    id: "R-2202",
    name: "Harbor renewal",
    owner: "L. Park",
    status: "Blocked",
    priority: "High",
    due: "Oct 09",
    value: 18300,
  },
  {
    id: "R-2203",
    name: "Summit pilot",
    owner: "A. Silva",
    status: "Open",
    priority: "Medium",
    due: "Oct 15",
    value: 7600,
  },
  {
    id: "R-2204",
    name: "Lakeside audit",
    owner: "T. Reid",
    status: "Closed",
    priority: "Low",
    due: "Oct 01",
    value: 3250,
  },
  {
    id: "R-2205",
    name: "Northgate import",
    owner: "M. Chen",
    status: "Open",
    priority: "Medium",
    due: "Oct 18",
    value: 4900,
  },
  {
    id: "R-2206",
    name: "Pinecrest contract",
    owner: "A. Silva",
    status: "Open",
    priority: "High",
    due: "Oct 20",
    value: 22050,
  },
  {
    id: "R-2207",
    name: "Oakwood review",
    owner: "L. Park",
    status: "Closed",
    priority: "Low",
    due: "Sep 28",
    value: 11980,
  },
  {
    id: "R-2208",
    name: "Bayview expansion",
    owner: "T. Reid",
    status: "Blocked",
    priority: "Medium",
    due: "Oct 22",
    value: 26400,
  },
  {
    id: "R-2209",
    name: "Kestrel migration",
    owner: "M. Chen",
    status: "Open",
    priority: "Low",
    due: "Oct 25",
    value: 6100,
  },
];
const VIEWS = ["All", "Open", "Blocked", "Closed"];

const NOTE_LIMIT = 280;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const formatStamp = (d) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Converts an API note ({id, text, created_at: string}) into the shape the
// screen renders ({..., created_at: Date}).
const parseNote = (n) => ({ ...n, created_at: new Date(n.created_at) });

export default function Screen() {
  const [view, setView] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [picked, setPicked] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  const [noteError, setNoteError] = React.useState("");
  const [loadError, setLoadError] = React.useState("");
  const rule = `2px solid ${brand.primaryColor}`;
  const hair = `1px solid ${mix(brand.primaryColor, 16)}`;
  const rows = ROWS.filter(
    (r) =>
      (view === "All" || r.status === view) &&
      `${r.id} ${r.name} ${r.owner}`.toLowerCase().includes(query.toLowerCase()),
  );
  const toggle = (id) =>
    setPicked(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id]);

  const loadNotes = React.useCallback(async () => {
    try {
      const data = await apiFetch("/notes");
      setNotes(data.map(parseNote));
      setLoadError("");
    } catch {
      setLoadError("We couldn't load your notes. Please try again shortly.");
    }
  }, []);

  React.useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const sortedNotes = [...notes].sort((a, b) => b.created_at - a.created_at || b.id - a.id);
  const overLimit = draft.length > NOTE_LIMIT;

  const submitNote = async (e) => {
    e.preventDefault();
    if (draft.trim().length === 0) {
      setNoteError("A note cannot be empty");
      return;
    }
    if (draft.length > NOTE_LIMIT) {
      setNoteError("Notes are limited to 280 characters");
      return;
    }
    try {
      const created = await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ text: draft }),
      });
      setNotes((prev) => [parseNote(created), ...prev]);
      setDraft("");
      setNoteError("");
    } catch {
      setNoteError("We couldn't save that note. Please try again.");
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiFetch(`/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      if (String(err?.message ?? "").includes("404")) {
        await loadNotes();
      } else {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    }
  };

  return (
    <div className="bg-white" style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}>
      <div className="flex items-end justify-between pb-4" style={{ borderBottom: rule }}>
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: brand.neutralColor }}
          >
            {PRODUCT}
          </p>
          <h1
            data-wf="b-0-0"
            className="mt-1 text-3xl font-bold tracking-tight"
            style={{ fontFamily: brand.fontHeading }}
          >
            Shared notes
          </h1>
        </div>
        <button
          type="button"
          className="h-9 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white"
          style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}
        >
          + New record
        </button>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2 px-3 py-2 text-xs font-semibold"
          style={{ border: `2px solid ${brand.accentColor}`, color: brand.accentColor }}
        >
          <Icons.AlertCircle aria-hidden="true" className="h-4 w-4" />
          <span>{loadError}</span>
        </div>
      ) : null}

      <form
        id="note-form"
        data-wf="b-1-0"
        onSubmit={submitNote}
        noValidate
        className="py-4"
        aria-labelledby="note-form-title"
      >
        <h2 id="note-form-title" className="text-sm font-bold uppercase tracking-[0.14em]">
          Add a note
        </h2>
        <label
          htmlFor="note-text"
          className="mt-3 block text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: brand.neutralColor }}
        >
          Note (max 280 characters)
        </label>
        <textarea
          id="note-text"
          data-wf="i-1-0-0"
          rows={3}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (noteError) setNoteError("");
          }}
          aria-invalid={noteError ? "true" : "false"}
          aria-describedby="note-error note-count"
          className="mt-1 block w-full bg-white px-3 py-2 text-sm"
          style={{
            border: `2px solid ${noteError || overLimit ? brand.accentColor : brand.primaryColor}`,
            borderRadius: brand.radius,
            color: brand.primaryColor,
            fontFamily: brand.fontBody,
          }}
        />
        <div className="mt-2 flex items-start justify-between gap-4 text-xs font-semibold">
          <div id="note-error" data-wf="i-1-0-1" role="alert" style={{ color: brand.accentColor }}>
            {noteError ? (
              <span className="flex items-center gap-1">
                <Icons.AlertCircle aria-hidden="true" className="h-4 w-4" />
                <span>{noteError}</span>
              </span>
            ) : null}
          </div>
          <p
            id="note-count"
            data-wf="i-1-0-2"
            className="tabular-nums"
            style={{
              fontVariantNumeric: "tabular-nums",
              color: overLimit ? brand.accentColor : brand.neutralColor,
            }}
          >
            {draft.length} / {NOTE_LIMIT}
          </p>
        </div>
      </form>

      <div className="pb-4">
        <button
          type="submit"
          form="note-form"
          data-wf="b-2-0"
          className="inline-flex h-9 items-center gap-2 px-4 text-xs font-bold uppercase tracking-[0.14em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            backgroundColor: brand.primaryColor,
            borderRadius: brand.radius,
            outlineColor: brand.primaryColor,
          }}
        >
          <Icons.Plus aria-hidden="true" className="h-4 w-4" />
          Add note
        </button>
      </div>

      <section data-wf="b-3-0" aria-labelledby="notes-list-title" className="pb-4">
        <h2
          id="notes-list-title"
          className="pb-2 text-sm font-bold uppercase tracking-[0.14em]"
          style={{ borderBottom: rule }}
        >
          Notes, newest first
        </h2>
        {sortedNotes.length > 0 ? (
          <ul>
            {sortedNotes.map((n, i) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-4 py-2"
                style={{ borderBottom: hair }}
              >
                <div className="min-w-0">
                  <p className="break-words text-[13px] font-semibold">{n.text}</p>
                  <time
                    dateTime={n.created_at.toISOString()}
                    className="text-xs tabular-nums"
                    style={{ fontVariantNumeric: "tabular-nums", color: brand.neutralColor }}
                  >
                    {formatStamp(n.created_at)}
                  </time>
                </div>
                <button
                  type="button"
                  data-wf={`i-3-0-${i}`}
                  aria-label={`Delete note: ${n.text}`}
                  onClick={() => deleteNote(n.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center hover:bg-black/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    border: rule,
                    borderRadius: brand.radius,
                    outlineColor: brand.primaryColor,
                  }}
                >
                  <Icons.X aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {sortedNotes.length === 0 && !loadError ? (
        <div
          data-wf="b-4-0"
          className="py-10 text-center text-sm font-semibold"
          style={{ borderBottom: hair }}
        >
          No notes yet. Add the first one above.
        </div>
      ) : null}

      <div className="flex items-center gap-4 py-4">
        <div
          role="group"
          aria-label="View"
          className="flex"
          style={{ border: rule, borderRadius: brand.radius }}
        >
          {VIEWS.map((v, i) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="h-9 px-4 text-xs font-bold uppercase tracking-[0.14em]"
              style={{
                borderLeft: i ? rule : "none",
                backgroundColor: view === v ? brand.primaryColor : "#fff",
                color: view === v ? "#fff" : brand.primaryColor,
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <label htmlFor="corp-search" className="sr-only">
          Search
        </label>
        <input
          id="corp-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ID, name or owner"
          className="h-9 w-72 bg-white px-3 text-sm outline-none"
          style={{ border: rule, borderRadius: brand.radius }}
        />
        <p className="ml-auto text-xs font-semibold tabular-nums">
          {picked.length ? `${picked.length} selected` : `${rows.length} records`}
        </p>
        <button
          type="button"
          disabled={!picked.length}
          className="h-9 px-4 text-xs font-bold uppercase tracking-[0.14em] disabled:opacity-30"
          style={{ border: rule, borderRadius: brand.radius }}
        >
          Assign
        </button>
      </div>

      <table className="w-full text-[13px]" style={{ borderTop: rule }}>
        <thead>
          <tr
            className="text-left text-[11px] uppercase tracking-[0.14em]"
            style={{ borderBottom: rule, color: brand.neutralColor }}
          >
            <th scope="col" className="w-8 py-2">
              <span className="sr-only">Select</span>
            </th>
            <th scope="col" className="py-2 font-bold">
              ID
            </th>
            <th scope="col" className="py-2 font-bold">
              Name
            </th>
            <th scope="col" className="py-2 font-bold">
              Owner
            </th>
            <th scope="col" className="py-2 font-bold">
              Status
            </th>
            <th scope="col" className="py-2 font-bold">
              Priority
            </th>
            <th scope="col" className="py-2 font-bold">
              Due
            </th>
            <th scope="col" className="py-2 text-right font-bold">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="hover:bg-black/[0.03]"
              style={{
                borderBottom: hair,
                backgroundColor: picked.includes(r.id) ? mix(brand.primaryColor, 6) : undefined,
              }}
            >
              <td className="py-2">
                <input
                  type="checkbox"
                  aria-label={`Select ${r.name}`}
                  checked={picked.includes(r.id)}
                  onChange={() => toggle(r.id)}
                  style={{ accentColor: brand.primaryColor }}
                />
              </td>
              <td className="py-2 tabular-nums" style={{ color: brand.neutralColor }}>
                {r.id}
              </td>
              <td className="py-2 font-semibold">{r.name}</td>
              <td className="py-2">{r.owner}</td>
              <td
                className="py-2 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: r.status === "Blocked" ? brand.accentColor : undefined }}
              >
                {r.status}
              </td>
              <td className="py-2">{r.priority}</td>
              <td className="py-2 tabular-nums">{r.due}</td>
              <td className="py-2 text-right font-semibold tabular-nums">
                ${r.value.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm font-semibold" style={{ borderBottom: hair }}>
          No records match.
        </p>
      ) : null}
      <div className="flex items-center justify-between pt-3 text-xs font-semibold tabular-nums">
        <span>Page 1 of 1</span>
        <span className="flex gap-2">
          <button
            type="button"
            className="h-8 px-3 font-bold uppercase"
            style={{ border: rule, borderRadius: brand.radius }}
            aria-label="Previous page"
          >
            Prev
          </button>
          <button
            type="button"
            className="h-8 px-3 font-bold uppercase"
            style={{ border: rule, borderRadius: brand.radius }}
            aria-label="Next page"
          >
            Next
          </button>
        </span>
      </div>
    </div>
  );
}
