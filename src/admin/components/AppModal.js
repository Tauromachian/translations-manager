export class AppModal extends HTMLElement {
  #dialog;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["open", "title", "width"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "open") {
      this.setDialogState(newValue === "true");
    }

    if (name === "title") {
      const div = this.root.querySelector("dialog div");

      if (!div) return;

      div.textContent = newValue;
    }
  }

  /**
   * @param {boolean} newState - New state for the native dialog
   */
  setDialogState(newState) {
    if (!this.#dialog) return;

    if (newState) {
      this.#dialog.showModal();
    } else {
      this.#dialog.close();
    }
  }

  connectedCallback() {
    const template = document.createElement("template");

    const title = this.getAttribute("title");

    template.innerHTML = `
        <style>
            dialog {
              border: none;
              border-radius: 8px;
              padding: 24px;
              color: var(--text-color);
              background: var(--color-neutral);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
              max-width: 500px;
              width: ${this.getAttribute("width") || "500px"};
              font-family: Arial, sans-serif;
              outline: none;
            }

            dialog::backdrop {
              background: rgba(0, 0, 0, 0.5);
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
        
        <dialog>
            <div class="dialog-header">${title}</div>
            <slot></slot>
        </dialog>
    `;

    this.root.appendChild(template.content.cloneNode(true));

    this.#dialog = this.root.querySelector("dialog");

    this.#dialog.addEventListener("click", (event) => {
      const rect = this.#dialog.getBoundingClientRect();

      // It's impossible to click something with no coordinates
      // Hence if the event target has no coordinates then is called
      // from somewhere inside the dialog with js
      if (event.clientX === 0 && event.clientY === 0) return;

      const clickedInDialog = event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!clickedInDialog) {
        this.#dialog.close();
      }
    });

    if (this.hasAttribute("open")) {
      this.setDialogState(true);
    }
  }
}

customElements.define("app-modal", AppModal);
