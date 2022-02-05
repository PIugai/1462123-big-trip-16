import { EditPointView } from '../view/edit-point-view.js';
import { PointView } from '../view/point-view.js';
import { removeElement, renderElement, replaceElement } from '../utils/render.js';
import { UserActionType, ViewUpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'VIEW',
  EDIT: 'EDIT',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export class PointPresenter {
  #mode = Mode.DEFAULT;
  #modeUpdateHandler = null;
  #pointsContainer = null;
  #pointItem = null;
  #pointListItem = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;
  #previousPointListItem = null;
  #previousPointEditListItem = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor(
    pointsContainer,
    pointUpdateHandler,
    modeUpdateHandler,
    offersModel,
    destinationsModel
  ) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;
    this.#modeUpdateHandler = modeUpdateHandler;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init(pointItem) {
    this.#previousPointListItem = this.#pointListItem;
    this.#previousPointEditListItem = this.#pointEditListItem;

    this.#pointItem = pointItem;
    this.#pointListItem = new PointView(pointItem);
    this.#pointEditListItem = new EditPointView(
      pointItem,
      this.#offersModel,
      this.#destinationsModel
    );

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

    this.#pointEditListItem.setDeleteButtonClickHandler(
      this.#handleDeleteButtonClick
    );

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
    if (this.#mode === Mode.EDIT) {
      this.#pointEditListItem.reset(this.#pointItem);
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    removeElement(this.#pointListItem);
    removeElement(this.#pointEditListItem);
  };

  #reInit = () => {
    if (this.#mode === Mode.DEFAULT) {
      replaceElement(this.#pointListItem, this.#previousPointListItem);
    }
    if (this.#mode === Mode.EDIT) {
      replaceElement(this.#pointEditListItem, this.#previousPointEditListItem);
      this.#mode = Mode.DEFAULT;
    }

    removeElement(this.#previousPointListItem);
    removeElement(this.#previousPointEditListItem);

    this.#previousPointListItem = null;
    this.#previousPointEditListItem = null;
  };

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#pointEditListItem.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#pointEditListItem.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#pointEditListItem.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointEditListItem.updateData({
          isDisabled: false,
          isDeleting: false,
        });
        this.#pointListItem.shake(resetFormState);
        this.#pointEditListItem.shake(resetFormState);
        break;
      default:
        throw new Error(`Invalid state value received ${state}`);
    }
  };

  #replacePointToForm = () => {
    replaceElement(this.#pointEditListItem, this.#pointListItem);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
    this.#modeUpdateHandler();
    this.#mode = Mode.EDIT;
  };

  #replaceFormToPoint = () => {
    replaceElement(this.#pointListItem, this.#pointEditListItem);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
    this.#mode = Mode.DEFAULT;
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
      { ...this.#pointItem, isFavorite: !this.#pointItem.isFavorite }
    );
  };

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
  };
}
