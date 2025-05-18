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

import {
  deleteCollection,
  getCollections,
  postCollection,
  putCollection,
} from "../services/collections-req.js";

import debounce from "../../utils/debouncer.js";

import { router } from "../services/router.js";
import { ref, watch } from "../../utils/reactivity.js";

export class CollectionsPage extends HTMLElement {
  #isFormInserting = false;
  #selectedId;
  #form;
  #modalConfirmDelete;
  #collections = ref([]);
  #breadcrumbs = [
    { name: "Collections", url: "" },
  ];
  #isLoading = ref(false);
  #isEmpty = ref(false);

  constructor() {
    super();

    watch(this.#collections, (value) => {
      if (!value.length) {
        this.#isEmpty.value = true;
        return true;
      } else {
        this.#isEmpty.value = false;
      }

      const dataTable = this.querySelector("data-table");

      if (!dataTable) return true;

      dataTable.setAttribute("items", JSON.stringify(value));
    });

    watch(this.#isLoading, (value) => {
      if (value) {
        this.#isEmpty.value = false;
      }

      this.setLoaderState(value);
    });

    watch(this.#isEmpty, (value) => {
      const empty = this.querySelector("empty-state");

      if (!empty) return;

      empty.style.display = value ? "block" : "none";
    });
  }

  onSearch(event) {
    debounce(() => {
      this.loadData(event.detail);
    });
  }

  setLoaderState(state) {
    const loader = this.querySelector("app-loader");

    if (!loader) return;

    loader.style.display = state ? "block" : "none";
  }

  onSubmit(event) {
    event.preventDefault();

    const form = event.target;

    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
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

                    <div class="table-loader">
                        <app-loader class="py-5"></app-loader>
                    </div>
                </div>
            </div>

            <app-modal title="Create Collection" width="400px">
                <form>
                    <text-field label="Name" name="name" required></text-field>
                    <text-area label="Description (optional)" name="description"></text-area>

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
