import { Constructor } from "../types/base";

const observerRegistry = new Map<string, Constructor[]>();

/**
 * Decorator to register a class as an Observer for a specific event.
 * Multiple observers can listen to the same event.
 *
 * @param eventName - The name of the event to observe.
 * @returns Class decorator function.
 */
export function Observer(eventName: string) {
  return function (target: Constructor) {
    if (!observerRegistry.has(eventName)) {
      observerRegistry.set(eventName, []);
    }
    observerRegistry.get(eventName)!.push(target);
  };
}

export function getObserverRegistry() {
  return observerRegistry;
}
