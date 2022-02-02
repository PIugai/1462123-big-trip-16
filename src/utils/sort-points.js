import dayjs from 'dayjs';

export const sortPointsByDateDesc = (pointA, pointB) => dayjs(pointA, pointB).diff(dayjs(pointB.dateFrom));

export const sortPointsByPriceDesc = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortPointsByTimeDesc = (pointA, pointB) => {
  const pointADiffInMinutes = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom), 'minute');
  const pointBDiffInMinutes = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom), 'minute');
  return pointBDiffInMinutes - pointADiffInMinutes;
};
