import Square from "./Square";
import { getIndex } from "../utils/coordinates";
import type { BoardDimensions } from "../models/boardDimensions";

interface Props {
    dimensions: BoardDimensions;
    squareContents: Array<string>;
    squareStates: Array<string>;
    handleClick: (index: number) => void;
    handleRightClick: (index: number) => void;
}

export default function Board({dimensions, squareContents, squareStates, handleClick, handleRightClick}: Props) {
    const boardRowStyle = {
        display: 'grid', 
        gridTemplateColumns: `repeat(${dimensions.nColumns}, 34px)`, 
        gap: '0px'};

    return <>
        {Array.from({ length: dimensions.nRows }, (_, row) => (
            <div style={boardRowStyle} className="board-row" key={row}>
                {Array.from({ length: dimensions.nColumns }, (_, col) => {
                    const index = getIndex(col, row, dimensions.nColumns);
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
