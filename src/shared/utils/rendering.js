/**
 * @param {string} elName - Tag name of HTML element to create
 * @param {Object.<string, (string|number)>} props - Object containing attributes you want to put into the HTML element
 * @param {Array.<HTMLElement>} children
 * @returns {HTMLElement}
 */
export function makeEl(elName, props, children) {
  const newEl = document.createElement(elName);

  const SPECIAL_PROPS = ["textContent", "innerText", "innerHTML"];

  for (const propKey in props) {
    if (SPECIAL_PROPS.includes(propKey)) {
      newEl[propKey] = props[propKey];
      continue;
    }

    newEl.setAttribute(propKey, props[propKey]);
  }

  if (!children?.length) return newEl;

  for (const child of children) {
    newEl.appendChild(child);
  }

  return newEl;
}
