import { useEffect, useRef, useState } from "react";
import { toClock } from "../utils/time";

interface Props {
    duration: number;
    isRunning: boolean;
    resetTrigger: boolean;
    handleTimeout: () => void;
}

export default function Clock({duration, isRunning, resetTrigger, handleTimeout}: Props) {
    const [remaining, setRemaining] = useState(duration);
    const startTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!resetTrigger) return;
        
        setRemaining(duration);
        startTimeRef.current = null;
    }, [resetTrigger, duration]);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now();
            console.log("Start time: "+startTimeRef.current);

            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    const newRemaining = Math.floor((startTimeRef.current! + duration*1000 - Date.now())/1000);

                    if (newRemaining <= 0) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setRemaining(0);
                        handleTimeout();
                    }
                    
                    setRemaining(newRemaining);
                }, 1000);
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [duration, handleTimeout, isRunning]);
    
    return (
        <p className="clock">{toClock(remaining)}</p>
    );
}