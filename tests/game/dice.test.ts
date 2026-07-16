import { describe, expect, test } from "bun:test";
import { rollDiceExpression } from "../../src/game/dice.js";

describe("rollDiceExpression", () => {
  test("rolls a default d20 expression", () => {
    const result = rollDiceExpression("1d20");

    expect(result.expression).toBe("1d20");
    expect(result.rolls).toHaveLength(1);
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.total).toBeLessThanOrEqual(20);
  });

  test("supports modifiers", () => {
    const result = rollDiceExpression("2d6+3");
    const expectedTotal = result.parts.reduce((sum, part) => sum + part, 0);

    expect(result.rolls).toHaveLength(2);
    expect(result.parts).toHaveLength(3);
    expect(result.modifier).toBe(3);
    expect(result.total).toBe(expectedTotal);
  });

  test("rejects invalid expressions", () => {
    expect(() => rollDiceExpression("oops")).toThrow(
      "Use uma expressao como 1d20, 2d6+3 ou 1d100-10.",
    );
  });
});
