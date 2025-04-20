export class TranslationsPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement("template");

    const headers = [
      "Es",
      "En",
      "Actions",
    ];

    const languages = [
      { en: "Food", es: "Comida" },
      { en: "This", es: "Comida" },
    ];

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
            </style>
            <div class="container mt-5">
                <h1>Languages</h1>

                <div class="card">
                    <table-toolbar class="p-1" action-button-text="Add Language">
                        <div slot="append">
                            <app-button>Add Translation</app-button>
                        </div>
                    </table-toolbar>

                    <table>
                        <thead>
                            <tr>
                                
                                ${
      headers.map((header) => `
                                        <th>${header}</th>
                                    `)
    }

                            </tr>
                        </thead>
                        <tbody>
                            ${
      languages
        .map(
          (lang) => `
                            <tr>
                                <td>${lang.en}</td>
                                <td>${lang.es}</td>
                                <td class="actions-column">
                                    <app-button>Edit</app-button>
                                    <app-button>Delete</app-button>
                                </td>
                            </tr>
                           `,
        )
        .join("")
    }
                        </tbody>

                    </table>
                </div>
            </div>

            <app-modal title="Create Collection" width="400px">
                <form>
                    <text-field label="Name"></text-field>

                    <div class="modal-actions">
                        <app-button>Create</app-button>
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
  }
}
