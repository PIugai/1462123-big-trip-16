import { AddPointPresenter } from './add-point-presenter.js';
import { EmptyPointsListMessageView } from '../view/empty-points-list-message-view.js';
import {filter} from '../utils/filter.js';
import { PointsListView } from '../view/points-list-view.js';
import {
  PointPresenter,
} from './point-presenter.js';
import {
  removeElement,
  renderElement,
} from '../utils/render.js';
import { SortView } from '../view/sort-view.js';
import {
  DEFAULT_SORT_TYPE,
  emptyPointsListMessageTypes,
  FilterType,
  SortType,
  State as PointPresenterViewState,
  UserActionType,
  ViewUpdateType,
  RenderPosition
} from '../const.js';
import {
  sortPointsByDateDesc,
  sortPointsByPriceDesc,
  sortPointsByTimeDesc
} from '../utils/sort-points.js';
import { TripInfoView } from '../view/trip-info-view.js';

export default class TripRoutePresenter {
  #addPointPresenter = null;
  #addPointElement = null;
  #currentSortType = DEFAULT_SORT_TYPE;
  #destinationsModel = null;
  #filtersModel = null;
  #filterType = FilterType.EVERYTHING;
  #offersModel = null;
  #pointsModel = null;
  #tripRouteContainer = null;
  #tripSummaryContainer = null;

  #emptyPointsListMessage = null;
  #pointsList = new PointsListView();
  #sort = null;
  #tripPointsPresenter = new Map();
  #tripInfo = null;

  constructor(tripRouteContainer, tripSummaryContainer, pointsModel, filtersModel, offersModel, destinationsModel) {
    this.#tripRouteContainer = tripRouteContainer;
    this.#tripSummaryContainer = tripSummaryContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY_DESC:
        filteredPoints.sort(sortPointsByDateDesc);
        break;
      case SortType.TIME_DESC:
        filteredPoints.sort(sortPointsByTimeDesc);
        break;
      case SortType.PRICE_DESC:
        filteredPoints.sort(sortPointsByPriceDesc);
        break;
      default:
        filteredPoints.sort(sortPointsByDateDesc);
    }
    return filteredPoints;
  }

  init = () => {
    this.#addPointPresenter = new AddPointPresenter(this.#pointsList, this.#handleViewAction, this.#offersModel, this.#destinationsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#renderTripRoute();
    this.#renderTripPointsContainer();
    this.#renderTripInfo();
  }

  destroy = () => {
    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);

    this.#clearTripRoute(true);
    this.#clearTripPointsContainer();
    this.#clearTripInfo();
  }

  #renderTripInfo = () => {
    if (this.#pointsModel.points.length) {
      this.#tripInfo = new TripInfoView(this.#pointsModel.getPointsSummaryInfo());
      renderElement(this.#tripSummaryContainer, this.#tripInfo, RenderPosition.AFTERBEGIN);
    }
  }

  #clearTripInfo = () => {
    removeElement(this.#tripInfo);
  }

  #renderTripRoute = () => {
    if (!this.points.length) {
      this.#renderEmptyTripRoute();
    } else {
      this.#clearEmptyTripRoute();
      this.#renderSort();
      this.#renderTripPoints();
    }
  }

  #clearTripRoute = (resetSortType = false) => {
    if (this.#addPointPresenter) {
      this.#addPointPresenter.destroy();
    }

    this.#clearTripPoints();
    this.#clearSort();
    this.#clearEmptyTripRoute();

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderEmptyTripRoute = () => {
    this.#emptyPointsListMessage = new EmptyPointsListMessageView(emptyPointsListMessageTypes[this.#filtersModel.filter]);
    renderElement(this.#tripRouteContainer, this.#emptyPointsListMessage);
  }

  #clearEmptyTripRoute = () => {
    if (this.#emptyPointsListMessage) {
      removeElement(this.#emptyPointsListMessage);
    }
  }

  #renderSort = () => {
    this.#sort = new SortView(this.#currentSortType);
    renderElement(this.#tripRouteContainer, this.#sort, RenderPosition.AFTERBEGIN);
    this.#sort.setSortTypeChange(this.#handleSortChange);
  }

  #clearSort = () => {
    removeElement(this.#sort);
  }

  #renderTripPointsContainer = () => renderElement(this.#tripRouteContainer, this.#pointsList);

  #renderTripPoints = () => {
    for (const point of this.points) {
      this.#renderPoint(point);
    }
  }

  #clearTripPointsContainer = () => removeElement(this.#pointsList);

  #clearTripPoints = () => this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());

  #renderPoint = (pointItem) => {
    const pointPresenter = new PointPresenter(
      this.#pointsList,
      this.#handleViewAction,
      this.#handleModeUpdate,
      this.#offersModel,
      this.#destinationsModel
    );
    pointPresenter.init(pointItem);
    this.#tripPointsPresenter.set(pointItem.id, pointPresenter);
  }

  #handleModeUpdate = () => {
    this.#addPointPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (userActionType, viewUpdateType, updatePoint) => {
    switch (userActionType) {
      case UserActionType.ADD_POINT:
        this.#addPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#addPointPresenter.setAborting();
        }
        break;
      case UserActionType.UPDATE_POINT:
        this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserActionType.DELETE_POINT:
        this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(viewUpdateType, updatePoint);
        } catch (err) {
          this.#tripPointsPresenter.get(updatePoint.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      default:
        throw new Error(`Invalid userActionType value received ${userActionType}`);
    }
  }

  #handleModelEvent = (viewUpdateType, updatedData) => {
    switch (viewUpdateType) {
      case ViewUpdateType.PATCH:
        this.#tripPointsPresenter.get(updatedData.id).init(updatedData);
        this.#clearTripInfo();

        this.#renderTripInfo();
        break;
      case ViewUpdateType.MINOR:
        this.#clearTripRoute();
        this.#clearTripInfo();

        this.#renderTripRoute();
        this.#renderTripInfo();
        break;
      case ViewUpdateType.MAJOR:
        this.#clearTripRoute(true);
        this.#clearTripInfo();

        this.#renderTripRoute();
        this.#renderTripInfo();
        break;
      default:
        throw new Error(`Invalid viewUpdateType value received ${viewUpdateType}`);
    }
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearSort();
    this.#renderSort();

    this.#clearTripPoints();
    this.#renderTripPoints();
  }

  addPoint(addPointElement) {
    this.#addPointElement = addPointElement;

    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filtersModel.setFilter(ViewUpdateType.MAJOR, FilterType.EVERYTHING);

    this.#addPointElementDisable();
    if (!this.points.length) {
      this.#clearEmptyTripRoute();
    }

    this.#addPointPresenter.init(this.addPointDestroyHandler);
  }

  addPointDestroyHandler = () => {
    if (!this.points.length) {
      this.#renderEmptyTripRoute();
    }
    this.#addPointElementEnable();
  }

  #addPointElementDisable = () => {
    this.#addPointElement.disabled = true;
  }

  #addPointElementEnable = () => {
    this.#addPointElement.disabled = false;
  }
}
