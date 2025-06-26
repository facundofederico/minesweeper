interface SquareProps {
    id: string;
    isHidden: boolean;
    content: string;
    handleClick: () => void;
}

export default function Square({id, isHidden, content, handleClick}: SquareProps) {
    const className = isHidden ? "hidden" : "";
    return (<button id={id} className={className} onClick={handleClick}>{isHidden ? null : content}</button>)
}