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

import {
  cloneCollection,
  deleteCollection,
  getCollections,
  postCollection,
  putCollection,
} from "../services/collections-req.js";

import debounce from "../../shared/utils/debouncer.js";

import { router } from "../services/router.js";

import { computed, ref, watch } from "../../shared/utils/reactivity.js";

export class CollectionsPage extends HTMLElement {
  #modalMode = "update";
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

    this.#isEmpty = computed(() => {
      if (this.#isLoading.value) return false;

      return !this.#collections.value.length;
    });

    watch(this.#collections, (value) => {
      const dataTable = this.querySelector("data-table");

      if (!dataTable) return true;

      dataTable.setAttribute("items", JSON.stringify(value));
    });

    watch(this.#isLoading, (value) => {
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

  async onSubmit(event) {
    event.preventDefault();

    const form = event.target;

    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const jsonData = Object.fromEntries(data);

    if (this.#modalMode === "insert") {
      await this.postData(jsonData);
    } else if (this.#modalMode === "update") {
      await this.putData(jsonData);
    } else {
      await cloneCollection({ ...jsonData, id: this.#selectedId });
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
      this.openModal.call(this, "edit", collectionId);
    }

    if (event.target.closest(".go-to-translation")) {
      router.go(`/app/collection/${collectionId}`);
    }

    if (event.target.closest(".clone")) {
      this.openModal.call(this, "clone", collectionId);
    }
  }

  async onModalDeleteConfirmation() {
    await deleteCollection(this.#selectedId);
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

  /**
   * @param {('insert'|'clone'|'edit')} mode - Mode in which to open the modal
   * @param {number|string|undefined} id - ID of the collection to edit or clone
   */
  openModal(mode, id) {
    const modal = this.querySelector("app-modal");
    modal.setAttribute("open", true);
    this.#modalMode = mode;
    this.#selectedId = id;

    if (mode === "insert" || mode === "clone") {
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
            <app-layout class="app-layout" title="Collections">
                <div class="card" slot="content">
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
                            <app-button class="clone">
                                Clone
                            </app-button>
                        </div>
                    </data-table>

                    <empty-state></empty-state>

                    <div class="table-loader">
                        <app-loader class="py-5"></app-loader>
                    </div>
                </div>
            </app-layout>

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
      this.openModal.call(this, "insert");
    });

    const appLayout = this.querySelector("app-layout");
    appLayout.setAttribute("breadcrumbs", JSON.stringify(this.#breadcrumbs));

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
