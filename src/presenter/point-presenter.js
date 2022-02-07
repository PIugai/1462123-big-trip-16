import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {
  removeElement,
  renderElement,
  replaceElement
} from '../utils/render.js';
import {
  UserActionType,
  ViewUpdateType,
  Mode,
  State
} from '../const.js';

export default class PointPresenter {
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

    this.#pointEditListItem.setSaveButtonClickHandler(
      this.#handleSaveButtonClick
    );

    this.#pointEditListItem.setRollupButtonClickHandler(() => {
      this.#pointEditListItem.reset(this.#pointItem);
      this.#replaceFormToPoint();
    });

    this.#pointEditListItem.setDeleteButtonClickHandler(
      this.#handleDeleteClick
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
      replaceElement(this.#pointListItem, this.#previousPointEditListItem);
      this.#mode = Mode.DEFAULT;
    }

    removeElement(this.#previousPointListItem);
    removeElement(this.#previousPointEditListItem);

    this.#previousPointListItem = null;
    this.#previousPointEditListItem = null;
  };

  resetFormState = () => {
    this.#pointEditListItem.updateData({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

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
        this.#pointListItem.shake(this.resetFormState);
        this.#pointEditListItem.shake(this.resetFormState);
        break;
      default:
        throw new Error(`Invalid state value received ${state}`);
    }
  };

  #replacePointToForm = () => {
    replaceElement(this.#pointEditListItem, this.#pointListItem);
    document.addEventListener('keydown', this.#onEscapeKeyDownHandler);
    this.#modeUpdateHandler();
    this.#mode = Mode.EDIT;
  };

  #replaceFormToPoint = () => {
    replaceElement(this.#pointListItem, this.#pointEditListItem);
    document.removeEventListener('keydown', this.#onEscapeKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #onEscapeKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditListItem.reset(this.#pointItem);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDownHandler);
    }
  };

  #handleFavoriteButtonClick = () => {
    this.#pointUpdateHandler(
      UserActionType.UPDATE_POINT,
      ViewUpdateType.PATCH,
      { ...this.#pointItem, isFavorite: !this.#pointItem.isFavorite }
    );
  };

  #handleSaveButtonClick = (updatedPointItem) => {
    this.#pointUpdateHandler(
      UserActionType.UPDATE_POINT,
      ViewUpdateType.MINOR,
      updatedPointItem
    );
  };

  #handleDeleteClick = () => {
    this.#pointUpdateHandler(
      UserActionType.DELETE_POINT,
      ViewUpdateType.MINOR,
      this.#pointItem
    );
    document.removeEventListener('keydown', this.#onEscapeKeyDownHandler);
  };
}
