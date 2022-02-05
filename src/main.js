import {
  API_AUTHORIZATION,
  API_END_POINT
} from './config.js';
import { DestinationsModel } from './model/destinations-model.js';
import { DestinationApiService } from './service/destination-api-service.js';
import { FiltersModel } from './model/filters-model.js';
import { FiltersPresenter } from './presenter/filters-presenter.js';
import {
  SiteMenuItems,
  ServiceLoadUpdateType
} from './const.js';
import { LoadingMessageView } from './view/loading-message-view.js';
import { OfferApiService } from './service/offer-api-service.js';
import { OffersModel } from './model/offers-model.js';
import { PointApiService } from './service/point-api-service.js';
import { PointsModel } from './model/points-model.js';
import {
  renderElement,
  removeElement,
  RenderPosition,
} from './utils/render.js';
import { ServiceErrorMessageView } from './view/service-error-message-view.js';
import { SiteMenuView } from './view/site-menu-view.js';
import { StatisticsView } from './view/statistics-view.js';
import { TripPresenter } from './presenter/trip-presenter.js';
import { TripInfoView } from './view/trip-info-view.js';

const headerElement = document.querySelector('.page-header');
const tripControlsNavigationElement = headerElement.querySelector(
  '.trip-controls__navigation',
);
const tripControlsFiltersElement = headerElement.querySelector(
  '.trip-controls__filters',
);
const tripInfoContainerElement = headerElement.querySelector('.trip-main');
const mainElement = document.querySelector('.page-main');
const bodyContainerElement = mainElement.querySelector('.page-body__container');
const tripEventsElement = mainElement.querySelector('.trip-events');
const eventAddButtonElement = document.querySelector(
  '.trip-main__event-add-btn'
);

const lockHeader = () => {
  headerElement.querySelectorAll('a, input, button').forEach((element) => {
    element.disabled = true;
  });
};

const unlockHeader = () => {
  headerElement.querySelectorAll('a, input, button').forEach((element) => {
    element.disabled = false;
  });
};

const criticalServices = [];
let loadedCriticalServicesCount = 0;

const pointsModel = new PointsModel(
  new PointApiService(API_END_POINT, API_AUTHORIZATION)
);
const filtersModel = new FiltersModel();
const offersModel = new OffersModel(
  new OfferApiService(API_END_POINT, API_AUTHORIZATION)
);
offersModel.addObserver(handleCriticalServiceLoadState);
criticalServices.push('offersModel');
const destinationsModel = new DestinationsModel(
  new DestinationApiService(API_END_POINT, API_AUTHORIZATION)
);
destinationsModel.addObserver(handleCriticalServiceLoadState);
criticalServices.push('destinationsModel');

const tripRoutePresenter = new TripPresenter(
  tripEventsElement,
  tripInfoContainerElement,
  pointsModel,
  filtersModel,
  offersModel,
  destinationsModel
);
const filtersPresenter = new FiltersPresenter(
  tripControlsFiltersElement,
  filtersModel,
  pointsModel
);
const headerMenuComponent = new SiteMenuView();

let statisticsComponent = null;
let tripInfoComponent = null;

const handleHeaderMenuClick = (headerMenuItem) => {
  switch (headerMenuItem) {
    case SiteMenuItems.TRIP_ROUTE:
      tripRoutePresenter.destroy();
      tripRoutePresenter.init();
      filtersPresenter.destroy();
      filtersPresenter.init();
      removeElement(statisticsComponent);
      removeElement(tripInfoComponent);
      break;
    case SiteMenuItems.STATISTICS:
      filtersPresenter.destroy();
      tripRoutePresenter.destroy();
      tripInfoComponent = new TripInfoView(pointsModel.getPointsSummaryInfo());
      renderElement(
        tripInfoContainerElement,
        tripInfoComponent,
        RenderPosition.AFTERBEGIN
      );
      statisticsComponent = new StatisticsView(pointsModel.points);
      renderElement(bodyContainerElement, statisticsComponent);
      break;
    default:
      tripRoutePresenter.destroy();
      tripRoutePresenter.init();
      filtersPresenter.destroy();
      filtersPresenter.init();
      removeElement(statisticsComponent);
      removeElement(tripInfoComponent);
  }
};

headerMenuComponent.setHeaderMenuClickHandler(handleHeaderMenuClick);

const showTripRouteTab = () => {
  headerMenuComponent.setMenuItem(SiteMenuItems.TRIP_ROUTE);
  handleHeaderMenuClick(SiteMenuItems.TRIP_ROUTE);
};

const handleAddPointClick = (evt) => {
  evt.preventDefault();
  showTripRouteTab();
  tripRoutePresenter.addPoint(evt.target);
};

eventAddButtonElement.addEventListener('click', handleAddPointClick);

const loadingMessageComponent = new LoadingMessageView();
renderElement(tripEventsElement, loadingMessageComponent);

const handleServiceLoadingError = () => {
  removeElement(loadingMessageComponent);
  renderElement(bodyContainerElement, new ServiceErrorMessageView());
};

renderElement(tripControlsNavigationElement, headerMenuComponent);
filtersPresenter.init();
lockHeader();

destinationsModel.init();
offersModel.init();

function handleCriticalServiceLoadState(viewUpdateType) {
  switch (viewUpdateType) {
    case ServiceLoadUpdateType.ERROR:
      handleServiceLoadingError();
      break;
    case ServiceLoadUpdateType.SUCCESS:
      loadedCriticalServicesCount++;
      if (loadedCriticalServicesCount === criticalServices.length) {
        pointsModel.init().finally(() => {
          unlockHeader();
          removeElement(loadingMessageComponent);
          showTripRouteTab();
        });
      }
      break;
    default:
      throw new Error(
        `Invalid viewUpdateType value received ${viewUpdateType}`
      );
  }
}
