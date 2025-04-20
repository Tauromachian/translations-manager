export class LanguageForm extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.createElement("template");

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
                <text-field label="Name"></text-field>
                <text-field label="Code"></text-field>

                <div class="modal-actions">
                    <app-button>Add Language</app-button>
                </div>
            </form>
        `;

    this.root.appendChild(template.content.cloneNode(true));
  }
}
