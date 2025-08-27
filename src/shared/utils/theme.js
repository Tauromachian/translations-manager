export function loadTheme() {
  const theme = localStorage.getItem("theme");

  const htmlEl = document.querySelector("html");
  if (theme === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
  }
}

export function toggleTheme() {
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
