export class Collection extends HTMLElement {
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
    const response = await fetch("/api/collections");
    const data = await response.json();

    this.collections.value = data;
  }

  async postData(data) {
    const response = await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    console.log(result);
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
                    <app-button>Edit</app-button>
                    <app-button>Delete</app-button>
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

                    <table>
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
      const modal = this.querySelector("app-modal");
      modal.setAttribute("open", true);
    });

    this.loadData();

    const form = this.querySelector("app-modal form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(e.target);

      this.postData(Object.fromEntries(data));

      this.loadData();
    });
  }
}
