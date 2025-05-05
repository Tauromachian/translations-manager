import {
  deleteCollection,
  getCollections,
  postCollection,
  putCollection,
} from "../services/collections-req.js";

import debounce from "../../utilities/debouncer.js";

import { router } from "../services/router.js";

export class CollectionsPage extends HTMLElement {
  #isFormInserting = false;
  #selectedId;
  #form;
  #modalConfirmDelete;
  #isLoading;
  #collections;
  #breadcrumbs = [
    { name: "Collections", url: "" },
  ];
  #isEmpty;

  constructor() {
    super();

    this.#collections = new Proxy({ value: [] }, {
      set: (target, property, value) => {
        target[property] = value;

        if (!value.length) {
          this.#isEmpty.value = true;
          return true;
        } else {
          this.#isEmpty.value = false;
        }

        const dataTable = this.querySelector("data-table");
        dataTable.setAttribute("items", JSON.stringify(value));

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

    this.#isEmpty = new Proxy({ value: false }, {
      set: (target, property, value) => {
        target[property] = value;

        const empty = this.querySelector("empty-state");

        empty.style.display = value ? "block" : "none";

        return true;
      },
    });
  }

  onSearch(event) {
    debounce(() => {
      this.loadData(event.detail);
    });
  }

  setLoaderState(state) {
    const loader = this.querySelector("app-loader");

    loader.style.display = state ? "block" : "none";
  }

  onSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    const jsonData = Object.fromEntries(data);

    if (this.#isFormInserting) {
      this.postData(jsonData);
    } else {
      this.putData(jsonData);
    }

    const appModal = this.querySelector("app-modal");
    appModal.setAttribute("open", false);

    this.loadData();
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

  async loadData(searchText) {
    this.#isLoading.value = true;

    const data = await getCollections(searchText);

    this.#collections.value = data;
    this.#isLoading.value = false;
  }

  async postData(data) {
    await postCollection(data);
  }

  async putData(data) {
    await putCollection(this.#selectedId, data);
  }

  async deleteCollection(id) {
    await deleteCollection(id);
  }

  openModal(isInserting, id) {
    const modal = this.querySelector("app-modal");
    modal.setAttribute("open", true);
    this.#isFormInserting = isInserting;
    this.#selectedId = id;

    if (isInserting) {
      this.#form.reset();
      return;
    }

    if (!id) return;

    const collection = this.#collections.value.find((c) => c.id == id);

    if (collection) {
      const textField = modal.querySelector("text-field[name='name']");
      textField.value = collection.name;

      modal.querySelector("text-area[name='description']").value =
        collection.description;
    }
  }

  buildBreadcrumbs() {
    const breadcrumbs = document.createElement("app-breadcrumbs");
    breadcrumbs.setAttribute("breadcrumbs", JSON.stringify(this.#breadcrumbs));

    return breadcrumbs;
  }

  connectedCallback() {
    const headers = [
      {
        title: "Name",
        key: "name",
      },
      {
        title: "Description",
        key: "description",
      },
      {
        title: "Actions",
        key: "actions",
      },
    ];

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

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                data-table::part(actions-column) {
                    display: flex;
                    gap: .5rem;
                    justify-content: left;
                }
            </style>
            <div class="container mt-5">
                <div class="breadcrumbs-wrapper my-2"></div>

                <h1>Collections</h1>

                <div class="card">
                    <table-toolbar class="p-1"></table-toolbar>

                    <data-table>
                        <div slot="actions" part="actions-column" class="actions-column">
                            <app-button class="edit">
                                Edit
                            </app-button>
                            <app-button class="delete">
                                Delete
                            </app-button>
                            <app-button class="go-to-translation">
                                Manage Translations
                            </app-button>
                        </div>
                    </data-table>

                    <empty-state></empty-state>

                    <app-loader class="py-5"></app-loader>
                </div>
            </div>

            <app-modal title="Create Collection" width="400px">
                <form>
                    <text-field label="Name" name="name"></text-field>
                    <text-area label="Description" name="description"></text-area>

                    <div class="modal-actions">
                        <app-button type="submit">Create</app-button>
                    </div>
                </form>
            </app-modal>

            <modal-confirm-delete></modal-confirm-delete>
        `;

    this.loadData();

    const tableToolbar = this.querySelector("table-toolbar");

    tableToolbar.addEventListener("click-create", () => {
      this.openModal(true);
    });

    const breadcrumbsWrapper = this.querySelector(".breadcrumbs-wrapper");
    breadcrumbsWrapper.appendChild(this.buildBreadcrumbs());

    tableToolbar.addEventListener("search", this.onSearch.bind(this));

    this.#form = this.querySelector("app-modal form");
    this.#form.addEventListener("submit", this.onSubmit.bind(this));

    this.#modalConfirmDelete = this.querySelector("modal-confirm-delete");

    this.#modalConfirmDelete.addEventListener(
      "click-delete",
      this.onModalDeleteConfirmation.bind(this),
    );

    const dataTable = this.querySelector("data-table");
    dataTable.setAttribute("headers", JSON.stringify(headers));
    dataTable.shadowRoot.querySelector("table").addEventListener(
      "click",
      this.onTableAction.bind(this),
    );
  }
}
