import { AbstractView } from './abstract-view';

const loadingMessageTemplate = () =>
  '<p class="trip-events__msg">Loading... Please wait.</p>';

export class LoadingMessageView extends AbstractView {
  get template() {
    return loadingMessageTemplate();
  }
}
