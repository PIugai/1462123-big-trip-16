import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const formatNumberInTwoDigits = (number) =>
  number > 9 ? number : `0${number}`;

export const getDuration = (dateFrom, dateTo) =>
  dayjs(dateTo).diff(dayjs(dateFrom), 'milliseconds');

export const getFormattedDuration = (diffInMilliseconds) => {
  const datesDiffDuration = dayjs.duration(diffInMilliseconds);
  const formattedDiff = [];
  if (datesDiffDuration.days() > 0) {
    formattedDiff.push(`${formatNumberInTwoDigits(datesDiffDuration.days())}D`);
    formattedDiff.push(
      `${formatNumberInTwoDigits(datesDiffDuration.hours())}H`,
    );
  } else if (datesDiffDuration.hours() > 0) {
    formattedDiff.push(
      `${formatNumberInTwoDigits(datesDiffDuration.hours())}H`,
    );
  }
  formattedDiff.push(
    `${formatNumberInTwoDigits(datesDiffDuration.minutes())}M`,
  );

  return formattedDiff.join(' ');
};

export const getFormattedDatesDiff = (dateFrom, dateTo) =>
  getFormattedDuration(getDuration(dateFrom, dateTo));
