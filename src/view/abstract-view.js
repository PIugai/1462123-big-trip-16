import { createElement } from '../utils/render.js';

export class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Failed to instantiate the Abstract class');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error(
      'Get template method has not been implemented in the abstract class'
    );
  }

  removeElement() {
    this.#element = null;
  }
}
