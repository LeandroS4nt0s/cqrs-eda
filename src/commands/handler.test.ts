import { describe, it, expect, vi, beforeEach } from "vitest";
import { CommandHandler } from "./handler";
import { Command, getCommandRegistry } from "./decorators";
import { ICommand } from "../types/base";

describe("CommandHandler", () => {
  beforeEach(() => {
    getCommandRegistry().clear();
  });

  it("should instantiate commands from registry without factory", async () => {
    const executeMock = vi.fn();

    @Command("TEST_COMMAND")
    class TestCommand implements ICommand<{ foo: string }> {
      async execute(payload: { foo: string }) {
        executeMock(payload);
      }
    }

    const handler = new CommandHandler<{ TEST_COMMAND: { foo: string } }>();

    await handler.fire("TEST_COMMAND", { foo: "bar" });

    expect(executeMock).toHaveBeenCalledOnce();
    expect(executeMock).toHaveBeenCalledWith({ foo: "bar" });
  });

  it("should instantiate commands using the factory function", async () => {
    const executeMock = vi.fn();

    @Command("FACTORY_COMMAND")
    class FactoryCommand implements ICommand<{ baz: number }> {
      async execute(payload: { baz: number }) {
        executeMock(payload);
      }
    }

    const factory = (cls: any) => new cls();

    const handler = new CommandHandler<{ FACTORY_COMMAND: { baz: number } }>(
      factory
    );

    await handler.fire("FACTORY_COMMAND", { baz: 42 });

    expect(executeMock).toHaveBeenCalledOnce();
    expect(executeMock).toHaveBeenCalledWith({ baz: 42 });
  });

  it("should throw if command not found", async () => {
    const handler = new CommandHandler();

    await expect(
      handler.fire("UNKNOWN_COMMAND" as any, {})
    ).rejects.toThrowError('Command "UNKNOWN_COMMAND" not found.');
  });
});
