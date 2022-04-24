import { AnswerOption, QuestionInfo } from "../types";
import { randomIntFromInterval } from "../utils";

export function generateBasicAdditionQuiz(numQuestions: number = 20, numOptions: number = 4) {
  const questions: QuestionInfo[] = []
  for (let i = 0; i < numQuestions; i ++) {
    const num1 = randomIntFromInterval(10, 1000);
    const num2 = randomIntFromInterval(10, 1000);
    const answer = num1 + num2;
    const correctAnswerIndex = randomIntFromInterval(0, numOptions-1);
    const options: AnswerOption[] = [];
    for (let j = 0; j < numOptions; j++) {
      if (j === correctAnswerIndex) {
        options.push({
          label: answer.toString(),
          value: answer.toString(),
        });
      } else {
        const randomOption = randomIntFromInterval(answer - 50, answer + 50);
        options.push({
          label: randomOption.toString(),
          value: randomOption.toString(),
        });
      }
    }
    questions.push({
      question: `${num1} + ${num2}`,
      correctAnswer: `${answer}`,
      options,
    });
  }
  //console.log(JSON.stringify(questions, null, 2));
  return questions;
}