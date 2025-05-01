export class TranslationsForm extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["languages"];
  }

  connectedCallback() {
    const template = document.createElement("template");

    let languages = this.getAttribute("languages");
    languages = JSON.parse(languages);

    template.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    width: 100%;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    margin-top: 0.5rem;
                }
            </style>

            <form>
                ${
      languages
        .map(
          (lang) => `
                        <text-field label="${lang.title}"></text-field>
                    `,
        )
        .join("")
    }

                <div class="modal-actions">
                    <app-button>Add Translations</app-button>
                </div>
            </form>
        `;

    this.root.appendChild(template.content.cloneNode(true));
  }
}
