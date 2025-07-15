import type { BoardDimensions } from "./boardDimensions";

export const BoardSize = {
    Small: {nRows: 14, nColumns: 12} as BoardDimensions,
    Medium: {nRows: 14, nColumns: 21} as BoardDimensions,
    Large : {nRows: 14, nColumns: 30} as BoardDimensions,
} as const;

export type BoardSize = (typeof BoardSize)[keyof typeof BoardSize];

export function getName(value: BoardSize): string {
  const entry = Object.entries(BoardSize).find(([, v]) => v === value);
  return entry![0];
}