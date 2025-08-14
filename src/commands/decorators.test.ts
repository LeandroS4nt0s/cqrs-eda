import { describe, it, expect, beforeEach } from "vitest";
import { Command, getCommandRegistry } from "./decorators";

describe("Command decorator", () => {
  beforeEach(() => {
    getCommandRegistry().clear();
  });

  it("should register a command class with the given name", () => {
    @Command("TEST_COMMAND")
    class TestCommand {}

    const registry = getCommandRegistry();
    expect(registry.has("TEST_COMMAND")).toBe(true);
    expect(registry.get("TEST_COMMAND")).toBe(TestCommand);
  });

  it("should throw error if a command with the same name is registered twice", () => {
    @Command("DUPLICATE_COMMAND")
    class FirstCommand {}

    expect(() => {
      @Command("DUPLICATE_COMMAND")
      class SecondCommand {}
    }).toThrowError(
      'Command with name "DUPLICATE_COMMAND" is already registered.'
    );
  });

  it("should only register the command once and keep the first one", () => {
    @Command("SINGLE_COMMAND")
    class FirstCommand {}

    try {
      @Command("SINGLE_COMMAND")
      class SecondCommand {}
    } catch {}

    const registry = getCommandRegistry();
    expect(registry.get("SINGLE_COMMAND")).toBe(FirstCommand);
  });
});
