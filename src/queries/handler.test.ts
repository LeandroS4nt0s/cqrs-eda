import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryHandler } from "./handler";
import { Query, getQueryRegistry } from "./decorators";
import { IQuery } from "../types/base";

describe("QueryHandler", () => {
  beforeEach(() => {
    getQueryRegistry().clear();
  });

  it("should instantiate queries from registry without factory", async () => {
    @Query("TEST_QUERY")
    class TestQuery implements IQuery<{ id: number }, string> {
      async execute(params: { id: number }) {
        return `Result: ${params.id}`;
      }
    }

    const handler = new QueryHandler<
      { TEST_QUERY: { id: number } },
      { TEST_QUERY: string }
    >();

    const result = await handler.fire("TEST_QUERY", { id: 42 });
    expect(result).toBe("Result: 42");
  });

  it("should instantiate queries using factory if provided", async () => {
    @Query("FACTORY_QUERY")
    class FactoryQuery implements IQuery<{ val: number }, number> {
      async execute(params: { val: number }) {
        return params.val * 2;
      }
    }

    const factory = vi.fn((cls: new () => any) => new cls());
    const handler = new QueryHandler<
      { FACTORY_QUERY: { val: number } },
      { FACTORY_QUERY: number }
    >(factory);

    const result = await handler.fire("FACTORY_QUERY", { val: 21 });
    expect(result).toBe(42);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should throw error if query name is not registered", async () => {
    const handler = new QueryHandler<{ UNKNOWN: {} }, { UNKNOWN: any }>();

    await expect(handler.fire("UNKNOWN", {})).rejects.toThrowError(
      'Query "UNKNOWN" not found.'
    );
  });

  it("should handle multiple queries correctly", async () => {
    @Query("QUERY_ONE")
    class QueryOne implements IQuery<{ x: number }, number> {
      async execute(params: { x: number }) {
        return params.x + 1;
      }
    }

    @Query("QUERY_TWO")
    class QueryTwo implements IQuery<{ y: number }, number> {
      async execute(params: { y: number }) {
        return params.y + 2;
      }
    }

    const handler = new QueryHandler<
      { QUERY_ONE: { x: number }; QUERY_TWO: { y: number } },
      { QUERY_ONE: number; QUERY_TWO: number }
    >();

    expect(await handler.fire("QUERY_ONE", { x: 5 })).toBe(6);
    expect(await handler.fire("QUERY_TWO", { y: 10 })).toBe(12);
  });
});
