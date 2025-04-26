export class TranslationsPage extends HTMLElement {
  breadcrumbs = [
    { name: "Collections", url: "/app" },
    { name: "Languages", url: "" },
  ];

  constructor() {
    super();
  }

  getTableBody(languages, headers) {
    const tBody = document.createElement("tbody");

    let allKeys = new Set();

    for (const key in languages) {
      const langKeys = Object.keys(languages[key]);
      allKeys = allKeys.union(new Set(langKeys));
    }

    for (const key of allKeys) {
      const row = document.createElement("tr");

      for (const header of headers) {
        const cell = document.createElement("td");

        if (header.value === "actions") {
          cell.innerHTML = `
                    <app-button>Edit</app-button>
                    <app-button>Delete</app-button>
            `;

          cell.classList.add("actions-column");
          row.appendChild(cell);
          continue;
        }

        if (!languages[header.value]) {
          continue;
        }

        cell.innerHTML = languages[header.value][key];
        row.appendChild(cell);
      }

      tBody.appendChild(row);
    }

    return tBody;
  }

  buildBreadcrumbs() {
    const breadcrumbs = document.createElement("app-breadcrumbs");
    breadcrumbs.setAttribute("breadcrumbs", JSON.stringify(this.breadcrumbs));

    return breadcrumbs;
  }

  connectedCallback() {
    const template = document.createElement("template");

    const headers = [
      {
        title: "Es",
        value: "es",
      },
      {
        title: "En",
        value: "en",
      },
      {
        title: "Actions",
        value: "actions",
      },
    ];

    const headersWithoutActions = headers.toSpliced(
      headers.length - 1,
      headers.length - 1,
    );

    const languages = {
      en: { food: "Food", this: "This" },
      es: { food: "Comida", this: "Esto" },
    };

    const tBody = this.getTableBody(languages, headers);

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

                    <table>
                        <thead>
                            <tr>
                                ${
      headers.map((header) => `<th>${header.title}</th>`).join("")
    }
                            </tr>
                        </thead>

                    </table>
                </div>
            </div>

            <app-modal title="Add Language" width="400px">
                <language-form></language-form>
            </app-modal>

            <app-modal title="Add Translations" width="400px">
                <translations-form 
                    languages='${JSON.stringify(headersWithoutActions)}'
                ></translations-form>
            </app-modal>

        `;

    this.appendChild(template.content);

    const tableToolbar = this.querySelector("table-toolbar");
    const table = this.querySelector("table");
    const translationsCreateButton = this.querySelector(
      "#translations-create-button",
    );

    const breadcrumbsWrapper = this.querySelector(".breadcrumbs-wrapper");
    breadcrumbsWrapper.appendChild(this.buildBreadcrumbs());

    table.appendChild(tBody);

    tableToolbar.addEventListener("click-create", () => {
      const modal = this.querySelector("app-modal");
      modal.setAttribute("open", true);
    });

    translationsCreateButton.addEventListener("click", () => {
      const modal = this.querySelectorAll("app-modal")[1];
      modal.setAttribute("open", true);
    });
  }
}
