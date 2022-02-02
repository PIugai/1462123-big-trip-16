import { EditPointView } from '../view/edit-point-view.js';
import { PointView } from '../view/point-view.js';
import { PointsListItemView } from '../view/points-list-item-view.js';
import { removeElement, renderElement, replaceElement } from '../utils/render.js';

const MODE = {
  DEFAULT: 'VIEW',
  EDIT: 'EDIT',
};

export class PointPresenter {
  #editPoint = null;
  #mode = MODE.DEFAULT;
  #modeUpdateHandler = null;
  #pointsContainer = null;
  #point = null;
  #pointItem = null;
  #pointListItem = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;
  #previousPointListItem = null;
  #previousPointEditListItem = null;

  constructor(pointsContainer, pointUpdateHandler, modeUpdateHandler) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;
    this.#modeUpdateHandler = modeUpdateHandler;
  }

  init(pointItem) {
    this.#previousPointListItem = this.#pointListItem;
    this.#previousPointEditListItem = this.#pointEditListItem;

    this.#pointItem = pointItem;
    this.#point = new PointView(pointItem);
    this.#pointListItem = new PointsListItemView(this.#point.template);
    this.#editPoint = new EditPointView(pointItem);
    this.#pointEditListItem = new PointsListItemView(this.#editPoint.template);

    this.#pointListItem.setRollupButtonClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#pointListItem.setFavoriteButtonClickHandler(
      this.#handleFavoriteButtonClick
    );

    this.#pointEditListItem.setSaveButtonClickHandler(() => {
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setRollupButtonClickHandler(() => {
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setDeleteButtonClickHandler(() => {
      this.#removeEditPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    if (
      this.#previousPointListItem === null ||
      this.#previousPointEditListItem === null
    ) {
      renderElement(this.#pointsContainer, this.#pointListItem);
      return;
    }
    this.#reInit();
  }

  resetView = () => {
    if (this.#mode === MODE.EDIT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    removeElement(this.#pointListItem);
    removeElement(this.#pointEditListItem);
  };

  #reInit = () => {
    if (this.#mode === MODE.DEFAULT) {
      replaceElement(this.#pointListItem, this.#previousPointListItem);
    }
    if (this.#mode === MODE.EDIT) {
      replaceElement(this.#pointEditListItem, this.#previousPointEditListItem);
    }

    removeElement(this.#previousPointListItem);
    removeElement(this.#previousPointEditListItem);

    this.#previousPointListItem = null;
    this.#previousPointEditListItem = null;
  };

  #replacePointToForm = () => {
    replaceElement(this.#pointEditListItem, this.#pointListItem);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
    this.#modeUpdateHandler();
    this.#mode = MODE.EDIT;
  };

  #replaceFormToPoint = () => {
    replaceElement(this.#pointListItem, this.#pointEditListItem);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
    this.#mode = MODE.DEFAULT;
  };

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  #removeEditPoint = () => {
    removeElement(this.#pointEditListItem);
  };

  #handleFavoriteButtonClick = () => {
    this.#pointUpdateHandler({
      ...this.#pointItem,
      isFavorite: !this.#pointItem.isFavorite,
    });
  };
}
