import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengesContext';
import { useAuth0 } from '@auth0/auth0-react';
import styles from '../styles/components/Profile.module.css';

export function Profile () {
    
    const { level } = useContext(ChallengeContext);

    const {
        isAuthenticated,
        loginWithRedirect,
        logout,
        user
    } = useAuth0();

    return (
        <div className={styles.profileContainer}>
            <img src={isAuthenticated && user?.picture ? user.picture : '/favicon.Shake.IT.png'} alt="Profile image"/>
            
            <div className={styles.profileContainerLogin}>
                <strong>{isAuthenticated && user?.name ? user.name : 'Unknown User'}</strong>
                
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}
                </p>
                
                { isAuthenticated ? (
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
                ) : (
                    <button onClick={(e: React.MouseEvent) => loginWithRedirect()}>Login</button>
                ) }
                
            </div>
        </div>
    );
}
