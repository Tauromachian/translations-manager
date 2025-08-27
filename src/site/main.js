import "./styles/index.css";

import "iconify-icon";

import { loadTheme, toggleTheme } from "@/shared/utils/theme.js";

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  const buttonEl = document.querySelector("header button");

  buttonEl.addEventListener("click", toggleTheme);
});
