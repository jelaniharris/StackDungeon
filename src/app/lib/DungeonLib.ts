// Timed - Yes - Amount Per Question / No
// Accumulating time - Time rolls over to each additional question
// Pass Percentage - Yes [Amount] / No
// Show Progress - Shows the progress meter at the bottom of the screen
// Number of Questions
// Unknown Number of Questions
// Tennis - Must get 3 in a row to continue
// Boons - Yes / No

import {
  DifficultyReasonType,
  Dungeon,
} from '@/store/Features/dungeon/DungeonSlice';

import { generateRandomString } from '@/app/lib/utility';

export const generateDungeons = (floorNumber: number) => {
  const amountOfDoors = 3;
  const doors: Dungeon[] = [];

  for (let i = 0; i < amountOfDoors; i++) {
    const difficultyReasons: DifficultyReasonType[] = [];

    const newDungeon: Dungeon = {
      hasTimer: false,
      name: 'unknown',
      difficulty: 1,
      numberOfQuestions: 0,
      difficultyReasons: [],
      domains: [],
    };

    const allNames = [
      'Mines of',
      'Mists of',
      'Plains of',
      'Forest of',
      'Shade of',
      'Tomb of',
      'Desert of',
      'Arena of',
    ];
    const prefixName = allNames[Math.floor(Math.random() * allNames.length)];

    newDungeon.name = prefixName + ' ' + generateRandomString(5);

    // Chance to have a timer
    const timerChance = 0.5;

    if (Math.random() <= timerChance) {
      newDungeon.hasTimer = true;
      difficultyReasons.push({ reason: 'Has a timer', amount: 1 });

      let timer = 90;
      timer = timer - 5 * floorNumber;
      if (timer < 30) {
        timer = 30;
      }

      newDungeon.timePerQuestion = timer;

      let timerDifficulty = 0;
      if (timer >= 30 && timer < 45) {
        timerDifficulty += 3;
      } else if (timer >= 45 && timer < 60) {
        timerDifficulty += 2;
      } else if (timer >= 60 && timer < 75) {
        timerDifficulty += 1;
      }
      if (timerDifficulty > 0) {
        difficultyReasons.push({
          reason: 'Has a timer of a shorter length',
          amount: timerDifficulty,
        });
      }
    }

    // Number of questions
    let numberOfQuestions = 5;

    const incQuestionAttempts = Math.ceil(Math.random() * (10 + floorNumber));
    for (let i = 0; i < incQuestionAttempts; i++) {
      if (Math.random() < 0.45) {
        numberOfQuestions += 2;
      }
    }

    const questionsDifficultySteps = [8, 15, 20];
    questionsDifficultySteps.forEach((questionStep) => {
      if (numberOfQuestions >= questionStep) {
        difficultyReasons.push({
          reason: `Has a total of questions greater than ${questionStep}`,
          amount: 1,
        });
      }
    });

    newDungeon.numberOfQuestions = numberOfQuestions;

    let totalDifficulty: DifficultyReasonType = { reason: '', amount: 0 };
    if (difficultyReasons.length > 0) {
      totalDifficulty = difficultyReasons.reduce((acc, value) => {
        return { reason: '', amount: acc.amount + value.amount };
      });
    }

    newDungeon.difficulty =
      totalDifficulty.amount > 1 ? totalDifficulty.amount : 1;
    newDungeon.difficultyReasons = difficultyReasons;
    console.log(newDungeon);
    doors.push(newDungeon);
  }
  return doors;
};
