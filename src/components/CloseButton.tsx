interface Props {
    handleClick: () => void;
}

export default function CloseButton({handleClick}: Props) {
    return (
        <button className="close" onClick={handleClick}>X</button>
    );
}