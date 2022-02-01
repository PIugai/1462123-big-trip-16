import { createElement } from '../render.js';

const createPointsListItemTemplate = (itemContent) =>
  `<li class="trip-events__item">
    ${itemContent}
  </li>`;

export class PointsListItemView {
  #element = null;
  #item = null;

  constructor(item) {
    this.#item = item;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createPointsListItemTemplate(this.#item);
  }

  removeElement() {
    this.#element = null;
  }
}
