import { describe, it, expect } from "vitest";
import { cn, formatTime12h } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
      expect(cn("p-4", { "p-8": true })).toBe("p-8");
      expect(cn("p-4", { "p-8": false })).toBe("p-4");
    });
  });

  describe("formatTime12h", () => {
    it("formats 24h time to 12h time correctly", () => {
      expect(formatTime12h("00:00")).toBe("12:00 AM");
      expect(formatTime12h("09:30")).toBe("9:30 AM");
      expect(formatTime12h("12:00")).toBe("12:00 PM");
      expect(formatTime12h("14:45")).toBe("2:45 PM");
      expect(formatTime12h("23:59")).toBe("11:59 PM");
    });

    it("returns empty string for empty input", () => {
      expect(formatTime12h("")).toBe("");
    });
  });
});
