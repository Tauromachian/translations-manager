export class AppButton extends HTMLElement {
  button = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                button {
                    padding: 10px 20px;
                    font-weight: 500;
                    background-color: var(--primary);
                    color: var(--black);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                button:hover {
                    background-color: var(--primary-10);
                }

                button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
                }

                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            </style>

            <button type="button">
                <slot></slot>
            </button>
        `;

    this.root.appendChild(template.content.cloneNode(true));
    this.button = this.root.querySelector("button");

    this.button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("click"));
    });
  }
}
