export type ChallengeInfo = {
  correctAnswerSnapshots: number[];
  incorrectAnswerSnapshots: number[];
  allowedTimeSeconds: number;
};

export enum BarColor {
  PRIMARY = "primary",
  ERROR = "error",
  SUCCESS = "success",
}

export interface QuestionInfo {
  question: string
  options: AnswerOption[]
  correctAnswer: string
}

export interface AnswerOption {
  label: string
  value: string
}

export interface QuizResult {
  quizType: QuizType
  challengInfo?: ChallengeInfo
  winner?: WinnerType
}

export enum QuizType {
  FIRST_PLAY = "FIRST_PLAY",
  CHALLENGE = "CHALLENGE"
}

export enum WinnerType {
  ME = "ME",
  OPP = "OPPONENT",
  DRAW = "DRAW"
}