export const Difficulty = {
    Easy: 0.07,
    Medium: 0.14,
    Hard : 0.28,
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export function getName(value: Difficulty): string {
  const entry = Object.entries(Difficulty).find(([, v]) => v === value);
  return entry![0];
}