import { EmptyPointsListMessageView } from '../view/empty-points-list-message-view.js';
import { PointsListView } from '../view/points-list-view.js';
import { PointPresenter } from './point-presenter.js';
import { renderElement } from '../utils/render.js';
import { SortView } from '../view/sort-view.js';
import { updateArrayElement } from '../utils/update-array-element.js';

export class TripPresenter {
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

    this.#renderTripRoute();
  };

  #renderEmptyTripRoute = () =>
    renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);

  #renderTripRoute = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyTripRoute();
    } else {
      renderElement(this.#tripRouteContainer, this.#sort);
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
}
