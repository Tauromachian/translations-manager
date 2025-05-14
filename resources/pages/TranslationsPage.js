import "../components/AppBreadcrumbs.js";
import "../components/AppLoader.js";
import "../components/DataTable.js";
import "../components/EmptyState.js";
import "../components/AppModal.js";
import "../components/AppButton.js";
import "../components/TableToolbar.js";
import "../components/TextArea.js";
import "../components/TextField.js";
import "../components/ModalConfirmDelete.js";
import "../components/LanguageForm.js";
import "../components/TranslationsForm.js";

import { getLanguages, postLanguage } from "../services/languages-req.js";
import { getTranslations } from "../services/translations-req.js";

import { router } from "../services/router.js";

import { ref, watch } from "../../utilities/reactivity.js";

export class TranslationsPage extends HTMLElement {
  #breadcrumbs = [
    { name: "Collections", url: "/app" },
    { name: "Translations", url: "" },
  ];
  #collectionId;
  #languages = ref([]);
  #translations = ref([]);
  #isLoading = ref(false);
  #isEmpty = ref(false);
  #modalConfirmDelete = false;
  #selectedId;

  constructor() {
    super();

    watch(this.#languages, (value) => {
      this.buildTableHeader(value);

      const translationsForm = this.querySelector("translations-form");

      if (!translationsForm) return true;

      translationsForm.setAttribute(
        "languages",
        JSON.stringify(value),
      );
    });

    watch(this.#translations, (value) => {
      if (!value.length) {
        this.#isEmpty.value = true;
        return;
      } else {
        this.#isEmpty.value = false;
      }

      const dataTable = this.querySelector("data-table");

      if (!dataTable) return true;

      const formattedTableData = this.formatTableData(
        value,
        this.#languages.value,
      );

      dataTable.setAttribute("items", JSON.stringify(formattedTableData));
    });

    watch(this.#isLoading, (value) => {
      if (value) {
        this.#isEmpty.value = false;
      }

      const loader = this.querySelector("app-loader");
      if (!loader) return;

      loader.style.display = value ? "block" : "none";
    });

    watch(this.#isEmpty, (value) => {
      const empty = this.querySelector("empty-state");

      if (!empty) return true;

      empty.style.display = value ? "block" : "none";
    });

    this.#collectionId = router.route.params.id;
  }

  async loadData(searchText) {
    this.#isLoading.value = true;

    const languagesData = await getLanguages({
      "filter[collectionId]": this.#collectionId,
    });

    if (!languagesData.length) {
      this.#isLoading.value = false;

      this.#isEmpty.value = true;

      return;
    }

    const filterFields = {
      "filter[languagesIds]": languagesData.map((language) => language.id),
    };

    if (searchText) {
      filterFields.search = searchText;
    }

    const translations = await getTranslations(
      filterFields,
    );

    this.#languages.value = languagesData;
    this.#translations.value = translations;

    this.#isLoading.value = false;
  }

  async postLanguageData(data) {
    await postLanguage(data);
  }

  buildTableHeader(languages) {
    const dataTable = this.querySelector("data-table");

    if (!dataTable) return;

    const headers = [
      { key: "key", title: "Key" },
      ...languages.map((language) => ({
        key: language.code,
        title: language.name,
      })),
      { key: "actions", title: "Actions" },
    ];

    dataTable.setAttribute("headers", JSON.stringify(headers));
  }

  formatTableData(translations, languages) {
    const rowsByKeys = {};
    const languagesCodesByIds = {};

    for (const translation of translations) {
      let code = languagesCodesByIds[translation.languageId];

      if (!code) {
        languagesCodesByIds[translation.languageId] = languages.find(
          (language) => language.id === translation.languageId,
        ).code;

        code = languagesCodesByIds[translation.languageId];
      }

      const key = translation.key;
      if (!rowsByKeys[key]) {
        rowsByKeys[key] = {
          key,
          [code]: translation.translation,
        };
      } else {
        rowsByKeys[key][code] = translation.translation;
      }
    }

    return Object.values(rowsByKeys);
  }

  onTableAction(event) {
    const button = event.target;
    const closestTd = button.closest("tr");

    const collectionId = closestTd.dataset.value;

    if (event.target.closest(".delete")) {
      this.#modalConfirmDelete.setAttribute("open", true);
      this.#selectedId = collectionId;
    }

    if (event.target.closest(".edit")) {
      this.openModal.call(this, false, collectionId);
    }

    if (event.target.closest(".go-to-translation")) {
      router.go(`/app/collection/${collectionId}`);
    }
  }

  onModalDeleteConfirmation() {
    this.deleteCollection(this.#selectedId);
    this.#modalConfirmDelete.setAttribute("open", false);
    this.loadData();
  }

  buildBreadcrumbs() {
    const breadcrumbs = document.createElement("app-breadcrumbs");
    breadcrumbs.setAttribute("breadcrumbs", JSON.stringify(this.#breadcrumbs));

    return breadcrumbs;
  }

  connectedCallback() {
    this.innerHTML = `
            <div class="container mt-5">
                <div class="breadcrumbs-wrapper my-2"></div>

                <h1>Translations</h1>

                <div class="card">
                    <table-toolbar class="p-1" action-button-text="Add Language">
                        <div slot="append">
                            <app-button id="translations-create-button">Add Translation</app-button>
                        </div>
                    </table-toolbar>

                    <data-table>
                        <div slot="actions" part="actions-column" class="actions-column">
                            <app-button class="edit">
                                Edit
                            </app-button>
                            <app-button class="delete">
                                Delete
                            </app-button>
                        </div>
                    </data-table>

                    <empty-state></empty-state>

                    <app-loader class="py-5"></app-loader>
                </div>
            </div>

            <app-modal title="Add Language" width="400px">
                <language-form></language-form>
            </app-modal>

            <app-modal title="Add Translations" width="400px">
                <translations-form></translations-form>
            </app-modal>

            <modal-confirm-delete></modal-confirm-delete>
        `;

    this.loadData();

    const languagesModal = this.querySelector("app-modal");
    const collectionsModal = this.querySelectorAll("app-modal")[1];

    const tableToolbar = this.querySelector("table-toolbar");
    const translationsCreateButton = this.querySelector(
      "#translations-create-button",
    );

    const breadcrumbsWrapper = this.querySelector(".breadcrumbs-wrapper");
    breadcrumbsWrapper.appendChild(this.buildBreadcrumbs());

    tableToolbar.addEventListener("click-create", () => {
      languagesModal.setAttribute("open", true);
    });

    translationsCreateButton.addEventListener("click", () => {
      collectionsModal.setAttribute("open", true);
    });

    const languageForm = this.querySelector("language-form");

    languageForm.addEventListener("form-submit", async (event) => {
      if (!router?.route?.params?.id) return;

      const language = {
        ...event.detail,
        collectionId: router.route.params.id,
      };

      await this.postLanguageData(language);

      const languagesModal = this.querySelector("app-modal");
      languagesModal.setAttribute("open", false);

      this.loadData();
    });

    const dataTable = this.querySelector("data-table");
    dataTable.shadowRoot.querySelector("table").addEventListener(
      "click",
      this.onTableAction.bind(this),
    );

    this.#modalConfirmDelete = this.querySelector("modal-confirm-delete");
    this.#modalConfirmDelete.addEventListener(
      "click-delete",
      this.onModalDeleteConfirmation.bind(this),
    );
  }
}
