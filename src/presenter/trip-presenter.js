import { EmptyPointsListMessageView } from '../view/empty-points-list-message-view.js';
import { PointsListView } from '../view/points-list-view.js';
import { PointPresenter } from './point-presenter.js';
import { renderElement } from '../utils/render.js';
import { SortView } from '../view/sort-view.js';
import { updateArrayElement } from '../utils/update-array-element.js';
import { DEFAULT_SORT_TYPE, SortType } from '../const.js';
import { sortPointsByDateDesc, sortPointsByPriceDesc, sortPointsByTimeDesc } from '../utils/sort-points.js';
export class TripPresenter {
  #currentSortType = DEFAULT_SORT_TYPE;
  #tripRouteContainer = null;
  #tripPoints = [];

  #emptyPointsListMessage = new EmptyPointsListMessageView();
  #pointsList = new PointsListView();
  #sort = new SortView();
  #tripPointsPresenter = new Map();

  constructor(tripRouteContainer) {
    this.#tripRouteContainer = tripRouteContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = tripPoints;
    this.#sortPoints(this.#currentSortType);
    this.#renderTripRoute();
  };

  #clearTripPoints = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
  };

  #renderEmptyTripRoute = () =>
    renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);

  #renderTripRoute = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyTripRoute();
    } else {
      renderElement(this.#tripRouteContainer, this.#sort);
      this.#sort.setSortTypeChange(this.#handleSortChange);
      renderElement(this.#tripRouteContainer, this.#pointsList);
      this.#renderTripPoints();
    }
  };

  #renderTripPoints = () => {
    for (const point of this.#tripPoints) {
      this.#renderPoint(point);
    }
  };

  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(
      this.#pointsList,
      this.#handlePointUpdate,
      this.#handleModeUpdate
    );
    pointPresenter.init(pointItem);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  };

  #handleModeUpdate = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointUpdate = (updatedPoint) => {
    this.#tripPoints = updateArrayElement(this.#tripPoints, updatedPoint);
    this.#tripPointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearTripPoints();
    this.#renderTripPoints();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY_DESC:
        this.#tripPoints.sort(sortPointsByDateDesc);
        break;
      case SortType.TIME_DESC:
        this.#tripPoints.sort(sortPointsByTimeDesc);
        break;
      case SortType.PRICE_DESC:
        this.#tripPoints.sort(sortPointsByPriceDesc);
        break;
      default:
        this.#tripPoints.sort(sortPointsByDateDesc);
    }
    this.#currentSortType = sortType;
  };
}
