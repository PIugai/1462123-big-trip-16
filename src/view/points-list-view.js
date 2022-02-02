import { AbstractView } from './abstract-view.js';

export const createPointsListTemplate = (pointsListClass) =>
  `<ul class="${pointsListClass}">
  </ul>`;

export class PointsListView extends AbstractView {
  #POINTS_LIST_CLASS = 'trip-events__list';
  get template() {
    return createPointsListTemplate(this.pointsListClass());
  }

  pointsListClass() {
    return this.#POINTS_LIST_CLASS;
  }

  get pointsListSelector() {
    return `.${this.pointsListClass()}`;
  }
}
