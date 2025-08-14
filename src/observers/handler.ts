import { IObserver, Constructor, IObserverHandler } from "../types/base";
import { getObserverRegistry } from "./decorators";

/**
 * Handles the registration and execution of observers for events.
 * Supports instantiation of observer classes, optionally via a custom factory.
 *
 * @template O - A mapping of event names to their payload types.
 */
export class ObserverHandler<O extends Record<string, any>>
  implements IObserverHandler<O>
{
  // Map of event names to arrays of observer instances
  private observers = new Map<keyof O, IObserver[]>();

  /**
   * @param factory Optional factory function to instantiate observer classes.
   * This can be used to:
   * - Integrate with a dependency injection library, e.g., tsyringe or inversify.
   * - Customize instance creation with initialization logic.
   *
   * Example:
   * ```ts
   * const handler = new ObserverHandler((cls) => container.resolve(cls));
   * ```
   */
  constructor(private factory?: (cls: Constructor) => any) {
    const registry = getObserverRegistry();

    for (const [eventName, classes] of registry.entries()) {
      const instances = classes.map((cls) =>
        this.factory ? this.factory(cls) : new cls()
      );
      this.observers.set(eventName as keyof O, instances);
    }
  }

  /**
   * Publishes an event to all registered observers.
   *
   * @param eventName - The event name to publish.
   * @param payload - The payload to send to each observer.
   * @throws Error if no observers are registered for the event.
   */
  async publish<K extends keyof O>(eventName: K, payload: O[K]): Promise<void> {
    const observers = this.observers.get(eventName);

    if (!observers || observers.length === 0) {
      throw new Error(
        `No observers registered for event "${String(eventName)}"`
      );
    }

    for (const observer of observers) {
      await observer.execute(payload);
    }
  }
}
