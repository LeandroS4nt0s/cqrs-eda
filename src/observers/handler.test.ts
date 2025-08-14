import { describe, it, expect, beforeEach, vi } from "vitest";
import { ObserverHandler } from "./handler";
import { Observer, getObserverRegistry } from "./decorators";

describe("ObserverHandler", () => {
  beforeEach(() => {
    getObserverRegistry().clear();
  });

  it("should instantiate observers from the registry and call execute on publish", async () => {
    const executeMock1 = vi.fn();
    const executeMock2 = vi.fn();

    @Observer("EVENT_TEST")
    class ObserverOne {
      async execute(payload: any) {
        executeMock1(payload);
      }
    }

    @Observer("EVENT_TEST")
    class ObserverTwo {
      async execute(payload: any) {
        executeMock2(payload);
      }
    }

    const handler = new ObserverHandler<{ EVENT_TEST: { foo: string } }>();

    await handler.publish("EVENT_TEST", { foo: "bar" });

    expect(executeMock1).toHaveBeenCalledTimes(1);
    expect(executeMock1).toHaveBeenCalledWith({ foo: "bar" });
    expect(executeMock2).toHaveBeenCalledTimes(1);
    expect(executeMock2).toHaveBeenCalledWith({ foo: "bar" });
  });

  it("should throw error if publishing an event with no observers", async () => {
    const handler = new ObserverHandler<{ UNKNOWN_EVENT: any }>();

    await expect(handler.publish("UNKNOWN_EVENT", {})).rejects.toThrow(
      'No observers registered for event "UNKNOWN_EVENT"'
    );
  });

  it("should use the factory to instantiate observers if provided", async () => {
    const fakeInstance = { execute: vi.fn().mockResolvedValue(undefined) };
    const factory = vi.fn().mockReturnValue(fakeInstance);

    @Observer("EVENT_FACTORY")
    class SomeObserver {
      async execute(payload: any) {}
    }

    const handler = new ObserverHandler<{ EVENT_FACTORY: { val: number } }>(
      factory
    );

    await handler.publish("EVENT_FACTORY", { val: 123 });

    expect(factory).toHaveBeenCalled();
    expect(factory).toHaveBeenCalledWith(SomeObserver);
    expect(fakeInstance.execute).toHaveBeenCalledWith({ val: 123 });
  });
});
