export class Collection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement("template");

    const collections = [
      "Collection 1",
      "Collection 2",
      "Collection 3",
      "Collection 4",
    ];

    template.innerHTML = `
            <style>
                .mt-5 {
                    margin-top: 5rem;
                }

                .m-1 {
                    margin: 1rem;
                }

                .table-toolbar {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    align-items: center;
                }

                text-field {
                    max-width: 300px;
                }
            </style>
            <div class="container mt-5">
                <h1>Collections</h1>

                <div class="card">
                    <div class="table-toolbar">

                        <text-field></text-field>
                        <button >Create</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
      collections
        .map(
          (collection) => `
                            <tr>
                                <td>${collection}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
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
        `;

    this.appendChild(template.content.cloneNode(true));
  }
}
