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
import {
  getTranslations,
  postTranslation,
  putTranslation,
} from "../services/translations-req.js";

import { router } from "../services/router.js";

import { ref, watch } from "../../utils/reactivity.js";

export class TranslationsPage extends HTMLElement {
  #breadcrumbs = [
    { name: "Collections", url: "/app" },
    { name: "Translations", url: "" },
  ];
  #collectionId;
  #languages = ref([]);
  #translations = ref([]);
  #translationsByKeys = {};
  #isLoading = ref(false);
  #isEmpty = ref(false);
  #modalConfirmDelete = false;
  #isTranslationFormInserting = true;
  #translationForm;
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
    this.#translationsByKeys = {};
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
      if (!this.#translationsByKeys[key]) {
        this.#translationsByKeys[key] = {
          id: key,
          ids: [translation.id],
          key,
          [code]: translation.translation,
        };
      } else {
        this.#translationsByKeys[key][code] = translation.translation;
        this.#translationsByKeys[key]["ids"].push(translation.id);
      }
    }

    return Object.values(this.#translationsByKeys);
  }

  onTableAction(event) {
    const button = event.target;
    const closestTr = button.closest("tr");

    const translationId = closestTr.dataset.value;

    if (event.target.closest(".delete")) {
      this.#modalConfirmDelete.setAttribute("open", true);
      this.#selectedId = translationId;
    }

    if (event.target.closest(".edit")) {
      this.openTranslationModal(false, translationId);
    }
  }

  openTranslationModal(isInserting, id) {
    const translationsModal = this.querySelectorAll("app-modal")[1];

    translationsModal.setAttribute("open", true);
    this.#isTranslationFormInserting = isInserting;
    this.#selectedId = id;

    if (isInserting) {
      this.#translationForm.reset();
      return;
    }

    if (!id) return;

    const translation = this.#translations.value.find((translation) =>
      translation.id == id
    );

    if (translation) {
      const textField = translationsModal.querySelector(
        "text-field[name='name']",
      );
      textField.value = translation.name;

      translationsModal.querySelector("text-area[name='description']").value =
        translation.description;
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

  onTranslationFormSubmit(event) {
    const form = event.target;

    if (!form?.detail) return;

    if (this.#isTranslationFormInserting) {
      postTranslation(form.detail);
    } else {
      putTranslation(form.detail);
    }
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

                    <div class="table-loaderl">
                        <app-loader class="py-5"></app-loader>
                    </div>
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

    this.#translationForm = this.querySelector("translations-form");

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
      this.openTranslationModal(true);
    });

    const languageForm = this.querySelector("language-form");

    languageForm.addEventListener("form-submit", async (event) => {
      if (!router?.route?.params?.id) return;

      const language = {
        ...event.detail,
        collectionId: Number(router.route.params.id),
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
