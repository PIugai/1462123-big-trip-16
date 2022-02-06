export const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

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

export const DEFAULT_SORT_TYPE = SortType.DAY_DESC;

export const DATE_RANGE_MINUTES_GAP_MIN = 1;

export const UserActionType = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const ViewUpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const ServiceLoadUpdateType = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const emptyPointsListMessageTypes = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

export const HeaderMenuItems = {
  TRIP_ROUTE: 'TRIP_ROUTE',
  STATISTICS: 'STATISTICS',
};

export const Mode = {
  DEFAULT: 'VIEW',
  EDIT: 'EDIT',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const DIFFERENT_MONTHS_DATE_FORMAT = 'D MMM';
export const EQUAL_MONTHS_DATE_FROM_FORMAT = 'MMM D';
export const EQUAL_MONTHS_DATE_TO_FORMAT = 'D';

export const DEFAULT_POINT_TYPE = 'taxi';

export const ChartSettings = {
  BAR_HEIGHT: 55,
  DATASETS_BACKGROUND_COLOR: '#ffffff',
  DATASETS_HOVER_BACKGROUND_COLOR: '#ffffff',
  DATALABELS_FONT_COLOR: '#000000',
  TITLE_FONT_COLOR: '#000000',
  TICKS_FONT_COLOR: '#000000',
};

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_VIEW_FORMAT = 'MMM D';
export const TIME_FORMAT = 'HH:mm';
