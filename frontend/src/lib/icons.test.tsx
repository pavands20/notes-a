import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ICON_NAMES, Icons } from "./icons";

// The Builder prompt lists exactly these names; an icon missing here is a
// compile error in generated screens, so the set is pinned.
const EXPECTED_NAMES = [
  "Plus",
  "Search",
  "Check",
  "X",
  "ChevronRight",
  "ChevronLeft",
  "ChevronDown",
  "Menu",
  "User",
  "Users",
  "Settings",
  "Bell",
  "Home",
  "FileText",
  "Package",
  "Calendar",
  "Clock",
  "Trash",
  "Edit",
  "Filter",
  "Download",
  "Upload",
  "ArrowLeft",
  "ArrowRight",
  "AlertCircle",
  "CheckCircle",
  "MoreHorizontal",
];

function renderSvg(name: string, props: Record<string, unknown> = {}) {
  const Component = Icons[name];
  const { container } = render(<Component {...props} />);
  const svg = container.querySelector("svg");
  if (!svg) throw new Error(`${name} did not render an <svg>`);
  return svg;
}

describe("icons", () => {
  it("exports exactly the documented icon names", () => {
    expect([...ICON_NAMES].sort()).toEqual([...EXPECTED_NAMES].sort());
  });

  it("has no duplicate names", () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
  });

  it("exposes a component in Icons for every name in ICON_NAMES, and nothing else", () => {
    expect(Object.keys(Icons).sort()).toEqual([...ICON_NAMES].sort());
    for (const name of ICON_NAMES) {
      expect(typeof Icons[name]).toBe("function");
    }
  });

  it.each(EXPECTED_NAMES)("%s renders an svg with drawable content", (name) => {
    const svg = renderSvg(name);
    expect(svg.children.length).toBeGreaterThan(0);
    // Every child is a real shape with geometry, not an empty element.
    for (const child of Array.from(svg.children)) {
      expect(["path", "circle", "rect"]).toContain(child.tagName.toLowerCase());
      if (child.tagName.toLowerCase() === "path") {
        expect(child.getAttribute("d")).toBeTruthy();
      }
    }
  });

  it("renders at 16px by default on a 24 unit viewBox", () => {
    const svg = renderSvg("Plus");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("applies the size prop to width and height", () => {
    const svg = renderSvg("Search", { size: 32 });
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("is an outline icon that inherits the surrounding text colour", () => {
    const svg = renderSvg("Check");
    expect(svg).toHaveAttribute("fill", "none");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("stroke-width", "2");
    expect(svg).toHaveAttribute("stroke-linecap", "round");
    expect(svg).toHaveAttribute("stroke-linejoin", "round");
  });

  it("is hidden from assistive technology", () => {
    expect(renderSvg("Bell")).toHaveAttribute("aria-hidden", "true");
  });

  it("passes className and other svg props through", () => {
    const svg = renderSvg("User", {
      className: "h-4 w-4 text-red-500",
      "data-testid": "user-icon",
    });
    expect(svg).toHaveClass("h-4", "w-4", "text-red-500");
    expect(svg).toHaveAttribute("data-testid", "user-icon");
  });

  it("does not let callers override the size, viewBox or stroke geometry via props", () => {
    const svg = renderSvg("Home", { size: 20, width: 99, viewBox: "0 0 1 1" });
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("does not leak the size prop onto the DOM as an attribute", () => {
    expect(renderSvg("Plus", { size: 12 })).not.toHaveAttribute("size");
  });

  it("draws different artwork for different icons", () => {
    const markup = new Set(ICON_NAMES.map((name) => renderSvg(name).innerHTML));
    expect(markup.size).toBe(ICON_NAMES.length);
  });

  it("renders multi-shape icons with all of their shapes", () => {
    expect(renderSvg("Search").querySelectorAll("circle")).toHaveLength(1);
    expect(renderSvg("Search").querySelectorAll("path")).toHaveLength(1);
    expect(renderSvg("MoreHorizontal").querySelectorAll("circle")).toHaveLength(3);
    expect(renderSvg("Calendar").querySelectorAll("rect")).toHaveLength(1);
  });
});
