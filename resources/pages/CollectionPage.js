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

                .p-1 {
                    padding: 1rem;
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
