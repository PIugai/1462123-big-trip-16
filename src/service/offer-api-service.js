import ApiService from './api-service.js';

export default class OfferApiService extends ApiService {
  get offers() {
    return this.load({url: 'offers'})
      .then(ApiService.parseResponse);
  }
}
