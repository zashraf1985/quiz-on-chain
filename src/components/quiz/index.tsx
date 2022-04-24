import {
  Grid,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { BarColor, ChallengeInfo, QuestionInfo, QuizResult, QuizType, WinnerType } from "../../types";
import { Question } from "./question";

export type QuizProps = {
  questions: Array<QuestionInfo>;
  allowedTimeSeconds: number;
  challenge?: ChallengeInfo;
  onComplete?: (quizResult: QuizResult) => void
};

const progressBarStyle = {
  marginTop: 7,
  height: 10,
  borderRadius: 5,
};

const getTimeString = (seconds: number) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

export function Quiz(props: QuizProps) {
  const { questions, allowedTimeSeconds, challenge, onComplete } = props;
  const quizType = challenge ? QuizType.CHALLENGE : QuizType.FIRST_PLAY;

  const totalQuestions = questions.length;
  const [timeRemaining, setTimeRemaining] =
    useState<number>(allowedTimeSeconds);
  const [timeRemainingOpp, setTimeRemainingOpp] =
    useState<number>(allowedTimeSeconds);
  const [disableOptions, setDisableOptions] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState<number>(0);

  const [numCorrectAnswersOpp, setNumCorrectAnswersOpp] = useState<number>(0);
  const [numTotalAnswersOpp, setNumTotalAnswersOpp] = useState<number>(0);

  const [myBarColor, setMyBarColor] = useState<BarColor>(BarColor.PRIMARY);
  const [oppBarColor, setOppBarColor] = useState<BarColor>(BarColor.PRIMARY);
  const [iconToShow, setIconToShow] = useState<string>("");
  const question = questions[currentQuestionIndex];
  const correctAnswerSnapshots = useRef<number[]>([]);
  const incorrectAnswerSnapshots  = useRef<number[]>([]);
  const numTotalAnswers = correctAnswerSnapshots.current.length + incorrectAnswerSnapshots.current.length;

  const quizEnded =
    ( numTotalAnswers >= totalQuestions || timeRemaining <= 0)
    && (quizType == QuizType.FIRST_PLAY || numTotalAnswersOpp >= totalQuestions || timeRemainingOpp <=0);

  useEffect(() => {
    setTimeout(() => {
      if (timeRemaining > 0 && numCorrectAnswers + incorrectAnswerSnapshots.current.length < totalQuestions) {
        setTimeRemaining(timeRemaining - 1);
      }
    }, 1000);
  }, [timeRemaining]);

  useEffect(() => {
    setTimeout(() => {
      if (challenge?.correctAnswerSnapshots.includes(timeRemainingOpp - 1)) {
        setNumCorrectAnswersOpp(numCorrectAnswersOpp + 1);
        setNumTotalAnswersOpp(numTotalAnswersOpp + 1);
        setOppBarColor(BarColor.SUCCESS);
        setTimeout(() => {
          setOppBarColor(BarColor.PRIMARY);
        }, 500);
      }

      if (challenge?.incorrectAnswerSnapshots.includes(timeRemainingOpp - 1)) {
        setNumTotalAnswersOpp(numTotalAnswersOpp + 1);
        setOppBarColor(BarColor.ERROR);
        setTimeout(() => {
          setOppBarColor(BarColor.PRIMARY);
        }, 500);
      }

      if (timeRemainingOpp > 0 && numTotalAnswersOpp < totalQuestions) {
        setTimeRemainingOpp(timeRemainingOpp - 1);
      }
    }, 1000);
  }, [timeRemainingOpp]);

  useEffect(() => {
    if (!quizEnded || !onComplete) {
      return;
    }

    const result: QuizResult = { quizType }
    if (quizType === QuizType.FIRST_PLAY) {
      result.challengInfo = {
        allowedTimeSeconds,
        correctAnswerSnapshots: correctAnswerSnapshots.current,
        incorrectAnswerSnapshots: incorrectAnswerSnapshots.current,
      }
    } else {
      let winner: WinnerType = WinnerType.DRAW;
      if (numCorrectAnswers > numCorrectAnswersOpp) {
        winner = WinnerType.ME;
      } else if (numCorrectAnswersOpp > numCorrectAnswers) {
        winner = WinnerType.OPP
      } else {
        if (timeRemaining < timeRemainingOpp) {
          winner = WinnerType.OPP
        } else if (timeRemainingOpp < timeRemaining) {
          winner = WinnerType.ME
        }
      }
      result.winner = winner;
    }
    onComplete(result);
  }, [quizEnded]);

  const handleAnswer = async (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const isCorrect = question.correctAnswer === value;
    if (isCorrect) {
      setMyBarColor(BarColor.SUCCESS);
      setNumCorrectAnswers(numCorrectAnswers + 1);
      correctAnswerSnapshots.current = [ ...correctAnswerSnapshots.current, timeRemaining];
    } else {
      setMyBarColor(BarColor.ERROR);
      incorrectAnswerSnapshots.current = [ ...incorrectAnswerSnapshots.current, timeRemaining];
    }
    const optionIndex = event.target.name;
    setIconToShow(
      isCorrect ? `correct-${optionIndex}` : `incorrect-${optionIndex}`
    );
    setDisableOptions(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setMyBarColor(BarColor.PRIMARY);

    if (currentQuestionIndex <= totalQuestions - 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setDisableOptions(false);
      setIconToShow("");
    }
  };

  return (
    <Stack>
      { !quizEnded && 
        ( !(numTotalAnswers >= totalQuestions || timeRemaining <=0)
          ? <Question
              questionInfo={question}
              answerHandler={handleAnswer}
              currentQuestionIndex={currentQuestionIndex}
              disableOptions={disableOptions}
              iconToShow={iconToShow}
            />
          : <label style={{ marginTop: 10 }}> Waiting for Opponent to finish</label>
        )
      }
      { quizEnded &&
        <label style={{ marginTop: 10 }}> Quiz Finished </label>
      }
      <hr />
      <Grid container style={{ paddingTop: 10 }} columnSpacing={2}>
        <Grid item xs={1}>
          <b>You</b>
        </Grid>
        <Grid item xs={8}>
          <LinearProgress
            style={progressBarStyle}
            variant="determinate"
            color={myBarColor}
            value={Math.ceil((numCorrectAnswers / totalQuestions) * 100)}
          />
        </Grid>
        <Grid item xs={3}>
          <b>{getTimeString(timeRemaining)}</b>
        </Grid>
      </Grid>
      { quizType == QuizType.CHALLENGE &&
        <Grid container style={{ paddingTop: 10 }} columnSpacing={2}>
          <Grid item xs={1}>
            <b>Opp</b>
          </Grid>
          <Grid item xs={8}>
            <LinearProgress
              style={progressBarStyle}
              variant="determinate"
              color={oppBarColor}
              value={Math.ceil((numCorrectAnswersOpp / totalQuestions) * 100)}
            />
          </Grid>
          <Grid item xs={3}>
            <b>{getTimeString(timeRemainingOpp)}</b>
          </Grid>
        </Grid>
      }
    </Stack>
  );
}
