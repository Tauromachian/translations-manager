import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import { Collection } from "./pages/CollectionPage.js";
import { TextField } from "./components/TextField.js";
import { AppModal } from "./components/AppModal.js";

import "../styles/index.css";

function defineCustomElements() {
  customElements.define("collection-page", Collection);
  customElements.define("text-field", TextField);
  customElements.define("app-modal", AppModal);
}

globalThis.addEventListener("DOMContentLoaded", () => {
  defineCustomElements(window);

  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
