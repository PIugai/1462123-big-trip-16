import { AbstractView } from './abstract-view';

const serviceErrorMessageTemplate = () =>
  '<p class="trip-events__msg">An error occurred while loading data from the server. Try to use our service later</p>';

export class ServiceErrorMessageView extends AbstractView {
  get template() {
    return serviceErrorMessageTemplate();
  }
}
