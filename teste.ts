import { Handlers } from "./src";

const { QueryHandler, CommandHandler, ObserverHandler } = Handlers;

new QueryHandler();
new CommandHandler();
new ObserverHandler();
