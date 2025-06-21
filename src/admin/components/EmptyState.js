export class EmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          min-height: 200px;
          border-radius: 8px;
        }
        .title {
          font-size: 1.2rem;
          font-weight: bold;
          padding: 1rem;
          color: var(--text-color);
        }
        .description {
          color: var(--gray);
          margin-bottom: 1.5rem;
          max-width: 400px;
        }
        .action {
          margin-top: 1rem;
        }

        ::slotted([slot="title"]) {
          color: #007bff; /* Style slotted title */
        }

        ::slotted([slot="action"]) {
          background-color: #007bff;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
        }

        ::slotted([slot="action"]:hover) {
          background-color: #0056b3;
        }
      </style>

      <div class="wrapper">
          <div class="title">
              <slot name="title">No Data Available</slot>
          </div>
          <div class="description">
              <slot name="description">It looks like there's nothing here yet.</slot>
          </div>
          <div class="action">
              <slot name="action"></slot>
          </div>
      </div>
    `;
  }
}

customElements.define("empty-state", EmptyState);
