export function getIndex(column: number, row: number, squaresPerRow: number) : number {
    return row * squaresPerRow + column;
}
export function getRowCol(index: number, squaresPerRow: number): [number, number] {
    return [Math.floor(index / squaresPerRow), index % squaresPerRow];
}

export const directions = [
    [-1,  0], // Up
    [ 1,  0], // Down
    [ 0, -1], // Left
    [ 0,  1], // Right
    [-1, -1], // Up-Left
    [-1,  1], // Up-Right
    [ 1, -1], // Down-Left
    [ 1,  1], // Down-Right
];