export class TableToolbar extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
          <style>
              :host {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }

              :host text-field {
                  max-width: 300px; 
              }

              :host app-button {
                  width: fit-content;
              }
          </style>

          <text-field></text-field>
          <app-button>Create</app-button>
      `;

    this.root.appendChild(template.content.cloneNode(true));
  }
}
