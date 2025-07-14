import "./styles/index.css";

import "iconify-icon";

function toggleTheme() {
  const htmlEl = document.querySelector("html");

  let htmlElDarkAttr = htmlEl.getAttribute("data-theme");

  if (htmlElDarkAttr) {
    htmlEl.removeAttribute("data-theme");
  } else {
    htmlEl.setAttribute("data-theme", "dark");
  }

  htmlElDarkAttr = htmlEl.getAttribute("data-theme");

  localStorage.setItem("theme", htmlElDarkAttr ?? "light");
}

document.addEventListener("DOMContentLoaded", () => {
  const buttonEl = document.querySelector("header button");

  buttonEl.addEventListener("click", toggleTheme);
});
