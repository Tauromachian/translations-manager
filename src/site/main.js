import "./styles/index.css";

import "iconify-icon";

document.addEventListener("DOMContentLoaded", () => {
  const buttonEl = document.querySelector("header button");
  const htmlEl = document.querySelector("html");

  buttonEl.addEventListener("click", () => {
    const htmlElDarkAttr = htmlEl.getAttribute("data-theme");

    if (htmlElDarkAttr) {
      htmlEl.removeAttribute("data-theme");
    } else {
      htmlEl.setAttribute("data-theme", "dark");
    }
  });
});
