import { useState } from "react";
import Square from "./Square";

const bombEmoji = "💣";
const explosionEmoji = "💥";
const rows = 3;
const cols = 3;
const bombs = Math.ceil(rows*cols*0.15);

export default function Board() {
    const [hiddenSquares, setHiddenSquares] = useState(Array(rows*cols).fill(true));
    const [squareContents, setSquareContents] = useState(populateSquares());

    function handleClick(index: number){
        if (hiddenSquares[index] === false)
            return;
        
        if (squareContents[index] === bombEmoji){ // Losing scenario
            const newSquareContents = squareContents.slice();
            newSquareContents[index] = explosionEmoji;

            setSquareContents(newSquareContents);
            setHiddenSquares(Array(rows*cols).fill(false));
            return;
        }

        const newHiddenSquares = hiddenSquares.slice();
        if (squareContents[index] === ""){
            const emptySquares = findConnectedEmpty(squareContents, index);
            emptySquares.forEach(emptySquareIndex => newHiddenSquares[emptySquareIndex] = false);
        }
        else {
            newHiddenSquares[index] = false;
        }

        setHiddenSquares(newHiddenSquares);
        
        if (isWinningCondition(newHiddenSquares, squareContents))
            setHiddenSquares(Array(rows*cols).fill(false));
    }

    return <>
        {Array.from({ length: rows }, (_, row) => (
            <div className="board-row" key={row}>
                {Array.from({ length: cols }, (_, col) => {
                    const index = getIndex(col, row);
                    return (
                        <Square
                            key={index}
                            id={'square'+index}
                            isHidden={hiddenSquares[index]}
                            content={squareContents[index]}
                            handleClick={() => handleClick(index)}
                        />
                    );
                })}
            </div>
        ))}
    </>
}

function populateSquares(): Array<string>{
    const squares = Array<string>(rows*cols).fill("");
    const bombIndexes = getUniqueRandomNumbers(bombs, 0, squares.length-1);

    bombIndexes.forEach(index => squares[index] = bombEmoji);

    squares.forEach((square, index) => {
        if (square === bombEmoji) return;

        squares[index] = getNumberOfSurroundingBombs(squares, index);
    });

    return squares;
}

function getIndex(column: number, row: number) : number {
    return row * cols + column;
}
function getRowCol(index: number): [number, number] {
    return [Math.floor(index / cols), index % cols];
}

function getUniqueRandomNumbers(n: number, start: number, end: number): number[] {
    const range = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = range.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [range[i], range[j]] = [range[j], range[i]];
    }

    return range.slice(0, n);
}

function getNumberOfSurroundingBombs(squares: string[], index: number): string {
    let result = 0;
    const row = Math.floor(index / cols);
    const col = index % cols;

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const newIndex = newRow * cols + newCol;
            if (squares[newIndex] === bombEmoji)
                result++;
        }
    }

    return result === 0 ? "" : result.toString();
}

function findConnectedEmpty(matrix: string[], startIndex: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function dfs(index: number) {
    if (visited.has(index)) return;
    visited.add(index);

    if (matrix[index] === bombEmoji) return;

    result.push(index);

    if (matrix[index] != "") return;

    const [row, col] = getRowCol(index);

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        const newIndex = getIndex(newCol, newRow);
        dfs(newIndex);
      }
    }
  }

  dfs(startIndex);
  return result;
}

const directions = [
    [-1,  0], // Up
    [ 1,  0], // Down
    [ 0, -1], // Left
    [ 0,  1], // Right
    [-1, -1], // Up-Left
    [-1,  1], // Up-Right
    [ 1, -1], // Down-Left
    [ 1,  1], // Down-Right
];

function isWinningCondition(hiddenSquares: boolean[], squareContents: string[]): boolean {
    return hiddenSquares.every((isHidden, index) => !isHidden || squareContents[index] === bombEmoji);
}
