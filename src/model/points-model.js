import { AbstractObservable } from '../utils/abstract-observable.js';
import dayjs from 'dayjs';
import { FilterType, ViewUpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import { sortPointsByDateDesc } from '../utils/sort-points.js';

const DIFFERENT_MONTHS_DATE_FORMAT = 'D MMM';
const EQUAL_MONTHS_DATE_FROM_FORMAT = 'MMM D';
const EQUAL_MONTHS_DATE_TO_FORMAT = 'D';
export class PointsModel extends AbstractObservable {
  #apiService = null
  #points = [];
  #pointsSortedByDataDesc = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = points.map((point, index) => this.#adaptToClient(point, index));
    } catch (error) {
      this.#points = [];
    }
    this._notify(ViewUpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  updatePoint = async (updateType, updatedPoint) => {
    const updateElementIndex = this.#points.findIndex(
      (item) => item.id === updatedPoint.id
    );

    if (updateElementIndex === -1) {
      throw new Error('Unable to update a nonexistent point');
    }
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const updatedPointFromServer = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, updateElementIndex),
        updatedPoint,
        ...this.#points.slice(updateElementIndex + 1),
      ];

      this._notify(updateType, updatedPointFromServer);
    } catch (error) {
      throw new Error('Unable to update point');
    }
  };

  addPoint = async (updateType, addedPoint) => {
    try {
      const response = await this.#apiService.addPoint(addedPoint);
      const addedPointFromServer = this.#adaptToClient(response);

      this.#points = [addedPointFromServer, ...this.#points];
      this._notify(updateType, addedPoint);

    } catch (error) {
      throw new Error('Unable to add point');
    }
  };

  deletePoint = async (updateType, deletedPoint) => {
    const index = this.#points.findIndex((task) => task.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Unable to delete a nonexistent point');
    }

    try {
      await this.#apiService.deletePoint(deletedPoint);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (error) {
      throw new Error('Unable to delete point');
    }
  };

  #adaptToClient = (point) => {
    let destinationInfo = {};
    if (point['destination']['description'] !== null) {
      destinationInfo.description = point['destination']['description'];
    }
    if (point['destination']['name'] !== null) {
      destinationInfo.name = point['destination']['name'];
    }
    if (!Object.keys(destinationInfo).length) {
      destinationInfo = null;
    }

    const adaptedPoint = {
      ...point,
      id: Number(point['id']) + 1,
      backendId: point['id'],
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
      destinationInfo,
      destination: point['destination']['name'],
    };

    delete adaptedPoint['best_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  getPointsSummaryInfo = () => {
    if (!this.points.length) {
      return {
        title: '',
        dates: '',
        cost: '',
      };
    }

    this.#pointsSortedByDataDesc = this.#points.sort(sortPointsByDateDesc);
    return {
      title: this.getPointsSummaryTitle(),
      dates: this.getPointsSummaryDates(),
      cost: this.getPointsSummaryCost(),
    };
  };

  getPointsSummaryTitle = () => {
    const pointsNumber = this.#pointsSortedByDataDesc.length;
    let summaryTitle = '';
    if (pointsNumber === 1) {
      summaryTitle = this.#pointsSortedByDataDesc[0].destination;
    } else if (pointsNumber < 4) {
      const summaryPointTitle = [];
      this.#pointsSortedByDataDesc.forEach((point) => (summaryPointTitle.push(point.destination)));
      summaryTitle = summaryPointTitle.join(' —');
    } else {
      summaryTitle = `${this.#pointsSortedByDataDesc[0].destination} — ... — ${this.#pointsSortedByDataDesc[pointsNumber - 1].destination}`;
    }
    return summaryTitle;
  };

  getPointsSummaryDates = () => {
    const pointsNumber = this.#pointsSortedByDataDesc.length;
    const dateFrom = this.#pointsSortedByDataDesc[0].dateFrom;
    if (pointsNumber === 1) {
      return dayjs(dateFrom).format(DIFFERENT_MONTHS_DATE_FORMAT);
    }

    let summaryDates = '';
    const dateTo = this.#pointsSortedByDataDesc[pointsNumber - 1].dateTo;

    if (dayjs(dateFrom).month() === dayjs(dateTo).month()) {
      summaryDates = `${dayjs(dateFrom).format(
        EQUAL_MONTHS_DATE_FROM_FORMAT
      )} — ${dayjs(dateTo).format(EQUAL_MONTHS_DATE_TO_FORMAT)}`;
    } else {
      summaryDates = `${dayjs(dateFrom).format(DIFFERENT_MONTHS_DATE_FORMAT)} — ${dayjs(dateTo).format(DIFFERENT_MONTHS_DATE_FORMAT)}`;
    }

    return summaryDates;
  }

  getPointsSummaryCost = () => (
    this.#points.reduce((summaryCost, point) => {
      let offersCost = 0;
      if (point.offers.length) {
        offersCost = point.offers.reduce(
          (summaryOffersCost, offer) => summaryOffersCost + offer.price,
          0
        );
      }
      return summaryCost + point.basePrice + offersCost;
    }, 0)
  );

  getFilteredPointsCountInfo = () => ({
    [FilterType.EVERYTHING]: this.#points.length,
    [FilterType.PAST]: filter[FilterType.PAST](this.#points).length,
  });
}
