import { shuffleArray } from './shuffle-array.js';

const getRandomArrayElement = (elements) => {
  const shuffledElemens = shuffleArray(elements);
  return shuffledElemens[0];
};

export { getRandomArrayElement };
