import { ExperienceBar } from '../components/ExperienceBar';
import { Profile } from '../components/Profile';
import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ChallengeBox } from '../components/ChallengeBox';
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';

import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { Auth0Provider } from '@auth0/auth0-react';

import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  level: number;
  currentExperience: number; 
  challengesCompleted: number;
  applicationDomain: string;
  auth0ClientID: string;
  isProductionMode: boolean;
  productionURL: string;
}

export default function Home(props: HomeProps) {
  return (
    <Auth0Provider
      domain={props.applicationDomain}
      clientId={props.auth0ClientID}
      redirectUri={props.isProductionMode ? props.productionURL : 'http://localhost:3000/'}
    >
      <ChallengesProvider 
        level={props.level} 
        currentExperience={props.currentExperience} 
        challengesCompleted={props.challengesCompleted} 
      >
        <div className={styles.container}>
          
          <Head>
            <title>Início | Shake.IT</title>
          </Head>

          <ExperienceBar />

          {/* CountdownProvider is a ContextAPI component. */}
          <CountdownProvider
            isProductionMode={props.isProductionMode}
          >
            <section>
              <div>
                <Profile />
                <CompletedChallenges />
                <Countdown />
              </div>
              
              <div>
                <ChallengeBox />        
              </div>
            </section>
          </CountdownProvider>
        </div>
      </ChallengesProvider>
    </Auth0Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  // Read the cookies from the requisition.
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

  return {
      props: {
          level: Number(level), 
          currentExperience: Number(currentExperience), 
          challengesCompleted: Number(challengesCompleted),
          applicationDomain: String(process.env.AUTH0_SHAKEIT_NEXT_DOMAIN),
          auth0ClientID: String(process.env.AUTH0_SHAKEIT_NEXT_ID),
          isProductionMode: Boolean(process.env.IS_PRODUCTION_MODE == 'true'),
          productionURL: String(process.env.PRODUCTION_URL)
      }
  }
}
