export function makeEl(elName, props) {
  const newEl = document.createElement(elName);

  for (const propKey in props) {
    newEl.setAttribute(propKey, props[propKey]);
  }

  return newEl;
}
