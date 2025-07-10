import { SquareState } from "../models/squareState";
import { flagEmoji } from "../utils/emojis";

interface Props {
    id: string;
    state: string;
    content: string;
    handleClick: () => void;
    handleRightClick: () => void;
}

export default function Square({id, state, content, handleClick, handleRightClick}: Props) {
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        handleRightClick();
    };
    const textToShow = () => {
        switch(state){
            case SquareState.Hidden: return null;
            case SquareState.Revealed: return content;
            case SquareState.Secured: return flagEmoji;
        }
    };

    return (
        <button 
            id={id} 
            className={state != SquareState.Revealed ? "hidden" : ""} 
            onClick={handleClick} 
            onContextMenu={handleContextMenu}
        >{textToShow()}</button>
    );
}