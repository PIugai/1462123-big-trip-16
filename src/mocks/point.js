import { generateDestinationInfo } from './destination-info.js';
import { pointTypes } from '../const.js';
import { getRandomInteger } from '../utils/get-random-integer.js';
import { getRandomArrayElement } from '../utils/get-random-array-element.js';
import dayjs from 'dayjs';

export const cities = [
  'Amsterdam',
  'Bolsward',
  'Chamonix',
  'Assen',
  'Coevorden',
  'Emmen',
  'Tiel',
];

const PRICE_MIN = 1;
const PRICE_MAX = 1000;
const DAYS_GAP = 7;
const MINUTES_GAP_MIN = 10;
const MINUTES_GAP_MAX = 24 * 60 * DAYS_GAP;

const getOffersByType = (offers, type) => {
  const typeOffers = offers.find((offer) => offer.type === type);
  return (typeof typeOffers !== 'undefined') ? typeOffers.offers : null;
};

const generateType = () => getRandomArrayElement(pointTypes);

const generateDestination = () => getRandomArrayElement(cities);


const generatePrice = () => getRandomInteger(PRICE_MIN, PRICE_MAX);

const generateIsFavorite = () => Boolean(getRandomInteger(0, 1));

const generateDateFrom = () =>
  dayjs().add(getRandomInteger(-DAYS_GAP, DAYS_GAP), 'day').toDate();

const generateDateTo = (dateFrom, dateGapInMinutes) =>
  dayjs(dateFrom).add(dateGapInMinutes, 'minute').toDate();

export const generatePoint = (id, offers) => {
  const dateFrom = generateDateFrom();
  const type = generateType();
  return {
    id,
    type,
    destination: generateDestination(),
    offers: getOffersByType(offers, type),
    destinationInfo: generateDestinationInfo(),
    basePrice: generatePrice(),
    isFavorite: generateIsFavorite(),
    dateFrom,
    dateTo: generateDateTo(
      dateFrom,
      getRandomInteger(MINUTES_GAP_MIN, MINUTES_GAP_MAX,)
    ),
  };
};
