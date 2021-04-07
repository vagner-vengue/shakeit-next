import { createContext, ReactNode, useEffect, useState, useContext } from 'react';
import { ChallengeContext } from './ChallengesContext';

interface CountdownContextData {
    time: number;
    isActive: boolean;
    hasFinished: boolean;
    minutes: number;
    seconds: number;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

// State of timeout.
let countdownTimeout: NodeJS.Timeout;

const challengeTime25min = 25 * 60;
const challengeTime5sec = 5;
const TEST_MODE = true;

export function CountdownProvider({ children } : CountdownProviderProps) {

    const { startNewChallenge } = useContext(ChallengeContext);

    const [time, setTime] = useState(TEST_MODE ? challengeTime5sec : challengeTime25min);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(TEST_MODE ? challengeTime5sec : challengeTime25min);
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time -1);
            }, 1000);
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();   /* this function comes from Context API */
        }
    }, [isActive, time]);


    return (
        <CountdownContext.Provider value={{
            time,
            isActive,
            hasFinished,
            minutes,
            seconds,
            startCountdown,
            resetCountdown
        }}>
            {children}
        </CountdownContext.Provider>
    );
}
