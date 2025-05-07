import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../styles/index.css";

import { CollectionsPage } from "./pages/CollectionsPage.js";
import { NotFound } from "./pages/NotFound.js";
import { TranslationsPage } from "./pages/TranslationsPage.js";

function defineCustomElements() {
  customElements.define("collection-page", CollectionsPage);
  customElements.define("not-found", NotFound);
  customElements.define("translations-page", TranslationsPage);
}

globalThis.addEventListener("DOMContentLoaded", () => {
  defineCustomElements(window);

  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
