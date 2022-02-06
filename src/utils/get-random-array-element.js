import { shuffleArray } from './shuffle-array.js';

export const getRandomArrayElement = (elements) => {
  const shuffledElements = shuffleArray(elements);
  return shuffledElements[0];
};
