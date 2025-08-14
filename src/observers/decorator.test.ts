import { describe, it, expect, beforeEach } from "vitest";
import { Observer, getObserverRegistry } from "./decorators";

describe("Observer decorator and registry", () => {
  beforeEach(() => {
    getObserverRegistry().clear();
  });

  it("should register a single observer for an event", () => {
    @Observer("EVENT_ONE")
    class ObserverOne {}

    const registry = getObserverRegistry();
    const observers = registry.get("EVENT_ONE");

    expect(observers).toBeDefined();
    expect(observers!.length).toBe(1);
    expect(observers![0]).toBe(ObserverOne);
  });

  it("should register multiple observers for the same event", () => {
    @Observer("EVENT_MULTI")
    class ObserverA {}

    @Observer("EVENT_MULTI")
    class ObserverB {}

    const registry = getObserverRegistry();
    const observers = registry.get("EVENT_MULTI");

    expect(observers).toBeDefined();
    expect(observers!.length).toBe(2);
    expect(observers).toContain(ObserverA);
    expect(observers).toContain(ObserverB);
  });

  it("should not create observers for different events in the same list", () => {
    @Observer("EVENT_A")
    class ObserverA {}

    @Observer("EVENT_B")
    class ObserverB {}

    const registry = getObserverRegistry();

    expect(registry.get("EVENT_A")).toContain(ObserverA);
    expect(registry.get("EVENT_B")).toContain(ObserverB);
    expect(registry.get("EVENT_A")).not.toContain(ObserverB);
    expect(registry.get("EVENT_B")).not.toContain(ObserverA);
  });
});
