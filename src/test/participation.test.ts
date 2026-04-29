import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useParticipation, useAllParticipations } from "@/hooks/useParticipation";

beforeEach(() => {
  localStorage.clear();
});

describe("useParticipation", () => {
  it("starts with no participation", () => {
    const { result } = renderHook(() => useParticipation("evt-1"));
    expect(result.current.hasJoined).toBe(false);
    expect(result.current.participation).toBeNull();
  });

  it("joins and persists to localStorage", () => {
    const { result } = renderHook(() => useParticipation("evt-1"));
    act(() => {
      result.current.join();
    });
    expect(result.current.hasJoined).toBe(true);
    expect(result.current.participation?.coupon).toMatch(/^PE-evt-1-/);
    const raw = localStorage.getItem("perfume_participation");
    expect(raw).toBeTruthy();
  });

  it("does not duplicate on repeat join", () => {
    const { result } = renderHook(() => useParticipation("evt-2"));
    let first = "";
    act(() => {
      first = result.current.join().coupon;
    });
    act(() => {
      const second = result.current.join().coupon;
      expect(second).toBe(first);
    });
  });

  it("recovers gracefully from corrupted storage", () => {
    localStorage.setItem("perfume_participation", "{not json");
    const { result } = renderHook(() => useParticipation("evt-3"));
    expect(result.current.hasJoined).toBe(false);
  });
});

describe("useAllParticipations", () => {
  it("returns empty object when nothing stored", () => {
    const { result } = renderHook(() => useAllParticipations());
    expect(result.current).toEqual({});
  });
});
