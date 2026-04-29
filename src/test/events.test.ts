import { describe, it, expect } from "vitest";
import { computeStatus, decorate, defaultEventSeeds } from "@/data/events";

describe("computeStatus", () => {
  const start = "2026-05-01T00:00:00";
  const end = "2026-05-10T23:59:59";

  it("returns upcoming before start", () => {
    expect(computeStatus(start, end, new Date("2026-04-01"))).toBe("upcoming");
  });
  it("returns ongoing within range", () => {
    expect(computeStatus(start, end, new Date("2026-05-05"))).toBe("ongoing");
  });
  it("returns ended after end", () => {
    expect(computeStatus(start, end, new Date("2026-06-01"))).toBe("ended");
  });
});

describe("decorate", () => {
  it("attaches status and period", () => {
    const d = decorate(defaultEventSeeds[0], new Date("2026-04-25"));
    expect(d.status).toBeDefined();
    expect(d.period).toMatch(/\d{4}\.\d{2}\.\d{2}/);
  });
});

describe("defaultEventSeeds", () => {
  it("has unique ids", () => {
    const ids = defaultEventSeeds.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("has valid date ranges (start <= end)", () => {
    for (const s of defaultEventSeeds) {
      expect(new Date(s.startDate).getTime()).toBeLessThanOrEqual(new Date(s.endDate).getTime());
    }
  });
});
