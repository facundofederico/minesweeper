import { useEffect, useState } from "react";
import Square, { SquareState } from "./Square";
import getUniqueRandomNumbers from "../utils/algorithms";
import { directions, getIndex, getRowCol } from "../utils/coordinates";

const bombEmoji = "💣";
const explosionEmoji = "💥";


export interface BoardDimensions {
    nRows: number;
    nColumns: number;
}

interface BoardProps {
    dimensions: BoardDimensions;
    bombRatio: number;
}

export default function Board({dimensions, bombRatio}: BoardProps) {
    const nRows = dimensions.nRows;
    const nColumns = dimensions.nColumns;
    const nSquares = nRows*nColumns;
    const nBombs = Math.ceil(nSquares*bombRatio);

    const [squareStates, setSquareStates] = useState(Array(nSquares));
    const [squareContents, setSquareContents] = useState(Array(nSquares));

    useEffect(() => {
        setSquareStates(Array(nSquares).fill(SquareState.Hidden));
        setSquareContents(populateSquares(nRows, nColumns, nBombs))
    }, [nRows, nColumns, nSquares, nBombs]);

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
            const emptySquares = findConnectedEmpty(squareContents, index, nColumns, nRows);
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
                    const index = getIndex(col, row, nColumns);
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

function populateSquares(nRows: number, nColumns: number, nBombs: number): Array<string>{
    const squares = Array<string>(nRows*nColumns).fill("");
    const bombIndexes = getUniqueRandomNumbers(nBombs, 0, squares.length-1);

    bombIndexes.forEach(index => squares[index] = bombEmoji);

    squares.forEach((square, index) => {
        if (square === bombEmoji) return;

        squares[index] = getNumberOfSurroundingBombs(squares, index, nRows, nColumns);
    });

    return squares;
}

function getNumberOfSurroundingBombs(squares: string[], index: number, nRows: number, nColumns: number): string {
    let result = 0;
    const [row, col] = getRowCol(index, nColumns);

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow >= 0 && newRow < nRows && newCol >= 0 && newCol < nColumns) {
            if (squares[getIndex(newCol, newRow, nColumns)] === bombEmoji)
                result++;
        }
    }

    return result === 0 ? "" : result.toString();
}

function findConnectedEmpty(squares: string[], startIndex: number, nColumns: number, nRows: number): number[] {
  const visited = new Set<number>();
  const result: number[] = [];

  function dfs(index: number) {
    if (visited.has(index)) return;

    visited.add(index);

    if (squares[index] === bombEmoji) return;

    result.push(index);

    if (squares[index] != "") return;

    const [row, col] = getRowCol(index, nColumns);

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < nRows && newCol >= 0 && newCol < nColumns) {
        const newIndex = getIndex(newCol, newRow, nColumns);
        dfs(newIndex);
      }
    }
  }

  dfs(startIndex);
  return result;
}

function isWinningCondition(squareStates: string[], squareContents: string[]): boolean {
    return squareStates.every((state, index) => state != SquareState.Hidden || squareContents[index] === bombEmoji);
}
