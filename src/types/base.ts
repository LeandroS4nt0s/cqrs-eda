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
