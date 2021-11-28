import { createMenu } from './view/menu.js';
import { renderTemplate, RenderPosition } from './render.js';

const tripControls = document.querySelector('.trip-controls');
const tripControlsNavigation = tripControls.querySelector('.trip-controls__navigation');

renderTemplate( tripControlsNavigation, createMenu(), RenderPosition.BEFOREEND);
