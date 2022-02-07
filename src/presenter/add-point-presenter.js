import dayjs from 'dayjs';
import {
  DATE_RANGE_MINUTES_GAP_MIN,
  UserActionType,
  ViewUpdateType,
  DEFAULT_POINT_TYPE,
  RenderPosition,
} from '../const.js';
import { EditPointView } from '../view/edit-point-view.js';
import {
  removeElement,
  renderElement,
} from '../utils/render.js';

const BLANK_POINT = {
  id: 0,
  type: DEFAULT_POINT_TYPE,
  destination: null,
  offers: null,
  destinationInfo: null,
  basePrice: 1,
  dateFrom: dayjs(),
  dateTo: dayjs().add(DATE_RANGE_MINUTES_GAP_MIN, 'minute'),
  isFavorite: false,
};

export default class AddPointPresenter {
  #pointsContainer = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;

  #offersModel = null;
  #onDestroyHandler = null;
  #destinations = null;
  #destinationsModel = null;

  constructor(
    pointsContainer,
    pointUpdateHandler,
    offersModel,
    destinationsModel
  ) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#destinations = this.#destinationsModel.destinations;
  }

  #getBlankPoint = () => {
    if (!this.#destinations) {
      return BLANK_POINT;
    }
    const firstDestination = this.#destinations[0];
    return {
      ...BLANK_POINT,
      destination: firstDestination.name,
      destinationInfo: {
        description: firstDestination.description,
        pictures: firstDestination.pictures,
      },
    };
  };

  init = (onDestroyHandler) => {
    if (this.#pointEditListItem !== null) {
      return;
    }

    this.#onDestroyHandler = onDestroyHandler;
    this.#pointEditListItem = new EditPointView(
      this.#getBlankPoint(),
      this.#offersModel,
      this.#destinationsModel
    );
    this.#pointEditListItem.setSaveButtonClickHandler(this.#handleSaveButtonClick);
    this.#pointEditListItem.setCancelClickHandler(this.#handleCancelClick);

    renderElement(
      this.#pointsContainer,
      this.#pointEditListItem,
      RenderPosition.AFTERBEGIN
    );
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  destroy = () => {
    if (this.#pointEditListItem === null) {
      return;
    }

    removeElement(this.#pointEditListItem);
    this.#pointEditListItem = null;
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
    this.#onDestroyHandler();
  };

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving = () => {
    this.#pointEditListItem.updateData({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditListItem.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditListItem.shake(resetFormState);
  };

  #handleSaveButtonClick = (point) => {
    this.#pointUpdateHandler(UserActionType.ADD_POINT, ViewUpdateType.MAJOR, {
      id: 0,
      ...point,
    });
  };

  #handleCancelClick = () => {
    this.destroy();
  };
}
