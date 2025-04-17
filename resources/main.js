import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../styles/index.css";

globalThis.addEventListener("DOMContentLoaded", () => {
  appState.el = document.querySelector("#app");

  router.init(routes, appState.el);
});
