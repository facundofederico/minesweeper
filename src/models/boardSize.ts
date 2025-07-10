import type { BoardDimensions } from "./boardDimensions";

export const BoardSize = {
    Small: {nRows: 8, nColumns: 14} as BoardDimensions,
    Medium: {nRows: 12, nColumns: 18} as BoardDimensions,
    Large : {nRows: 16, nColumns: 24} as BoardDimensions,
} as const;

export type BoardSize = (typeof BoardSize)[keyof typeof BoardSize];

export function getName(value: BoardSize): string {
  const entry = Object.entries(BoardSize).find(([, v]) => v === value);
  return entry![0];
}