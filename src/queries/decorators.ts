import { Constructor } from "../types/base";

const queryRegistry = new Map<string, Constructor>();

/**
 * Decorator to register a class as a Query handler under a unique name.
 *
 * @param name Unique identifier for the query.
 * @throws Error if a query with the given name is already registered.
 *
 * @example
 * ```ts
 * @Query("GET_USER")
 * export class GetUserQuery implements IQuery<{ id: number }, User> {
 *   async execute(params) { ... }
 * }
 * ```
 */
export function Query(name: string) {
  return function (target: Constructor) {
    if (queryRegistry.has(name)) {
      throw new Error(`Query with name "${name}" is already registered.`);
    }
    queryRegistry.set(name, target);
  };
}

export function getQueryRegistry() {
  return queryRegistry;
}
