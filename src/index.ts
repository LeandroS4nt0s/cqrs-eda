import { Command } from "./commands/decorators";
import { Observer } from "./observers/decorators";
import { Query } from "./queries/decorators";

import { CommandHandler } from "./commands/handler";
import { QueryHandler } from "./queries/handler";
import { ObserverHandler } from "./observers/handler";
import { registerDecoratedClasses } from "./utils/registerDecoratedClasses";

export {
  ICommand,
  IObserver,
  IQuery,
  ICommandHandler,
  IObserverHandler,
  IQueryHandler,
} from "./types/base";

export const Decorators = { Command, Query, Observer };
export const Handlers = { CommandHandler, QueryHandler, ObserverHandler };
export const Utilities = { registerDecoratedClasses };
