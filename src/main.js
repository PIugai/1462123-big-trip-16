import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createFiltersTemplate } from './view/filters-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createPointsListTemplate } from './view/points-list-view.js';
import { createPointEditTemplate } from './view/point-edit-view.js';
import { createPointsItemTemplate } from './view/points-item-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { generatePoint } from './mocks/point.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT)
  .fill(null)
  .map((_, index) => generatePoint(index + 1));

const tripControlsElement = document.querySelector('.trip-controls');
const tripControlsNavigationElement = tripControlsElement.querySelector('.trip-controls__navigation');

renderTemplate( tripControlsNavigationElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);

const tripControlsFiltersElement = tripControlsElement.querySelector('.trip-controls__filters');

renderTemplate( tripControlsFiltersElement, createFiltersTemplate(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector('.trip-events');

renderTemplate( tripEventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate( tripEventsElement, createPointsListTemplate(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

renderTemplate(
  tripEventsListElement,
  createPointEditTemplate(points[0]),
  RenderPosition.BEFOREEND
);

for (let i = 1; i < POINTS_COUNT; i++) {
  renderTemplate( tripEventsListElement, createPointsItemTemplate(points[i]), RenderPosition.BEFOREEND);
}
