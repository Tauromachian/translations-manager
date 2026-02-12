import debounce from "../../shared/utils/debouncer.js";

import "./AppButton.js";

export class AppMenu extends HTMLElement {
  #dialog;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["open", "icon", "width"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "open") {
      this.#dialog.setAttribute("open", newValue);
    }
  }

  renderButton() {
    const buttonEl = this.root.querySelector("app-button");
    const icon = this.getAttribute("icon");
    buttonEl.setAttribute("icon", icon);

    buttonEl.addEventListener("click", this.onButtonClick.bind(this));
  }

  onButtonClick(event) {
    const open = this.#dialog.getAttribute("open");

    if (open === null) {
      this.#dialog.show();
      event.stopPropagation();
      document.addEventListener("click", this.clickOutside.bind(this));
    }
  }

  clickOutside(event) {
    const rect = this.#dialog.getBoundingClientRect();

    const clickedInDialog = event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!clickedInDialog) {
      this.#dialog.close();
    }

    document.removeEventListener("click", this.clickOutside.bind(this));
  }

  setDialogDimensions() {
    setTimeout(() => {
      const componentRect = this.getBoundingClientRect();
      const button = this.root.querySelector("app-button");
      const buttonRect = button.getBoundingClientRect();

      if (!this.#dialog) return;

      this.#dialog.style.left = `${componentRect.left}px`;
      this.#dialog.style.top = `${componentRect.bottom}px`;

      const width = this.getAttribute("width") || `${buttonRect.width}px`;
      this.#dialog.style.width = width;
    });
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
        <style>
            dialog {
              border: none;
              border-radius: 8px;
              padding: 12px 0;
              color: var(--text-color);
              background: var(--color-neutral);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
              margin: 0;
              font-family: Arial, sans-serif;
              outline: none;
              z-index: 50;
            }

            dialog[open] {
              animation: fadeIn 0.2s ease-out;
            }

            dialog:not([open]) {
              animation: fadeOut 0.2s ease-in;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }

            @keyframes fadeOut {
              from { opacity: 1; transform: scale(1); }
              to { opacity: 0; transform: scale(0.9); }
            }

            .dialog-header {
              font-size: 1.2rem;
              margin: 0 0 16px;
            }

            .dialog-content {
              margin-bottom: 16px;
            }
        </style>


        <app-button></app-button> 
        <dialog>
            <slot></slot>
        </dialog>
        `;

    this.root.appendChild(template.content.cloneNode(true));

    this.renderButton();
    this.#dialog = this.root.querySelector("dialog");
    this.setDialogDimensions(this.#dialog, this);

    const observer = new ResizeObserver(() => {
      debounce(() => this.setDialogDimensions(), 80);
    });
    observer.observe(document.body);
  }
}

customElements.define("app-menu", AppMenu);
