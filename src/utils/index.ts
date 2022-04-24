import { ChallengeInfo } from "../types";

export function serializeChallengeInfo({
  allowedTimeSeconds,
  correctAnswerSnapshots,
  incorrectAnswerSnapshots,
}: ChallengeInfo): string {
  return `${allowedTimeSeconds}#${correctAnswerSnapshots.join('-')}#${incorrectAnswerSnapshots.join('-')}`;
}

export function deserializeChallengeInfo(challengInfoString: string): ChallengeInfo | null {
  const items: string[] = challengInfoString.split('#');
  if (items.length === 3) {
    const allowedTimeSeconds: number = parseInt(items[0]);
    const correctAnswerSnapshots: number[] = items[1].split('-').map(val => parseInt(val));
    const incorrectAnswerSnapshots: number[] = items[2].split('-').map(val => parseInt(val));
    return {
      allowedTimeSeconds,
      correctAnswerSnapshots,
      incorrectAnswerSnapshots
    }
  }
  return null;
}

export function randomIntFromInterval(min: number, max: number): number { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}