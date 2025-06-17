import "./TextField.js";
import "./AppButton.js";

export class TableToolbar extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["action-button-text", "disable-search"];
  }

  connectedCallback() {
    const template = document.createElement("template");

    const actionButtonText = this.getAttribute("action-button-text") ||
      "Create";

    template.innerHTML = `
          <style>
              :host {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  gap: .5rem;
              }

              :host text-field {
                  max-width: 300px; 
                  margin-right: auto;
              }

              :host app-button {
                  width: fit-content;
              }
          </style>

          <text-field append-inner-icon="material-symbols:search"></text-field>
          <app-button>${actionButtonText}</app-button>
          <slot name="append"></slot>
      `;

    this.root.appendChild(template.content.cloneNode(true));

    this.root.querySelector("app-button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click-create"));
    });

    const textField = this.root.querySelector("text-field");

    textField.addEventListener("input", (e) => {
      this.dispatchEvent(
        new CustomEvent("search", { detail: e.target.value }),
      );
    });

    const isTextDisabled = this.getAttribute("disable-search");

    if (typeof isTextDisabled === "string" && isTextDisabled !== "false") {
      textField.style["display"] = "none";
    }
  }
}

customElements.define("table-toolbar", TableToolbar);
