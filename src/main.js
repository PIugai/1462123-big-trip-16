import { FiltersModel } from './model/filters-model.js';
import { FiltersPresenter } from './presenter/filters-presenter.js';
import { generatePoint } from './mocks/point.js';
import { SiteMenuView } from './view/site-menu-view.js';
import { SiteMenuItems } from './const.js';
import { offersByPointTypes } from './mocks/offer.js';
import { PointsModel } from './model/points-model.js';
import { renderElement } from './utils/render.js';
import { TripPresenter } from './presenter/trip-presenter.js';
import { Statistics } from './view/statistics.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT)
  .fill(null)
  .map((_, index) => generatePoint(index + 1, offersByPointTypes));
const pointsModel = new PointsModel();
pointsModel.points = points;

const filtersModel = new FiltersModel();

const headerElement = document.querySelector('.page-header');
const tripControlsNavigationElement = headerElement.querySelector(
  '.trip-controls__navigation',
);
const tripControlsFiltersElement = headerElement.querySelector(
  '.trip-controls__filters',
);
const mainElement = document.querySelector('.page-main');
const bodyContainerElement = mainElement.querySelector('.page-body__container');
const tripEventsElement = mainElement.querySelector('.trip-events');

const tripRouteContainer = new TripPresenter(eventContainer, pointsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(
  tripControlsFiltersElement,
  filtersModel,
  pointsModel
);

renderElement(tripControlsNavigationElement, new SiteMenuView());
renderElement(tripControlsFiltersElement, new FiltersView());

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(points);
