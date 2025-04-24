import {
  deleteCollection,
  getCollections,
  postCollection,
  putCollection,
} from "../services/collections-req.js";

export class Collection extends HTMLElement {
  isFormInserting = false;
  selectedId = null;

  constructor() {
    super();

    this.collections = [];
    this.collections = new Proxy({ value: this.collections }, {
      set: (target, property, value) => {
        target[property] = value;
        this.builTBody(value);

        return true;
      },
    });
  }

  async loadData() {
    const data = await getCollections();

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

    this.loadData();
  }

  openModal(isInserting, id) {
    const modal = this.querySelector("app-modal");
    modal.setAttribute("open", true);
    this.isFormInserting = isInserting;
    this.selectedId = id;

    if (isInserting) return;

    if (!id) return;

    const collection = this.collections.value.find((c) => c.id == id);

    if (collection) {
      const textField = modal.querySelector("text-field[name='name']");
      textField.value = collection.name;

      modal.querySelector("text-area[name='description']").value =
        collection.description;
    }
  }

  builTBody(collections) {
    if (!collections.length) return;

    const tBody = document.querySelector("tbody");
    tBody.innerHTML = "";

    for (const collection of collections) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${collection.name}</td>
                <td>${collection.description}</td>
                <td class="actions-column">
                    <app-button class="edit" data-value="${collection.id}">Edit</app-button>
                    <app-button class="delete" data-value="${collection.id}">Delete</app-button>
                </td>
            `;

      tBody.appendChild(row);
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
            <style>
                .mt-5 {
                    margin-top: 5rem;
                }

                .m-1 {
                    margin: 1rem;
                }

                .p-1 {
                    padding: 1rem;
                }
                
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
        `;

    this.appendChild(template.content.cloneNode(true));

    const tableToolbar = this.querySelector("table-toolbar");

    tableToolbar.addEventListener("click-create", () => {
      this.openModal(true);
    });

    this.loadData();

    const form = this.querySelector("app-modal form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(e.target);
      const jsonData = Object.fromEntries(data);

      if (this.isFormInserting) {
        this.postData(jsonData);
      } else {
        this.putData(jsonData);
      }

      this.querySelector("app-modal").setAttribute("open", false);
      this.loadData();
    });

    this.querySelector("#collections-table").addEventListener(
      "click",
      (event) => {
        const collectionId = event.target.dataset.value;

        if (event.target.closest(".delete")) {
          this.deleteCollection(collectionId);
        }

        if (event.target.closest(".edit")) {
          this.openModal(false, collectionId);
        }
      },
    );
  }
}
