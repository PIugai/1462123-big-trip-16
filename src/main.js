import { EditPointView } from './view/edit-point-view.js';
import { EmptyPointsListMessageView } from './view/empty-points-list-message-view.js';
import { FiltersView } from './view/filters-view.js';
import { generatePoint } from './mocks/point.js';
import { SiteMenuView } from './view/site-menu-view.js';
import { PointsListView } from './view/points-list-view.js';
import { PointsListItemView } from './view/points-list-item-view.js';
import { PointView } from './view/point-view.js';
import { renderElement } from './render.js';
import { SortView } from './view/sort-view.js';

const POINTS_COUNT = 15;

const points = Array(POINTS_COUNT)
  .fill(null)
  .map((_, index) => generatePoint(index + 1));

const headerElement = document.querySelector('.page-header');
const tripControlsNavigationElement = headerElement.querySelector(
  '.trip-controls__navigation'
);
const tripControlsFiltersElement = headerElement.querySelector(
  '.trip-controls__filters'
);
const mainElement = document.querySelector('.page-main');
const tripEventsElement = mainElement.querySelector('.trip-events');

renderElement(tripControlsNavigationElement, new SiteMenuView().element);
renderElement(tripControlsFiltersElement, new FiltersView().element);

const renderPoint = (pointsList, pointItem) => {
  const point = new PointView(pointItem);
  const pointListItem = new PointsListItemView(point.template);
  const editPoint = new EditPointView(pointItem);
  const pointEditListItem = new PointsListItemView(editPoint.template);
  const replacePointToForm = () => {
    pointsList.replaceChild(pointEditListItem.element, pointListItem.element);
  };

  const replaceFormToPoint = () => {
    pointsList.replaceChild(pointListItem.element, pointEditListItem.element);
  };

  const onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    }
  };

  const removeEditPoint = () => {
    pointsList.removeChild(pointEditListItem.element);
  };

  pointListItem.element
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscapeKeyDown);
    });

  pointEditListItem.element
    .querySelector('.event__save-btn')
    .addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

  pointEditListItem.element
    .querySelector('.event__rollup-btn')
    .addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

  pointEditListItem.element
    .querySelector('.event__reset-btn')
    .addEventListener('click', () => {
      removeEditPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

  renderElement(pointsList, pointListItem.element);
};

if (!points.length) {
  renderElement(tripEventsElement, new EmptyPointsListMessageView().element);
} else {
  renderElement(tripEventsElement, new SortView().element);
  renderElement(tripEventsElement, new PointsListView().element);
  const eventsListElement =
    tripEventsElement.querySelector('.trip-events__list');
  for (const point of points) {
    renderPoint(eventsListElement, point);
  }
}
