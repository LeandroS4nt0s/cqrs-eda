# CQRS-EDA 🚀

CQRS-EDA é uma biblioteca leve e poderosa em **TypeScript/JavaScript** que implementa os padrões **CQRS** (Command Query Responsibility Segregation) e **EDA** (Event-Driven Architecture).
Ela fornece decorators e handlers para **Commands**, **Queries** e **Observers**, permitindo criar sistemas escaláveis, desacoplados e fáceis de testar.

---

## 💡 Funcionalidades

- **Command Handler**: registrar e executar comandos com payload tipado.
- **Query Handler**: registrar e executar queries com retorno tipado.
- **Observer Handler**: registrar e disparar eventos para múltiplos observers.

  - Observers funcionam como **consumers de filas**, podendo consumir eventos de **qualquer tecnologia de fila** (RabbitMQ, Kafka, SQS, Redis Streams etc.).

- Integração opcional com **Dependency Injection** para criar instâncias personalizadas.

---

## ⚙️ Instalação

```bash
npm install cqrs-eda
```

ou via Yarn:

```bash
yarn add cqrs-eda
```

---

## 🎨 Estrutura da Lib

```ts
import { Decorators, Handlers, ICommand, IObserver, IQuery } from "cqrs-eda";

const { Command, Query, Observer } = Decorators;
const { CommandHandler, QueryHandler, ObserverHandler } = Handlers;
```

- `Decorators`: `Command`, `Query`, `Observer`
- `Handlers`: `CommandHandler`, `QueryHandler`, `ObserverHandler`
- Interfaces: `ICommand`, `IQuery`, `IObserver`

---

## 🛠️ Exemplo de Uso

### Command

```ts
import { Command, CommandHandler, ICommand } from "cqrs-eda";

@Command("CREATE_USER")
class CreateUserCommand implements ICommand<{ name: string }> {
  async execute(payload: { name: string }): Promise<void> {
    console.log("Criando usuário:", payload.name);
  }
}

const commandHandler = new CommandHandler();
await commandHandler.fire("CREATE_USER", { name: "Leandro" });
```

### Query

```ts
import { Query, QueryHandler, IQuery } from "cqrs-eda";

@Query("GET_USER")
class GetUserQuery implements IQuery<{ id: number }, string | null> {
  async execute(params: { id: number }): Promise<string | null> {
    return `Usuário ${params.id}`;
  }
}

const queryHandler = new QueryHandler<
  { GET_USER: { id: number } },
  { GET_USER: string | null }
>();
const user = await queryHandler.fire("GET_USER", { id: 1 });
console.log(user);
```

### Observer (Consumer de Fila)

```ts
import { Observer, ObserverHandler, IObserver } from "cqrs-eda";

@Observer("USER_CREATED")
class SendWelcomeEmailObserver implements IObserver<{ userId: number }> {
  async execute(payload: { userId: number }): Promise<void> {
    console.log("Enviando e-mail de boas-vindas para usuário:", payload.userId);
  }
}

const observerHandler = new ObserverHandler();
await observerHandler.publish("USER_CREATED", { userId: 1 });
```

> ⚠️ Os observers podem ser usados como **consumers de qualquer fila**, como RabbitMQ, Kafka, AWS SQS ou Redis Streams.

---

## 🔧 Suporte a Dependency Injection

Você pode passar uma factory para os handlers, integrando com qualquer container:

```ts
const commandHandler = new CommandHandler((cls) => container.resolve(cls));
const observerHandler = new ObserverHandler((cls) => container.resolve(cls));
```

---

## 📦 Tipos e Interfaces

- `ICommand<Payload>`
- `IQuery<Params, Result>`
- `IObserver<Payload>`
- `Constructor<T>`

Permite tipagem completa no TypeScript para evitar erros em tempo de compilação.

---

## 📖 Licença

MIT © Leandro Santos

# CQRS-EDA 🚀

CQRS-EDA is a lightweight and powerful **TypeScript/JavaScript** library implementing **CQRS** (Command Query Responsibility Segregation) and **EDA** (Event-Driven Architecture) patterns.
It provides decorators and handlers for **Commands**, **Queries**, and **Observers**, allowing you to build scalable, decoupled, and testable systems.

---

## 💡 Features

- **Command Handler**: register and execute typed commands.
- **Query Handler**: register and execute typed queries with return values.
- **Observer Handler**: register and publish events to multiple observers.

  - Observers act as **queue consumers**, compatible with **any queue technology** (RabbitMQ, Kafka, SQS, Redis Streams, etc.).

- Optional **Dependency Injection** integration for customized instance creation.

---

## ⚙️ Installation

```bash
npm install cqrs-eda
```

or via Yarn:

```bash
yarn add cqrs-eda
```

---

## 🎨 Library Structure

```ts
import { Decorators, Handlers, ICommand, IObserver, IQuery } from "cqrs-eda";

const { Command, Query, Observer } = Decorators;
const { CommandHandler, QueryHandler, ObserverHandler } = Handlers;
```

- `Decorators`: `Command`, `Query`, `Observer`
- `Handlers`: `CommandHandler`, `QueryHandler`, `ObserverHandler`
- Interfaces: `ICommand`, `IQuery`, `IObserver`

---

## 🛠️ Usage Examples

### Command

```ts
import { Command, CommandHandler, ICommand } from "cqrs-eda";

@Command("CREATE_USER")
class CreateUserCommand implements ICommand<{ name: string }> {
  async execute(payload: { name: string }): Promise<void> {
    console.log("Creating user:", payload.name);
  }
}

const commandHandler = new CommandHandler();
await commandHandler.fire("CREATE_USER", { name: "Leandro" });
```

### Query

```ts
import { Query, QueryHandler, IQuery } from "cqrs-eda";

@Query("GET_USER")
class GetUserQuery implements IQuery<{ id: number }, string | null> {
  async execute(params: { id: number }): Promise<string | null> {
    return `User ${params.id}`;
  }
}

const queryHandler = new QueryHandler<
  { GET_USER: { id: number } },
  { GET_USER: string | null }
>();
const user = await queryHandler.fire("GET_USER", { id: 1 });
console.log(user);
```

### Observer (Queue Consumer)

```ts
import { Observer, ObserverHandler, IObserver } from "cqrs-eda";

@Observer("USER_CREATED")
class SendWelcomeEmailObserver implements IObserver<{ userId: number }> {
  async execute(payload: { userId: number }): Promise<void> {
    console.log("Sending welcome email to user:", payload.userId);
  }
}

const observerHandler = new ObserverHandler();
await observerHandler.publish("USER_CREATED", { userId: 1 });
```

> ⚠️ Observers can be used as **consumers for any queue technology**, such as RabbitMQ, Kafka, AWS SQS, or Redis Streams.

---

## 🔧 Dependency Injection Support

You can pass a factory function to handlers to integrate with any DI container:

```ts
const commandHandler = new CommandHandler((cls) => container.resolve(cls));
const observerHandler = new ObserverHandler((cls) => container.resolve(cls));
```

---

## 📦 Types and Interfaces

- `ICommand<Payload>`
- `IQuery<Params, Result>`
- `IObserver<Payload>`
- `Constructor<T>`

Provides full TypeScript typing to prevent runtime errors.

---

## 📖 License

MIT © Leandro Santos
