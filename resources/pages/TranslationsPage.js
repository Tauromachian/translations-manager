export class TranslationsPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
        <h1>LOl</h1>
    `;

    this.appendChild(template.content.cloneNode(true));
  }
}
