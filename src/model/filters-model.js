import { AbstractObserver } from '../utils/abstract-observer.js';
import { FilterType } from '../const.js';

export class FiltersModel extends AbstractObserver {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
