import { FiltersView } from '../view/filters-view.js';
import {
  removeElement,
  renderElement,
  replaceElement,
} from '../utils/render.js';
import {
  FilterType,
  ViewUpdateType
} from '../const.js';

export class FiltersPresenter {
  #filterContainer = null;
  #filtersModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filtersModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(this.#filtersModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(
      this.#handleFilterTypeChange
    );

    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      renderElement(this.#filterContainer, this.#filterComponent);
      return;
    }

    replaceElement(this.#filterComponent, prevFilterComponent);
    removeElement(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(ViewUpdateType.MAJOR, filterType);
  };

  destroy = () => {
    removeElement(this.#filterContainer);
    this.#filterComponent = null;

    this.#filtersModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);

    this.#filtersModel.setFilter(ViewUpdateType.MINOR, FilterType.EVERYTHING);
  };
}
