import { getLanguages, postLanguage } from "../services/languages-req.js";
import { getTranslations } from "../services/translations-req.js";

import { router } from "../services/router.js";

export class TranslationsPage extends HTMLElement {
  #breadcrumbs = [
    { name: "Collections", url: "/app" },
    { name: "Languages", url: "" },
  ];
  #collectionId;
  #languages;
  #translations;
  #isLoading;

  constructor() {
    super();

    this.#languages = new Proxy({ value: [] }, {
      set: (target, property, value) => {
        target[property] = value;

        this.buildTableHeader(value);

        const translationsForm = this.querySelector("translations-form");
        translationsForm.setAttribute(
          "languages",
          JSON.stringify(value),
        );

        return true;
      },
    });

    this.#translations = new Proxy({ value: [] }, {
      set: (target, property, value) => {
        target[property] = value;

        this.buildTableBody(value, this.#languages.value);

        return true;
      },
    });

    this.#isLoading = new Proxy({ value: false }, {
      set: (target, property, value) => {
        target[property] = value;

        this.setLoaderState(value);

        return true;
      },
    });

    this.#collectionId = router.route.params.id;
  }

  setLoaderState(state) {
    const loader = this.querySelector("app-loader");

    loader.style.display = state ? "block" : "none";
  }

  async loadData(searchText) {
    this.#isLoading.value = true;

    const languagesData = await getLanguages({
      "filter[collectionId]": this.#collectionId,
    });

    if (!languagesData.length) {
      this.#isLoading.value = false;
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
    const table = this.querySelector("table");

    const tHead = document.createElement("thead");
    const row = document.createElement("tr");

    const keyTh = document.createElement("th");
    keyTh.innerHTML = "Key";
    row.appendChild(keyTh);

    for (const language of languages) {
      const th = document.createElement("th");
      th.innerHTML = language.name;
      row.appendChild(th);
    }

    const actionsTh = document.createElement("th");
    actionsTh.innerHTML = "Actions";
    row.appendChild(actionsTh);

    tHead.appendChild(row);

    table.appendChild(tHead);
  }

  buildTableBody(translations, languages) {
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

    const tableEl = this.querySelector("table");
    const tableBodyEl = document.createElement("tbody");

    for (const rowKey in rowsByKeys) {
      const row = document.createElement("tr");

      for (const cell in rowsByKeys[rowKey]) {
        const cellEl = document.createElement("td");
        cellEl.textContent = rowsByKeys[rowKey][cell];

        row.appendChild(cellEl);
      }

      const actionsCell = document.createElement("td");
      actionsCell.innerHTML = `
            <span class="actions-column">
                <app-button class="edit" data-value="${rowKey}">
                    Edit
                </app-button>
                <app-button class="delete" data-value="${rowKey}">
                    Delete
                </app-button>
            </span>
            `;

      row.appendChild(actionsCell);
      tableBodyEl.appendChild(row);
    }
    tableEl.appendChild(tableBodyEl);
  }

  buildBreadcrumbs() {
    const breadcrumbs = document.createElement("app-breadcrumbs");
    breadcrumbs.setAttribute("breadcrumbs", JSON.stringify(this.#breadcrumbs));

    return breadcrumbs;
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                .actions-column {
                    display: flex;
                    gap: .5rem;
                    justify-content: left;
                }
                
                .actions-column app-button {
                    width: fit-content;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    margin-top: 0.5rem;
                }
            </style>
            <div class="container mt-5">
                <div class="breadcrumbs-wrapper my-2"></div>

                <h1>Languages</h1>

                <div class="card">
                    <table-toolbar class="p-1" action-button-text="Add Language">
                        <div slot="append">
                            <app-button id="translations-create-button">Add Translation</app-button>
                        </div>
                    </table-toolbar>

                    <table></table>

                    <app-loader class="py-5"></app-loader>
                </div>
            </div>

            <app-modal title="Add Language" width="400px">
                <language-form></language-form>
            </app-modal>

            <app-modal title="Add Translations" width="400px">
                <translations-form></translations-form>
            </app-modal>

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

    languageForm.addEventListener("form-submit", (event) => {
      this.postLanguageData(event.detail);

      const languagesModal = this.querySelector("app-modal");
      languagesModal.setAttribute("open", false);

      this.loadData();
    });
  }
}
