import { shuffleArray } from './shuffle-array.js';

const getRandomArrayElement = (elements) => {
  const shuffledElements = shuffleArray(elements);
  return shuffledElements[0];
};

export { getRandomArrayElement };
