import { AbstractView } from './abstract-view.js';

const createPointsListItemTemplate = (itemContent) =>
  `<li class="trip-events__item">
    ${itemContent}
  </li>`;

export class PointsListItemView extends AbstractView {
  #item = null;

  constructor(item) {
    super();
    this.#item = item;
  }

  get template() {
    return createPointsListItemTemplate(this.#item);
  }

  setSaveButtonClickHandler = (callback) => {
    this._callback.saveButtonClick = callback;
    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#saveButtonClickHandler);
  };

  #saveButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveButtonClick();
  };

  setRollupButtonClickHandler = (callback) => {
    this._callback.rollupButtonClick = callback;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupButtonClickHandler);
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.deleteButtonClick = callback;
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick();
  };
}
