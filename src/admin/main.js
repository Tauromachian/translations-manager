import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../shared/styles/index.css";

document.addEventListener(
  "invalid",
  (event) => {
    event.preventDefault();
  },
  true,
);

globalThis.addEventListener("DOMContentLoaded", () => {
  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
