import { Constructor, IQuery } from "../types/base";
import { getQueryRegistry } from "./decorators";

/**
 * Handles the registration and execution of query handlers.
 * Supports instantiation of query classes, optionally via a custom factory.
 *
 * @template Q - A mapping of query names to their parameter types.
 * @template R - A mapping of query names to their return types.
 *
 * @example
 * ```ts
 * interface Queries {
 *   GET_USER: { id: number };
 * }
 * interface Results {
 *   GET_USER: User | null;
 * }
 *
 * const queryHandler = new QueryHandler<Queries, Results>();
 * const user = await queryHandler.fire("GET_USER", { id: 1 });
 * ```
 */
export class QueryHandler<
  Q extends Record<string, any>,
  R extends { [K in keyof Q]: any }
> {
  // Map of query names to query instances
  private queries = new Map<keyof Q, IQuery<any, any>>();

  /**
   * @param factory Optional factory function to instantiate query classes.
   * Useful for integrating with DI containers or custom initialization.
   *
   * Example:
   * ```ts
   * const handler = new QueryHandler((cls) => container.resolve(cls));
   * ```
   */
  constructor(private factory?: (cls: Constructor) => any) {
    const registry = getQueryRegistry();

    for (const [name, QueryClass] of registry.entries()) {
      const instance = this.factory
        ? this.factory(QueryClass)
        : new QueryClass();
      this.queries.set(name as keyof Q, instance);
    }
  }

  /**
   * Executes a query by name with the given parameters.
   *
   * @param queryName - The query name to execute.
   * @param params - The parameters to pass to the query.
   * @returns The result of the query execution.
   * @throws Error if the query is not registered.
   */
  async fire<K extends keyof Q>(queryName: K, params: Q[K]): Promise<R[K]> {
    const query = this.queries.get(queryName);

    if (!query) {
      throw new Error(`Query "${String(queryName)}" not found.`);
    }

    return await query.execute(params);
  }
}
