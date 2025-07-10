import { Difficulty, getName } from '../models/difficulty';

interface Props {
    value: Difficulty;
    currentDifficulty: Difficulty;
    handleClick: (difficulty: Difficulty) => void;
}

export default function DifficultyButton({value, currentDifficulty, handleClick}: Props) {
    return (
        <button 
            className={currentDifficulty === value ? 'selected' : ''} 
            onClick={() => handleClick(value)}
        >{getName(value)}</button>
    );
}