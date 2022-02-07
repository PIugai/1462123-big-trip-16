import { AbstractView } from './abstract-view.js';

export default class SmartView extends AbstractView {
  _data = {};

  updateData = (update, isJustDataUpdating = false) => {
    if (!update) {
      return;
    }

    this._data = { ...this._data, ...update };

    if (isJustDataUpdating) {
      return;
    }

    this.updateElement();
  };

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  };

  restoreHandlers = () => {
    throw new Error(
      'restoreHandlers method has not been implemented in the Abstract class'
    );
  };
}
