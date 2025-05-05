import { router } from "./services/router.js";
import { routes } from "./services/routes.js";

import "../styles/index.css";

import { CollectionsPage } from "./pages/CollectionsPage.js";
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
import { AppBreadcrumbs } from "./components/AppBreadcrumbs.js";
import { RouterLink } from "./components/RouterLink.js";
import { AppLoader } from "./components/AppLoader.js";
import { DataTable } from "./components/DataTable.js";

function defineCustomElements() {
  customElements.define("collection-page", CollectionsPage);
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
  customElements.define("app-breadcrumbs", AppBreadcrumbs);
  customElements.define("router-link", RouterLink);
  customElements.define("app-loader", AppLoader);
  customElements.define("data-table", DataTable);
}

globalThis.addEventListener("DOMContentLoaded", () => {
  defineCustomElements(window);

  const mainEl = document.querySelector("#app");

  router.init(routes, mainEl);
});
