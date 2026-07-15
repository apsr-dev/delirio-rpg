const DICE_EXPRESSION = /^(\d{1,2})d(\d{1,4})([+-]\d{1,4})?$/i;

export type DiceRollResult = {
  expression: string;
  rolls: number[];
  parts: number[];
  modifier: number;
  total: number;
};

export function rollDiceExpression(rawExpression: string): DiceRollResult {
  const expression = rawExpression.replace(/\s+/g, "").toLowerCase();
  const match = DICE_EXPRESSION.exec(expression);

  if (!match) {
    throw new Error("Use uma expressao como 1d20, 2d6+3 ou 1d100-10.");
  }

  const amount = Number(match[1] ?? 0);
  const sides = Number(match[2] ?? 0);
  const modifier = match[3] ? Number(match[3]) : 0;

  if (amount < 1 || amount > 20) {
    throw new Error("Role entre 1 e 20 dados por vez.");
  }

  if (sides < 2 || sides > 1000) {
    throw new Error("Use dados entre d2 e d1000.");
  }

  const rolls = Array.from({ length: amount }, () =>
    Math.floor(Math.random() * sides) + 1,
  );
  const total = rolls.reduce((sum, roll) => sum + roll, modifier);

  return {
    expression,
    rolls,
    parts: modifier === 0 ? rolls : [...rolls, modifier],
    modifier,
    total,
  };
}
