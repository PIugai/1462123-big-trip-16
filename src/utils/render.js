import AbstractView from '../view/abstract-view.js';
import { RenderPosition } from '../const.js';

export const renderElement = (container, element, position = RenderPosition.BEFOREEND) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (position) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
    default:
      parent.append(child);
  }
};

export const createElement = (template) => {
  const container = document.createElement('div');
  container.innerHTML = template;
  return container.firstChild;
};

export const replaceElement = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Unable to replace non-existing element');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Unable to find parent element');
  }

  parent.replaceChild(newChild, oldChild);
};

export const removeElement = (element) => {
  if (element === null) {
    return;
  }

  if (element instanceof AbstractView) {
    element.element.remove();
    element.removeElement();
  } else {
    element.remove();
  }
};
