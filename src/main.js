import { createTripTabsTemplate } from './view/trip-tabs.js';
import { renderTemplate, RenderPosition } from './render.js';

const tripControls = document.querySelector('.trip-controls');
const tripControlsNavigation = tripControls.querySelector('.trip-controls__navigation');

renderTemplate( tripControlsNavigation, createTripTabs(), RenderPosition.BEFOREEND);
