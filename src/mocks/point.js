import { generateOffers } from './offer.js';
import { shuffleArray } from '../utils/shuffle-array.js';
import { getRandomInteger } from '../utils/get-random-integer.js';
import { getRandomArrayElement } from '../utils/get-random-array-element.js';
import dayjs from 'dayjs';

const types = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const cities = [
  'Amsterdam',
  'Bolsward',
  'Chamonix',
  'Assen',
  'Coevorden',
  'Emmen',
  'Tiel',
];

const DESCRIPTIONS_COUNT_MIN = 1;
const DESCRIPTIONS_COUNT_MAX = 5;
const DESTINATION_PHOTOS_COUNT_MIN = 1;
const DESTINATION_PHOTOS_COUNT_MAX = 5;
const PHOTOS_URL_TEMPLATE = 'http://picsum.photos/248/152?r=';
const PRICE_MIN = 1;
const PRICE_MAX = 1000;
const DAYS_GAP = 7;
const MINUTES_GAP_MIN = 10;
const MINUTES_GAP_MAX = 24 * 60 * DAYS_GAP;

const generateType = () => getRandomArrayElement(types);

const generateDestination = () => getRandomArrayElement(cities);

const getDescriptions = () => {
  const DESCRIPTION =
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Necessitatibus tempora cum placeat dolorum molestias, aliquid iusto aliquam quod consequuntur. Esse, eos aliquam animi amet doloremque quos odio inventore optio voluptate. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates id sed dolor corrupti ipsam, corporis recusandae reprehenderit, sequi voluptatibus et, aut quas! Accusantium id sit facilis, cum blanditiis odit perspiciatis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor amet consequatur nemo quis omnis eum a, hic unde excepturi cupiditate, beatae assumenda cum? Vel inventore aut excepturi aliquid! Autem, eos?';
  const descriptions = DESCRIPTION.split('.');
  return descriptions.filter((item) => item.length).map((item) => item.trim());
};

const descriptionsList = getDescriptions();

const generateDescription = () => {
  const shuffledDescriptions = shuffleArray(descriptionsList);
  const description = shuffledDescriptions
    .slice(0, getRandomInteger(DESCRIPTIONS_COUNT_MIN, DESCRIPTIONS_COUNT_MAX))
    .join('. ');
  return `${description}.`;
};

const getPicture = () => {
  const shuffledDescriptions = shuffleArray(descriptionsList);
  return {
    src: PHOTOS_URL_TEMPLATE + Math.random(),
    description: shuffledDescriptions[0],
  };
};

const generateDestinationPhotos = () =>
  Array(
    getRandomInteger(DESTINATION_PHOTOS_COUNT_MIN, DESTINATION_PHOTOS_COUNT_MAX)
  )
    .fill(null)
    .map(() => getPicture());

const generateDestinationInfo = () => {
  if (!getRandomInteger(0, 1)) {
    return null;
  }

  return {
    description: generateDescription(),
    pictures: generateDestinationPhotos(),
  };
};

const generatePrice = () => getRandomInteger(PRICE_MIN, PRICE_MAX);

const generateIsFavorite = () => Boolean(getRandomInteger(0, 1));

const generateDateFrom = () =>
  dayjs().add(getRandomInteger(-DAYS_GAP, DAYS_GAP), 'day').toDate();

const generateDateTo = (dateFrom, dateGapInMinutes) =>
  dayjs(dateFrom).add(dateGapInMinutes, 'minute').toDate();

const generatePoint = (id) => {
  const dateFrom = generateDateFrom();
  const dateGapInMinutes = getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX);
  return {
    id,
    type: generateType(),
    destination: generateDestination(),
    offers: generateOffers(),
    destinationInfo: generateDestinationInfo(),
    basePrice: generatePrice(),
    isFavorite: generateIsFavorite(),
    dateFrom,
    dateTo: generateDateTo(
      dateFrom,
      getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX)
    ),
    dateGapInMinutes,
  };
};

export { generatePoint };
