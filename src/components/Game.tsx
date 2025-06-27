import Board, { type BoardDimensions } from "./Board";
import { useState } from 'react';


export const BoardSize = {
    Small: {nRows: 8, nColumns: 14} as BoardDimensions,
    Medium: {nRows: 12, nColumns: 18} as BoardDimensions,
    Large : {nRows: 16, nColumns: 24} as BoardDimensions,
} as const;

export const Difficulty = {
    Easy: 0.08,
    Medium: 0.14,
    Hard : 0.2,
} as const;

export default function Game(){
    const [boardSize, setBoardSize] = useState<BoardDimensions>(BoardSize.Medium);
    const [difficulty, setDifficulty] = useState<number>(Difficulty.Medium);

    return (<>
        <div className="configuration">
            <p>Board Size</p>
            <button onClick={() => setBoardSize(BoardSize.Small)}>Small</button>
            <button onClick={() => setBoardSize(BoardSize.Medium)}>Medium</button>
            <button onClick={() => setBoardSize(BoardSize.Large)}>Large</button>
            <p>Difficulty</p>
            <button onClick={() => setDifficulty(Difficulty.Easy)}>Easy</button>
            <button onClick={() => setDifficulty(Difficulty.Medium)}>Medium</button>
            <button onClick={() => setDifficulty(Difficulty.Hard)}>Hard</button>
        </div>
        
        <Board dimensions={boardSize} bombRatio={difficulty} />
    </>);
}