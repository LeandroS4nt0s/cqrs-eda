export interface ICommand<Payload = any> {
  execute(payload: Payload): Promise<void>;
}

export interface IQuery<Params = any, Result = any> {
  execute(params: Params): Promise<Result>;
}

export interface IObserver<Payload = any> {
  execute(payload: Payload): Promise<void>;
}

export type Constructor<T = any> = new (...args: any[]) => T;

export interface IQueryHandler<
  Q extends Record<string, any>,
  R extends { [K in keyof Q]: any }
> {
  fire<K extends keyof Q>(queryName: K, params: Q[K]): Promise<R[K]>;
}
export interface IObserverHandler<O extends Record<string, any>> {
  publish<K extends keyof O>(eventName: K, payload: O[K]): Promise<void>;
}

export interface ICommandHandler<C extends Record<string, any>> {
  fire<K extends keyof C>(commandName: K, payload: C[K]): Promise<void>;
}
