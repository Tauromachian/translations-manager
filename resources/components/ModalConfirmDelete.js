export class ModalConfirmDelete extends HTMLElement {
  appModal = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "open") {
      this.appModal.setAttribute("open", newValue === "true");
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
        <style>
            div {
                display: flex;
                justify-content: flex-end;
                gap: .5rem;
            }
        </style>
        <app-modal title="Delete Entity">
            <p>Are you sure you want to delete this resource?</p>

            <div>
                <app-button class="cancel">Cancel</app-button>
                <app-button class="delete" color="danger">Delete</app-button>
            </div>
        </app-modal>
        `;

    this.root.appendChild(template.content.cloneNode(true));

    this.appModal = this.root.querySelector("app-modal");

    this.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancel")) {
        this.appModal.setAttribute("open", false);
      } else {
        this.dispatchEvent(new CustomEvent("click-delete"));
      }
    });
  }
}
