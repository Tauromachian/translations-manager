/**
 * @param {string} elName - Tag name of HTML element to create
 * @param {Object.<string, (string|number)>} props - Object containing attributes you want to put into the HTML element
 * @returns {HTMLElement}
 */
export function makeEl(elName, props, children) {
  const newEl = document.createElement(elName);

  for (const propKey in props) {
    newEl.setAttribute(propKey, props[propKey]);
  }

  if (!children?.length) return newEl;

  for (const child of children) {
    newEl.appendChild(child);
  }

  return newEl;
}
