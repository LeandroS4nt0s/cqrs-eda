import { describe, it, expect, beforeEach } from "vitest";
import { Query, getQueryRegistry } from "./decorators";

describe("Query decorator and registry", () => {
  beforeEach(() => {
    getQueryRegistry().clear();
  });

  it("should register a query class with the given name", () => {
    @Query("TEST_QUERY")
    class TestQuery {}

    const registry = getQueryRegistry();
    expect(registry.has("TEST_QUERY")).toBe(true);
    expect(registry.get("TEST_QUERY")).toBe(TestQuery);
  });

  it("should throw an error if registering a query with a duplicate name", () => {
    @Query("DUPLICATE_QUERY")
    class QueryOne {}

    expect(() => {
      @Query("DUPLICATE_QUERY")
      class QueryTwo {}
    }).toThrowError('Query with name "DUPLICATE_QUERY" is already registered.');
  });

  it("should register multiple different queries without conflict", () => {
    @Query("QUERY_ONE")
    class QueryOne {}

    @Query("QUERY_TWO")
    class QueryTwo {}

    const registry = getQueryRegistry();
    expect(registry.size).toBe(2);
    expect(registry.get("QUERY_ONE")).toBe(QueryOne);
    expect(registry.get("QUERY_TWO")).toBe(QueryTwo);
  });
});
