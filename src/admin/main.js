import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../shared/styles/index.css";

globalThis.addEventListener("DOMContentLoaded", () => {
  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
