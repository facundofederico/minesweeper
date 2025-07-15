import { BoardSize, getName } from "../models/boardSize";

interface Props {
    value: BoardSize;
    currentSize: BoardSize;
    handleClick: (size: BoardSize) => void;
}

export default function BoardSizeButton({value, currentSize, handleClick}: Props) {
    return (
        <button
            className={currentSize === value ? 'selected' : ''} 
            onClick={() => handleClick(value)}
        >{getName(value)}</button>
    );
}