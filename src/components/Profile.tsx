import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengesContext';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
    const { level } = useContext(ChallengeContext);
    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        user
    } = useAuth0();

    return (
        <div className={styles.profileContainer}>
            <img src={user?.picture || "/favicon.Shake.IT.png"} alt={user?.name || "User"} />
            <div>
                <strong>{user?.name || "Faça login para continuar"}</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
                
                {isAuthenticated ? (
                    <button 
                        className={styles.logoutButton}
                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                        Sair da conta
                    </button>
                ) : (
                    <button onClick={() => loginWithRedirect()}>
                        Fazer login
                    </button>
                )}
            </div>
        </div>
    );
}
