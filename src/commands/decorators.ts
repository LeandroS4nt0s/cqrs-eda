import { Constructor } from "../types/base";

const commandRegistry = new Map<string, Constructor>();

/**
 * Command decorator to register a class as a command handler.
 * @param name - Unique name of the command.
 * @throws If a command with the same name is already registered.
 */
export function Command(name: string) {
  return function (target: Constructor) {
    if (commandRegistry.has(name)) {
      throw new Error(`Command with name "${name}" is already registered.`);
    }
    commandRegistry.set(name, target);
  };
}

export function getCommandRegistry() {
  return commandRegistry;
}
