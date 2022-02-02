import { FiltersView } from './view/filters-view.js';
import { generatePoint } from './mocks/point.js';
import { SiteMenuView } from './view/site-menu-view.js';
import { offersByPointTypes } from "./mocks/offer.js";
import { renderElement } from './utils/render.js';
import { TripPresenter } from './presenter/trip-presenter.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT)
  .fill(null)
  .map((_, index) => generatePoint(index + 1, offersByPointTypes));

const headerElement = document.querySelector('.page-header');
const tripControlsNavigationElement = headerElement.querySelector(
  '.trip-controls__navigation'
);
const tripControlsFiltersElement = headerElement.querySelector(
  '.trip-controls__filters'
);
const mainElement = document.querySelector('.page-main');
const tripEventsElement = mainElement.querySelector('.trip-events');

renderElement(tripControlsNavigationElement, new SiteMenuView());
renderElement(tripControlsFiltersElement, new FiltersView());

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(points);
