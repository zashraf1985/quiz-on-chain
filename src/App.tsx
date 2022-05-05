import './App.css';
import { Box, Button, Container, CssBaseline } from '@mui/material';
import MainMenu from './components/main_menu';
import { Quiz } from './components/quiz';
import { useRef, useState } from 'react';
import { ChallengeInfo, QuestionInfo, QuizResult, QuizType } from './types';
import { generateBasicAdditionQuiz } from './quiz_generator';
import { randomIntFromInterval, serializeChallengeInfo } from './utils';

function App() {
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const challenges = useRef<ChallengeInfo[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeInfo | undefined>();

  const onCreateChallenge = () => {
    setSelectedChallenge(undefined);
    setIsQuizActive(true);
  }

  const onFindChallenge = () => {
    const challengeIndex = randomIntFromInterval(0, challenges.current.length - 1);
    setSelectedChallenge(challenges.current[challengeIndex]);
    setIsQuizActive(true);
  }

  const onCompleteHandler = (quizResult: QuizResult) => {
    console.log(quizResult);
    console.log(serializeChallengeInfo(quizResult.challengInfo!));
    setIsQuizActive(false);
    if (quizResult.quizType == QuizType.FIRST_PLAY) {
      challenges.current = [...challenges.current, quizResult.challengInfo!];
    }
  }

  return (
    <>
    <CssBaseline />
    <Container maxWidth="sm">
      { isQuizActive && 
        <Quiz
          questions={generateBasicAdditionQuiz()}
          allowedTimeSeconds={selectedChallenge?.allowedTimeSeconds || 60}
          challenge={selectedChallenge}
          onComplete={onCompleteHandler}
        />
      }

      { !isQuizActive && 
        <Box sx={{ '& button': { m: 1 } }}>
          <Button variant="contained" size="large" onClick={onCreateChallenge}>Create New Challenge</Button>
          <Button variant="contained" size="large" onClick={onFindChallenge} disabled={!challenges.current.length}>Find Challenge</Button>
        </Box>
      }
    </Container>
    </>
  );
}

export default App;
