import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../styles/index.css";

import { Collection } from "./pages/CollectionPage.js";
import { TextField } from "./components/TextField.js";
import { AppModal } from "./components/AppModal.js";
import { TableToolbar } from "./components/TableToolbar.js";
import { AppButton } from "./components/AppButton.js";
import { NotFound } from "./pages/NotFound.js";
import { TranslationsPage } from "./pages/TranslationsPage.js";
import { LanguageForm } from "./components/LanguageForm.js";
import { TranslationsForm } from "./components/TranslationsForm.js";
import { TextArea } from "./components/TextArea.js";
import { ModalConfirmDelete } from "./components/ModalConfirmDelete.js";

function defineCustomElements() {
  customElements.define("collection-page", Collection);
  customElements.define("text-field", TextField);
  customElements.define("app-modal", AppModal);
  customElements.define("table-toolbar", TableToolbar);
  customElements.define("app-button", AppButton);
  customElements.define("not-found", NotFound);
  customElements.define("translations-page", TranslationsPage);
  customElements.define("language-form", LanguageForm);
  customElements.define("translations-form", TranslationsForm);
  customElements.define("text-area", TextArea);
  customElements.define("modal-confirm-delete", ModalConfirmDelete);
}

globalThis.addEventListener("DOMContentLoaded", () => {
  defineCustomElements(window);

  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
