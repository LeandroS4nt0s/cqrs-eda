/**
 * Registers decorated classes (Commands, Queries, Observers) by importing them directly
 * or by passing them as objects from `import * as ...`.
 *
 * This function automatically normalizes arrays and objects into arrays of classes,
 * so you don't need to manually call Object.values().
 *
 * Example (array export in index.ts):
 * ```ts
 * import commandList from "@application/commands";
 * import queryList from "@application/queries";
 * import observerList from "@application/observers";
 *
 * registerDecoratedClasses({
 *   commands: commandList,
 *   queries: queryList,
 *   observers: observerList
 * });
 * ```
 *
 * Example (`import * as` style):
 * ```ts
 * import * as commandList from "@application/commands";
 * import * as queryList from "@application/queries";
 * import * as observerList from "@application/observers";
 *
 * registerDecoratedClasses({
 *   commands: commandList,
 *   queries: queryList,
 *   observers: observerList
 * });
 * ```
 */
export function registerDecoratedClasses({
  commands = [],
  queries = [],
  observers = [],
}: {
  commands?: Function[] | Record<string, Function>;
  queries?: Function[] | Record<string, Function>;
  observers?: Function[] | Record<string, Function>;
}) {
  const normalize = (list: any) =>
    Array.isArray(list) ? list : Object.values(list);

  [
    ...normalize(commands),
    ...normalize(queries),
    ...normalize(observers),
  ].forEach((cls) => void cls);
}
