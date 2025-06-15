export class ModalConfirmDelete extends HTMLElement {
  #appModal;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "open") {
      this.#appModal.setAttribute("open", newValue === "true");
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
        <style>
            .actions {
                display: flex;
                justify-content: flex-end;
                gap: .5rem;
            }
        </style>
        <app-modal title="Delete Entity">
            <p>Are you sure you want to delete this resource?</p>

            <div class="actions">
                <app-button class="cancel">Cancel</app-button>
                <app-button class="delete" color="danger">Delete</app-button>
            </div>
        </app-modal>
        `;

    this.root.appendChild(template.content.cloneNode(true));

    this.#appModal = this.root.querySelector("app-modal");

    const cancelButton = this.#appModal.querySelector(".cancel");
    const deleteButton = this.#appModal.querySelector(".delete");

    cancelButton.addEventListener("click", () => {
      this.#appModal.setAttribute("open", false);
    });

    deleteButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click-delete"));
    });
  }
}

customElements.define("modal-confirm-delete", ModalConfirmDelete);
