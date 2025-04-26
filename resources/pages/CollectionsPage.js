import {
  deleteCollection,
  getCollections,
  postCollection,
  putCollection,
} from "../services/collections-req.js";

export class CollectionsPage extends HTMLElement {
  isFormInserting = false;
  selectedId;
  form;
  breadcrumbs = [
    { name: "Collections", url: "/collections" },
    { name: "Translations", url: "/translations" },
  ];

  constructor() {
    super();

    this.collections = [];
    this.collections = new Proxy({ value: this.collections }, {
      set: (target, property, value) => {
        target[property] = value;

        this.buildTableBody(value);

        return true;
      },
    });
  }

  async loadData(searchText) {
    const data = await getCollections(searchText);

    this.collections.value = data;
  }

  async postData(data) {
    await postCollection(data);
  }

  async putData(data) {
    await putCollection(this.selectedId, data);
  }

  async deleteCollection(id) {
    await deleteCollection(id);
  }

  openModal(isInserting, id) {
    const modal = this.querySelector("app-modal");
    modal.setAttribute("open", true);
    this.isFormInserting = isInserting;
    this.selectedId = id;

    if (isInserting) {
      this.form.reset();
      return;
    }

    if (!id) return;

    const collection = this.collections.value.find((c) => c.id == id);

    if (collection) {
      const textField = modal.querySelector("text-field[name='name']");
      textField.value = collection.name;

      modal.querySelector("text-area[name='description']").value =
        collection.description;
    }
  }

  buildTableBody(collections) {
    if (!collections) return;

    const tBody = document.querySelector("tbody");
    tBody.innerHTML = "";

    for (const collection of collections) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${collection.name}</td>
                <td>${collection.description}</td>
                <td class="actions-column">
                    <app-button class="edit" data-value="${collection.id}">
                        Edit
                    </app-button>
                    <app-button class="delete" data-value="${collection.id}">
                        Delete
                    </app-button>
                    <app-button class="translate" to="collection/${collection.id}" data-value="${collection.id}">
                        Manage Translations
                    </app-button>
                </td>
            `;

      tBody.appendChild(row);
    }
  }

  buildBreadcrumbs() {
    const breadcrumbs = document.createElement("app-breadcrumbs");
    breadcrumbs.setAttribute("breadcrumbs", JSON.stringify(this.breadcrumbs));

    return breadcrumbs;
  }

  connectedCallback() {
    const template = document.createElement("template");

    const stringifiedBreadcrumbs = JSON.stringify(this.breadcrumbs);
    console.log(
      stringifiedBreadcrumbs,
    );

    template.innerHTML = `
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
            </style>
            <div class="container mt-5">
                <div class="breadcrumbs-wrapper my-2"></div>

                <h1>Collections</h1>

                <div class="card">
                    <table-toolbar class="p-1"></table-toolbar>

                    <table id="collections-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
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

    this.appendChild(template.content);
    this.loadData();

    const tableToolbar = this.querySelector("table-toolbar");

    tableToolbar.addEventListener("click-create", () => {
      this.openModal(true);
    });

    const breadcrumbsWrapper = this.querySelector(".breadcrumbs-wrapper");
    breadcrumbsWrapper.appendChild(this.buildBreadcrumbs());

    tableToolbar.addEventListener("search", (e) => {
      this.loadData(e.detail);
    });

    this.form = this.querySelector("app-modal form");
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(e.target);
      const jsonData = Object.fromEntries(data);

      if (this.isFormInserting) {
        this.postData(jsonData);
      } else {
        this.putData(jsonData);
      }

      const appModal = this.querySelector("app-modal");
      appModal.setAttribute("open", false);

      this.loadData();
    });

    const modalConfirmDelete = this.querySelector("modal-confirm-delete");

    modalConfirmDelete.addEventListener("click-delete", () => {
      this.deleteCollection(this.selectedId);
      modalConfirmDelete.setAttribute("open", false);
      this.loadData();
    });

    this.querySelector("#collections-table").addEventListener(
      "click",
      (event) => {
        const collectionId = event.target.dataset.value;

        if (event.target.closest(".delete")) {
          modalConfirmDelete.setAttribute("open", true);
          this.selectedId = collectionId;

          this.loadData();
        }

        if (event.target.closest(".edit")) {
          this.openModal(false, collectionId);
        }
      },
    );
  }
}
