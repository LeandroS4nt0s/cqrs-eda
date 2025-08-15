import { describe, it, expect, vi } from "vitest";
import { registerDecoratedClasses } from "../utils/registerDecoratedClasses";

describe("registerDecoratedClasses", () => {
  it("should handle empty input without errors", () => {
    expect(() => registerDecoratedClasses({})).not.toThrow();
  });

  it("should handle arrays of commands, queries, and observers", () => {
    const command1 = vi.fn();
    const query1 = vi.fn();
    const observer1 = vi.fn();

    expect(() =>
      registerDecoratedClasses({
        commands: [command1],
        queries: [query1],
        observers: [observer1],
      })
    ).not.toThrow();
  });

  it("should handle objects of commands, queries, and observers", () => {
    const commandObj = { CMD1: vi.fn() };
    const queryObj = { QRY1: vi.fn() };
    const observerObj = { OBS1: vi.fn() };

    expect(() =>
      registerDecoratedClasses({
        commands: commandObj,
        queries: queryObj,
        observers: observerObj,
      })
    ).not.toThrow();
  });

  it("should handle mixed arrays and objects", () => {
    const command1 = vi.fn();
    const queryObj = { QRY1: vi.fn() };
    const observerArr = [vi.fn()];

    expect(() =>
      registerDecoratedClasses({
        commands: [command1],
        queries: queryObj,
        observers: observerArr,
      })
    ).not.toThrow();
  });
});
