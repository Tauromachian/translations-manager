import "@/admin/layouts/AppLayout.js";

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
import "../components/AppMenu.js";
import "../components/AppList.js";

import {
  deleteLanguage,
  getLanguages,
  postLanguage,
  putLanguage,
} from "../services/languages-req.js";
import {
  deleteTranslationSet,
  getTranslations,
  postTranslationSet,
  putTranslationSet,
} from "../services/translations-req.js";

import { router } from "../services/router.js";

import { computed, ref, watch } from "../../shared/utils/reactivity.js";

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
  #languageForm;
  #selectedId;
  #isLanguagesEmpty;

  constructor() {
    super();

    this.#isEmpty = computed(() => {
      if (this.#isLoading.value) return false;

      return !this.#translations.value.length;
    });

    this.#isLanguagesEmpty = computed(() => {
      return !this.#languages.value.length;
    });

    watch(this.#isLanguagesEmpty, (value) => {
      const translationsCreateButton = this.querySelector(
        "#translations-create-button",
      );

      if (value) {
        translationsCreateButton.setAttribute("disabled", "");
      } else {
        translationsCreateButton.removeAttribute("disabled");
      }
    });

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
      const dataTable = this.querySelector("data-table");

      if (!dataTable) return true;

      const formattedTableData = this.formatTableData(
        value,
        this.#languages.value,
      );

      dataTable.setAttribute("items", JSON.stringify(formattedTableData));
    });

    watch(this.#isLoading, this.setLoaderState.bind(this));
    watch(this.#isEmpty, this.setEmptyState.bind(this));
  }

  setEmptyState(value) {
    const empty = this.querySelector("empty-state");

    if (!empty) return;

    empty.style.display = value ? "block" : "none";
  }

  setLoaderState(state) {
    const loader = this.querySelector("app-loader");

    if (!loader) return;

    loader.style.display = state ? "block" : "none";
  }

  async loadData(searchText) {
    this.#isLoading.value = true;

    const isLangLoaded = await this.loadLanguages();

    if (!isLangLoaded) {
      this.#isLoading.value = false;
      return;
    }

    await this.loadTranslations(searchText, this.#languages.value);

    this.#isLoading.value = false;
  }

  async loadLanguages() {
    this.#collectionId = router.route.params.id;

    const languagesData = await getLanguages({
      "filter[collectionId]": this.#collectionId,
    });

    if (!languagesData.length) {
      this.#languages.value = [];

      return;
    }

    this.#languages.value = languagesData;

    return true;
  }

  async loadTranslations(searchText, languagesData) {
    const filterFields = {
      "filter[languagesIds]": languagesData.map((language) => language.id),
    };

    if (searchText) filterFields.search = searchText;

    const translations = await getTranslations(
      filterFields,
    );

    this.#translations.value = translations;
  }

  buildTableHeader(languages) {
    const dataTable = this.querySelector("data-table");
    const headerSelect = this.querySelector("#header-select");

    if (!dataTable) return;

    const dynamicHeaders = languages.map((language) => ({
      key: language.code,
      title: language.name,
    }));

    const headers = [
      { key: "key", title: "Key" },
      ...dynamicHeaders,
      { key: "actions", title: "Actions" },
    ];

    dataTable.setAttribute("headers", JSON.stringify(headers));

    for (const header of dynamicHeaders) {
      let th = this.querySelector(`th[slot="header-${header.key}"]`);
      if (th) continue;

      th = document.createElement("th");
      const div = document.createElement("div");
      const span = document.createElement("span");
      const headerSelectClone = headerSelect.content.cloneNode(true);

      th.setAttribute("slot", `header-${header.key}`);
      th.appendChild(div);
      div.appendChild(span);
      div.appendChild(headerSelectClone);
      div.classList += "table-header-container";

      span.textContent = header.title;

      dataTable.appendChild(th);

      const appList = div.querySelector("app-list");
      appList.setAttribute("value", header.key);
      appList.setAttribute(
        "items",
        JSON.stringify([
          { value: "delete", text: "Delete" },
        ]),
      );

      appList.addEventListener("click", (event) => {
        const action = event.target.getAttribute("value");
        const lang = event.target.closest("app-list").getAttribute("value");

        this.onLangAction(lang, action);
      });
    }
  }

  async onLangAction(langCode, action) {
    const language = this.#languages.value.find((language) =>
      language.code === langCode
    );
    const langId = language.id;

    const actions = {
      delete: deleteLanguage,
    };

    await actions[action](langId);
    this.loadData();
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

    if (!closestTr) return;

    const translationId = closestTr.dataset.value;

    if (event.target.closest(".delete")) {
      this.#modalConfirmDelete.setAttribute("open", true);
      this.#selectedId = translationId;
    }

    if (event.target.closest(".edit")) {
      this.openTranslationModal(false, translationId);
    }
  }

  openLanguageModal() {
    const languagesModal = this.querySelector("app-modal");

    this.#languageForm.reset();

    languagesModal.setAttribute("open", true);
  }

  openTranslationModal(isInserting, id) {
    const translationsModal = this.querySelector(
      "#translations-modal",
    );

    translationsModal.setAttribute("open", true);
    this.#isTranslationFormInserting = isInserting;
    this.#selectedId = id;

    if (isInserting) {
      this.#translationForm.reset();
      return;
    }

    if (!id) return;

    let translationsSet;

    for (const key in this.#translationsByKeys) {
      if (key === id) {
        translationsSet = this.#translationsByKeys[key];
      }
    }

    this.#translationForm.setAttribute(
      "translations-set",
      JSON.stringify(translationsSet),
    );
  }

  async onModalDeleteConfirmation() {
    const translationsSet = this.#translationsByKeys[this.#selectedId];

    if (!translationsSet) return;

    await deleteTranslationSet(translationsSet.ids);
    this.#modalConfirmDelete.setAttribute("open", false);

    this.loadData();
  }

  async onTranslationFormSubmit(event) {
    const data = event.detail;

    if (!data) return;

    if (this.#isTranslationFormInserting) {
      await postTranslationSet(data, this.#languages.value);
    } else {
      const translationsSet = this.#translationsByKeys[this.#selectedId];
      await putTranslationSet(data, translationsSet.ids, this.#languages.value);
    }

    const appModal = this.querySelectorAll("app-modal")[1];
    appModal.setAttribute("open", false);

    this.loadData();
  }

  async onLanguageFormSubmit(event) {
    const languagesModal = this.querySelector("#languages-modal");

    if (!router?.route?.params?.id) return;

    const language = {
      ...event.detail,
      collectionId: Number(router.route.params.id),
    };

    await postLanguage(language);

    languagesModal.setAttribute("open", false);

    this.loadData();
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
            .table-header-container {
                display: flex;
                align-items: center;
            }

            </style>

            <app-layout class="app-layout" title="Translations">
                <div class="card" slot="content">
                    <table-toolbar class="p-1" action-button-text="Add Language" disable-search>
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

                    <template id="header-select">
                        <app-menu activator-button-text="Actions" class="ml-4">
                            <app-list></app-list>
                        </app-menu>
                    </template>

                    <empty-state></empty-state>

                    <div class="table-loader">
                        <app-loader class="py-5"></app-loader>
                    </div>
                </div>
            </app-layout>

            <app-modal title="Add Language" width="400px" id="languages-modal">
                <language-form></language-form>
            </app-modal>

            <app-modal title="Add Translations" width="400px" id="translations-modal">
                <translations-form></translations-form>
            </app-modal>

            <modal-confirm-delete></modal-confirm-delete>
        `;

    this.loadData();

    this.#translationForm = this.querySelector("translations-form");
    this.#languageForm = this.querySelector("language-form");

    const tableToolbar = this.querySelector("table-toolbar");
    const translationsCreateButton = this.querySelector(
      "#translations-create-button",
    );

    const appLayout = this.querySelector("app-layout");
    appLayout.setAttribute("breadcrumbs", JSON.stringify(this.#breadcrumbs));

    tableToolbar.addEventListener(
      "click-create",
      this.openLanguageModal.bind(this),
    );

    translationsCreateButton.addEventListener("click", () => {
      this.openTranslationModal(true);
    });

    this.#languageForm.addEventListener(
      "form-submit",
      this.onLanguageFormSubmit.bind(this),
    );

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

    this.#translationForm.addEventListener(
      "form-submit",
      this.onTranslationFormSubmit.bind(this),
    );
  }
}
