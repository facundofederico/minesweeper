import { useState } from "react";
import Square, { SquareState } from "./Square";
import getUniqueRandomNumbers from "../utils/algorithms";

const bombEmoji = "💣";
const explosionEmoji = "💥";
const nRows = 15;
const nColumns = 10;
const nSquares = nRows*nColumns;
const nBombs = Math.ceil(nSquares*0.15);

export default function Board() {
    const [squareStates, setSquareStates] = useState(Array(nSquares).fill(SquareState.Hidden));
    const [squareContents, setSquareContents] = useState(populateSquares());

    function handleClick(index: number){
        if (squareStates[index] != SquareState.Hidden)
            return;
        
        if (squareContents[index] === bombEmoji){
            const newSquareContents = squareContents.slice();
            newSquareContents[index] = explosionEmoji;

            setSquareContents(newSquareContents);
            setSquareStates(Array(nSquares).fill(SquareState.Revealed));
            return;
        }
        
        const newSquareStates = squareStates.slice();
        if (squareContents[index] === ""){
            const emptySquares = findConnectedEmpty(squareContents, index);
            emptySquares.forEach(emptySquareIndex => newSquareStates[emptySquareIndex] = SquareState.Revealed);
        }
        else {
            newSquareStates[index] = SquareState.Revealed;
        }
        setSquareStates(newSquareStates);
        
        if (isWinningCondition(newSquareStates, squareContents))
            setSquareStates(Array(nSquares).fill(SquareState.Revealed));
    }

    function handleRightClick(index: number){
        if (squareStates[index] === SquareState.Revealed)
            return;

        const newSquareStates = squareStates.slice();
        newSquareStates[index] = squareStates[index] === SquareState.Hidden ? SquareState.Secured : SquareState.Hidden;
        
        setSquareStates(newSquareStates);
    }

    return <>
        {Array.from({ length: nRows }, (_, row) => (
            <div className="board-row" key={row}>
                {Array.from({ length: nColumns }, (_, col) => {
                    const index = getIndex(col, row);
                    return (
                        <Square
                            key={index}
                            id={'square'+index}
                            state={squareStates[index]}
                            content={squareContents[index]}
                            handleClick={() => handleClick(index)}
                            handleRightClick={() => handleRightClick(index)}
                        />
                    );
                })}
            </div>
        ))}
    </>
}

function populateSquares(): Array<string>{
    const squares = Array<string>(nSquares).fill("");
    const bombIndexes = getUniqueRandomNumbers(nBombs, 0, squares.length-1);

    bombIndexes.forEach(index => squares[index] = bombEmoji);

    squares.forEach((square, index) => {
        if (square === bombEmoji) return;

        squares[index] = getNumberOfSurroundingBombs(squares, index);
    });

    return squares;
}

function getIndex(column: number, row: number) : number {
    return row * nColumns + column;
}
function getRowCol(index: number): [number, number] {
    return [Math.floor(index / nColumns), index % nColumns];
}

function getNumberOfSurroundingBombs(squares: string[], index: number): string {
    let result = 0;
    const row = Math.floor(index / nColumns);
    const col = index % nColumns;

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < nRows && newCol >= 0 && newCol < nColumns) {
            if (squares[getIndex(newCol, newRow)] === bombEmoji)
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

      if (newRow >= 0 && newRow < nRows && newCol >= 0 && newCol < nColumns) {
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

function isWinningCondition(squareStates: string[], squareContents: string[]): boolean {
    return squareStates.every((state, index) => state != SquareState.Hidden || squareContents[index] === bombEmoji);
}
