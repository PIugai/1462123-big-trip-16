import AbstractView from './abstract-view';

const loadingMessageTemplate = () =>
  '<p class="trip-events__msg">Loading... Please wait.</p>';

export default class LoadingMessageView extends AbstractView {
  get template() {
    return loadingMessageTemplate();
  }
}
