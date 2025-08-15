import glob from "glob";
import path from "path";

/**
 * Dynamically loads all decorated classes (Commands, Queries, Observers)
 * so that the internal registries are automatically populated.
 *
 * This must be called before using CommandHandler, QueryHandler, or ObserverHandler,
 * otherwise the handlers won't know about the decorated classes.
 *
 * Example without any dependency injection container:
 * ```ts
 * import { Utilities, Handlers } from "cqrs-eda";
 *
 * async function bootstrap() {
 *   // Load all decorated commands, queries, and observers
 *   await Utilities.loadDecoratedClasses("src/application");
 *
 *   // Initialize handlers
 *   const commandHandler = new Handlers.CommandHandler();
 *   const queryHandler = new Handlers.QueryHandler();
 *   const observerHandler = new Handlers.ObserverHandler();
 *
 *   // Use the handlers
 *   const segment = await queryHandler.fire("GET_SEGMENT", { phrase: "Hello", accent: "american" });
 *   console.log(segment);
 *
 *   await commandHandler.fire("SAVE_SEGMENT", { phrase: "Hello", accent: "american", videoUrl: "...", startTime: 0, endTime: 2 });
 *   await observerHandler.publish("SEGMENT.SAVED", { phrase: "Hello", accent: "american", ... });
 * }
 *
 * bootstrap();
 * ```
 *
 * @param basePath The base path where decorated files are located (e.g. "src/application")
 */
export async function loadDecoratedClasses(basePath: string) {
  const files = glob.sync(path.join(basePath, "**/*.{ts,js}"));

  await Promise.all(
    files.map(async (file) => {
      try {
        await import(path.resolve(file));
      } catch (err) {
        console.error(`[CQRS-EDA] Error loading file ${file}:`, err);
      }
    })
  );
}
