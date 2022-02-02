import { AbstractObserver } from '../utils/abstract-observer.js';

export class PointsModel extends AbstractObserver {
  #points = [];

  set points(points) {
    this.#points = [...points];
  }

  get points() {
    return this.#points;
  }

  updatePoint = (updateType, updatedPoint) => {
    const updateElementIndex = this.#points.findIndex(
      (item) => item.id === updatedPoint.id
    );

    if (updateElementIndex === -1) {
      throw new Error('Unable to update a nonexistent point');
    }

    this.#points = [
      ...this.#points.slice(0, updateElementIndex),
      updatedPoint,
      ...this.#points.slice(updateElementIndex + 1),
    ];

    this._notify(updateType, updatedPoint);
  };

  addPoint = (updateType, addedPoint) => {
    if (addedPoint.id === 0) {
      addedPoint.id = this.#points.length;
    }

    this.#points = [addedPoint, ...this.#points];

    this._notify(updateType, addedPoint);
  };

  deletePoint = (updateType, deletedPoint) => {
    const index = this.#points.findIndex((task) => task.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Unable to delete a nonexistent point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
