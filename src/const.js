export const pointTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const SortType = {
  DAY_DESC: 'day_desc',
  TIME_DESC: 'time_desc',
  PRICE_DESC: 'price_desc',
};

export const DEFAULT_SORT_TYPE = SortType.TIME_DESC;

export const UserActionType = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const ViewUpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  Past: 'past',
};

export const emptyPointsListMessageTypes = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.Past]: 'There are no past events',
  [FilterType.FUTURE]: 'There are no future events',
};

export const SiteMenuItems = {
  TRIP_ROUTE: 'TRIP_ROUTE',
  STATISTICS: 'STATISTICS',
};
