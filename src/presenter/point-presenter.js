import { EditPointView } from '../view/edit-point-view.js';
import { PointView } from '../view/point-view.js';
import { removeElement, renderElement, replaceElement } from '../utils/render.js';
import { UserActionType, ViewUpdateType } from '../utils/render.js';

const MODE = {
  DEFAULT: 'VIEW',
  EDIT: 'EDIT',
};

export class PointPresenter {
  #mode = MODE.DEFAULT;
  #modeUpdateHandler = null;
  #pointsContainer = null;
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
    this.#pointListItem = new PointView(pointItem);
    this.#pointEditListItem = new EditPointView(pointItem);

    this.#pointListItem.setRollupButtonClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#pointListItem.setFavoriteButtonClickHandler(
      this.#handleFavoriteButtonClick
    );

    this.#pointEditListItem.setSaveButtonClickHandler((updatedPointItem) => {
      this.#pointUpdateHandler(
        UserActionType.UPDATE_POINT,
        ViewUpdateType.MINOR,
        updatedPointItem
      );
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setRollupButtonClickHandler(() => {
      this.#pointEditListItem.reset(this.#pointItem);
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);

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
      this.#pointEditListItem.reset(this.#pointItem);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  #handleFavoriteButtonClick = () => {
    this.#handleFavoriteButtonClick(
      UserActionType.UPDATE_POINT,
      ViewUpdateType.PATCH,
      {...this.#pointItem, isFavorite: !this.#pointItem.isFavorite}
    );
  }

  #removeEditPoint = () => {
    removeElement(this.#pointEditListItem);
  };

  #handleDeleteButtonClick = () => {
    this.#removeEditPoint();
    this.#pointUpdateHandler(
      UserActionType.DELETE_POINT,
      ViewUpdateType.MINOR,
      this.#pointItem
    );
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }
}
