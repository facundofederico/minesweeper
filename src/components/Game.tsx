import Board from "./Board";
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import getUniqueRandomNumbers from "../utils/algorithms";
import { bombEmoji, explosionEmoji } from "../utils/emojis";
import { directions, getIndex, getRowCol } from "../utils/coordinates";
import { BoardSize } from '../models/boardSize';
import { Difficulty } from "../models/difficulty";
import type { BoardDimensions } from "../models/boardDimensions";
import { SquareState } from "../models/squareState";
import BoardSizeButton from "./BoardSizeButton";
import DifficultyButton from "./DifficultyButton";
import CloseButton from "./CloseButton";
import Clock from "./Clock";

export default function Game(){
    const [boardSize, setBoardSize] = useState<BoardDimensions>(BoardSize.Medium);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
    const [squareContents, setSquareContents] = useState(populateSquares(boardSize.nRows, boardSize.nColumns, difficulty));
    const [squareStates, setSquareStates] = useState(Array(boardSize.nRows*boardSize.nColumns));
    const [clockIsRunning, setClockIsRunning] = useState(false);
    const [resetClockTrigger, setResetClockTrigger] = useState(false);
    const durationInSeconds = 240;
    
    useEffect(() => {
        loadNewGame(boardSize.nRows, boardSize.nColumns, difficulty);
    }, [boardSize, difficulty]);

    function loadNewGame(nRows: number, nColumns: number, difficulty: Difficulty){
        setSquareContents(populateSquares(nRows, nColumns, difficulty));
        setSquareStates(Array(nRows*nColumns).fill(SquareState.Hidden));
        setClockIsRunning(false);
        setResetClockTrigger(prev => !prev);
    }

    function handleClick(index: number){
        if (squareStates[index] != SquareState.Hidden)
            return;
        
        if (!clockIsRunning)
            setClockIsRunning(true);
        
        if (squareContents[index] === bombEmoji){
            const newSquareContents = squareContents.slice();
            newSquareContents[index] = explosionEmoji;

            setSquareContents(newSquareContents);
            setSquareStates(squareStates.slice().fill(SquareState.Revealed));

            handleLosing();
            return;
        }
        
        const newSquareStates = squareStates.slice();
        if (squareContents[index] === ""){
            const emptySquares = findConnectedEmpty(squareContents, index, boardSize.nColumns, boardSize.nRows);
            emptySquares.forEach(emptySquareIndex => newSquareStates[emptySquareIndex] = SquareState.Revealed);
        }
        else {
            newSquareStates[index] = SquareState.Revealed;
        }
        setSquareStates(newSquareStates);
        
        if (isWinningCondition(newSquareStates, squareContents))
            handleWinning();
    }

    function handleWinning(){
        setSquareStates(squareStates.slice().fill(SquareState.Revealed));
        setClockIsRunning(false);
        toggleDialog(winningDialogRef);
    }

    function handleLosing(){
        setClockIsRunning(false);
        toggleDialog(losingDialogRef);
    }

    function handleRightClick(index: number){
        if (squareStates[index] === SquareState.Revealed)
            return;

        const newSquareStates = squareStates.slice();
        newSquareStates[index] = squareStates[index] === SquareState.Hidden ? SquareState.Secured : SquareState.Hidden;
        
        setSquareStates(newSquareStates);
    }

    const optionsDialogRef = useRef<HTMLDialogElement>(null);
    const winningDialogRef = useRef<HTMLDialogElement>(null);
    const losingDialogRef = useRef<HTMLDialogElement>(null);

    function toggleDialog(dialogRef: RefObject<HTMLDialogElement|null>){
        if (!dialogRef.current)
            return;

        if (dialogRef.current.hasAttribute("open")) {
            dialogRef.current.close();
        } else {
            dialogRef.current.showModal();
        }
    }

    function handleTimeout(){
        setSquareContents(prev => prev.map(x => x === bombEmoji ? explosionEmoji : x));
        setSquareStates(Array(boardSize.nRows*boardSize.nColumns).fill(SquareState.Revealed));
        handleLosing();
    }

    return (<>
        <div className="toolbar">
            <button onClick={() => loadNewGame(boardSize.nRows, boardSize.nColumns, difficulty)}>New Game</button>
            <Clock duration={durationInSeconds} isRunning={clockIsRunning} resetTrigger={resetClockTrigger} handleTimeout={useCallback(handleTimeout, [])}></Clock>
            <button onClick={() => toggleDialog(optionsDialogRef)}>Options</button>
        </div>
        
        <Board dimensions={boardSize} squareContents={squareContents} squareStates={squareStates} handleClick={handleClick} handleRightClick={handleRightClick}/>

        <dialog ref={optionsDialogRef} className="options">
            <CloseButton handleClick={() => toggleDialog(optionsDialogRef)}></CloseButton>
            <p>Board Size</p>
            {Array.from(Object.entries(BoardSize), ([,size]) => 
                <BoardSizeButton
                    key={'boardSizeButton_'+size.nColumns}
                    value={size}
                    currentSize={boardSize}
                    handleClick={setBoardSize}
                ></BoardSizeButton>
            )}
            <p>Difficulty</p>
            {Array.from(Object.entries(Difficulty), ([,diff]) => 
                <DifficultyButton
                    key={'boardSizeButton_'+diff}
                    value={diff}
                    currentDifficulty={difficulty}
                    handleClick={setDifficulty}
                ></DifficultyButton>
            )}
        </dialog>

        <dialog ref={winningDialogRef} className="options">
            <CloseButton handleClick={() => toggleDialog(winningDialogRef)}></CloseButton>
            <br></br>
            <p>🎉 Congratulations! You won! 🎉</p>
        </dialog>

        <dialog ref={losingDialogRef} className="options">
            <CloseButton handleClick={() => toggleDialog(losingDialogRef)}></CloseButton>
            <br></br>
            <p>💀 You lost! Try again! 💀</p>
        </dialog>
    </>);
}

function populateSquares(nRows: number, nColumns: number, difficulty: Difficulty): Array<string>{
    const nBombs = nRows*nColumns*difficulty;
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