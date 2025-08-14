import { Constructor } from "../types/base";

// Registry mapping event names to arrays of observer class constructors
const observerRegistry: Map<string, Constructor[]> = new Map();

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

/**
 * Retrieves the entire observer registry.
 *
 * @returns Map where keys are event names and values are arrays of observer constructors.
 */
export function getObserverRegistry(): Map<string, Constructor[]> {
  return observerRegistry;
}
