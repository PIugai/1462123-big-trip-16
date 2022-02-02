import { EditPointView } from '../view/edit-point-view.js';
import {
  removeElement,
  renderElement,
  RenderPosition,
} from '../utils/render.js';
import { UserActionType, ViewUpdateType } from '../const.js';

class AddPointPresenter {
  #pointsContainer = null;
  #pointEditListItem = null;
  #pointUpdateHandler = null;

  constructor(pointsContainer, pointUpdateHandler) {
    this.#pointsContainer = pointsContainer;
    this.#pointUpdateHandler = pointUpdateHandler;
  }

  init = () => {
    if (this.#pointEditListItem !== null) {
      return;
    }

    this.#pointEditListItem = new EditPointView();
    this.#pointEditListItem.setSaveClickHandler(this.#handleSaveClick);
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
  };

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleSaveClick = (point) => {
    this.#pointUpdateHandler(UserActionType.ADD_POINT, ViewUpdateType.MAJOR, {
      id: 0,
      ...point,
    });
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };
}

export { AddPointPresenter };
