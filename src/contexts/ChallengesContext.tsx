import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    closeLevelUpModal: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completedChallenge: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number; 
    challengesCompleted: number;
}

export const ChallengeContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest } : ChallengesProviderProps) {

    const [level, setLevel] = useState( rest.level ?? 1 );
    const [currentExperience, setCurrentExperience] = useState( rest.currentExperience ?? 0 );
    const [challengesCompleted, setChallengesCompleted] = useState( rest.challengesCompleted ?? 0 );

    const [activeChallenge, setActiveChallenge] = useState(null as Challenge);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    /// This function comes RPG
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    // Request permissions only once.
    useEffect(() => {
        Notification.requestPermission();
    }, []);

    // Cookies are updated every time the variables change the value.
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level +1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const newChallenge = challenges[randomChallengeIndex] as Challenge;

        setActiveChallenge(newChallenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            const notification = new Notification('Novo desafio :D', {
                body: `Valendo ${newChallenge.amount}xp!`
            });

            notification.onclick = (e) => {
                e.preventDefault();
                window.focus();
                notification.close();
            }
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completedChallenge() {
        // This function can only be executed if there is active challange.
        if (!activeChallenge)
            return;
        
        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        // If the completed challenge is enough to change level
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }
    
    return (
        <ChallengeContext.Provider value={{
            level, 
            currentExperience, 
            challengesCompleted, 
            activeChallenge, 
            experienceToNextLevel, 
            levelUp,
            closeLevelUpModal, 
            startNewChallenge, 
            resetChallenge, 
            completedChallenge
        }}>
            {children}

            {/* This modal could be anywhere, however it is managed by ChallengeContext's functions. */}
            {/* It only opens when levelUp() is triggered. */}
            {isLevelUpModalOpen && <LevelUpModal /> }
        </ChallengeContext.Provider>
    );
}
