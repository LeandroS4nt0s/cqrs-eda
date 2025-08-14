import { ICommand } from "../types/base";
import { getCommandRegistry } from "./decorators";

/**
 * Handles the registration and execution of command handlers.
 * Supports instantiation of command classes, optionally via a custom factory.
 *
 * @template C - A mapping of command names to their payload types.
 *
 * @example
 * ```ts
 * interface CommandsPayloads {
 *   CREATE_USER: { name: string };
 * }
 *
 * const commandHandler = new CommandHandler<CommandsPayloads>();
 * await commandHandler.fire("CREATE_USER", { name: "Leandro" });
 * ```
 */
export class CommandHandler<C extends Record<string, any>> {
  // Map of command names to command instances
  private commands = new Map<keyof C, ICommand>();

  /**
   * @param factory Optional factory function to instantiate command classes.
   * Useful for integrating with DI containers or custom initialization.
   *
   * Example:
   * ```ts
   * const handler = new CommandHandler((cls) => container.resolve(cls));
   * ```
   */
  constructor(private factory?: (cls: any) => any) {
    const registry = getCommandRegistry();

    for (const [name, CommandClass] of registry.entries()) {
      const instance = this.factory
        ? this.factory(CommandClass)
        : new CommandClass();
      this.commands.set(name as keyof C, instance);
    }
  }

  /**
   * Executes a command by name with the given payload.
   *
   * @param commandName - The command name to execute.
   * @param payload - The data to pass to the command.
   * @throws Error if the command is not registered.
   */
  async fire<K extends keyof C>(commandName: K, payload: C[K]): Promise<void> {
    const command = this.commands.get(commandName);

    if (!command) {
      throw new Error(`Command "${String(commandName)}" not found.`);
    }

    await command.execute(payload);
  }
}
