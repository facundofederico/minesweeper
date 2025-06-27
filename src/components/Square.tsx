export const SquareState = {
    Hidden: "hidden",
    Secured: "secured",
    Revealed : "revealed",
} as const;

interface SquareProps {
    id: string;
    state: string;
    content: string;
    handleClick: () => void;
    handleRightClick: () => void;
}

export default function Square({id, state, content, handleClick, handleRightClick}: SquareProps) {
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        handleRightClick();
    };
    const textToShow = () => {
        switch(state){
            case SquareState.Hidden: return null;
            case SquareState.Revealed: return content;
            case SquareState.Secured: return "🚩";
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