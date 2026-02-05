/**
 * @param {string} elName - Tag name of HTML element to create
 * @param {Object.<string, (string|number)>} props - Object containing attributes you want to put into the HTML element
 * @returns {HTMLElement}
 */
export function makeEl(elName, props) {
  const newEl = document.createElement(elName);

  for (const propKey in props) {
    newEl.setAttribute(propKey, props[propKey]);
  }

  return newEl;
}
