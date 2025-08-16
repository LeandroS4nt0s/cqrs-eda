# CQRS-EDA 🚀

CQRS-EDA is a lightweight **TypeScript/JavaScript** library designed to **complement CQRS and Event-Driven Architecture patterns** in your applications. It provides decorators, handlers, and utilities to manage **Commands**, **Queries**, and **Observers** in a scalable and strongly-typed way.

---

## 💡 Why Use CQRS-EDA?

CQRS-EDA is built to **enhance your implementation** of CQRS and EDA without enforcing them. By using CQRS-EDA, you can:

- Decouple your business logic from the infrastructure.
- Easily manage and organize commands, queries, and observers.
- Ensure strong typing and autocompletion in TypeScript.
- Integrate seamlessly with DI containers or use without DI.
- Improve maintainability, testability, and scalability.

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

## 🏗️ Library Structure

```ts
import {
  Decorators,
  Handlers,
  Utilities,
  ICommand,
  IObserver,
  IQuery,
} from "cqrs-eda";

const { Command, Query, Observer } = Decorators;
const { CommandHandler, QueryHandler, ObserverHandler } = Handlers;
```

- **Decorators**: `Command`, `Query`, `Observer`
- **Handlers**: `CommandHandler`, `QueryHandler`, `ObserverHandler`
- **Utilities**: `registerDecoratedClasses`
- **Interfaces**: `ICommand`, `IQuery`, `IObserver`

---

## 🛠️ Quick Start

### 1️⃣ Without Dependency Injection

```ts
import {
  Command,
  CommandHandler,
  Query,
  QueryHandler,
  Observer,
  ObserverHandler,
  ICommand,
  IQuery,
  IObserver,
} from "cqrs-eda";

@Command("CREATE_USER")
class CreateUserCommand implements ICommand<{ name: string }> {
  async execute(payload: { name: string }) {
    console.log("User created:", payload.name);
  }
}

@Query("GET_USER")
class GetUserQuery implements IQuery<{ id: number }, string | null> {
  async execute(params: { id: number }): Promise<string | null> {
    return `User ${params.id}`;
  }
}

@Observer("USER_CREATED")
class SendWelcomeEmailObserver implements IObserver<{ userId: number }> {
  async execute(payload: { userId: number }) {
    console.log("Sending email to user:", payload.userId);
  }
}

// Handlers
const commandHandler = new CommandHandler();
const queryHandler = new QueryHandler();
const observerHandler = new ObserverHandler();

// Execute
await commandHandler.fire("CREATE_USER", { name: "Leandro" });
const user = await queryHandler.fire("GET_USER", { id: 1 });
await observerHandler.publish("USER_CREATED", { userId: 1 });
```

### 2️⃣ With Dependency Injection (tsyringe)

```ts
import { container } from "tsyringe";
import {
  CommandHandler,
  QueryHandler,
  ObserverHandler,
  Utilities,
} from "cqrs-eda";
import {
  CommandMappers,
  QueryMappers,
  QueryResultMappers,
  EventMappers,
} from "./mappers";
import * as Commands from "./commands";
import * as Queries from "./queries";
import * as Observers from "./observers";

// Register all decorated classes
Utilities.registerDecoratedClasses({
  commands: Commands,
  queries: Queries,
  observers: Observers,
});

// Handlers with DI
const commandHandler = new CommandHandler<CommandMappers>((cls) =>
  container.resolve(cls)
);
const queryHandler = new QueryHandler<QueryMappers, QueryResultMappers>((cls) =>
  container.resolve(cls)
);
const observerHandler = new ObserverHandler<EventMappers>((cls) =>
  container.resolve(cls)
);

container.registerInstance(CommandHandler, commandHandler);
container.registerInstance(QueryHandler, queryHandler);
container.registerInstance(ObserverHandler, observerHandler);
```

---

## 🧩 Strong Typing with Mappers

CQRS-EDA uses **mapper types** to ensure commands, queries, and observers are **fully typed**.

```ts
type CommandMappers = {
  SAVE_SEGMENT: IndexPronunciationResponse;
};

type QueryMappers = {
  GET_SEGMENT: { phrase: string; accent: string };
};

type QueryResultMappers = {
  GET_SEGMENT: PronunciationSegmentEntity;
};

type EventMappers = {
  "SEGMENT.SAVED": IndexPronunciationResponse;
};
```

**Benefits:**

- Compile-time safety for all commands, queries, and events.
- IDE autocompletion.
- Reduced runtime errors.

---

## 🔧 Utilities: `registerDecoratedClasses`

- Automatically registers decorated classes for handlers.
- Supports both `import * as` and array exports.
- Ensures all decorated classes are recognized by their respective handlers.

---

## ⚡ Benefits of CQRS-EDA

- Complements **CQRS and EDA patterns** without enforcing them.
- Simplifies registration and execution of commands, queries, and observers.
- Strong typing improves **developer experience**.
- Flexible DI support integrates easily with existing architecture.

---

## 📖 License

MIT © Leandro Santos
