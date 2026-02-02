export class DataTable extends HTMLElement {
  #headers = [];
  #items = [];
  #slotsByKeys = {};

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["headers", "items"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "headers") {
      this.#headers = JSON.parse(newValue);
      this.buildTableHeader();
      this.addKeySlots();
    }

    if (name === "items") {
      this.#items = JSON.parse(newValue);
      this.buildTableBody();
    }
  }

  addKeySlots() {
    const table = this.root.querySelector("table");

    for (const header of this.#headers) {
      const isAlreadyAdded = this.#slotsByKeys[header.key];
      if (isAlreadyAdded) continue;

      const slot = document.createElement("slot");
      slot.setAttribute("name", header.key);
      slot.style.display = "none";

      this.#slotsByKeys[header.key] = slot;
      table.appendChild(slot);
    }
  }

  buildTableHeader() {
    if (!this.#headers) return;

    const table = this.root.querySelector("table");

    let headersSlot = table.querySelector('slot[name="headers"]');
    if (!headersSlot) {
      headersSlot = document.createElement("slot");
      headersSlot.setAttribute("name", "headers");
      table.appendChild(headersSlot);
    }

    let tHead = headersSlot.firstChild;
    if (!tHead) {
      tHead = document.createElement("thead");
      headersSlot.appendChild(tHead);
    }

    let row = tHead.firstChild;
    row ??= document.createElement("tr");
    row.innerHTML = "";

    for (const header of this.#headers) {
      const th = document.createElement("th");
      th.textContent = header.title;

      const headerSlot = document.createElement("slot");
      headerSlot.setAttribute("name", `header-${header.key}`);
      headerSlot.appendChild(th);

      row.appendChild(headerSlot);
    }

    tHead.replaceChildren(row);
  }

  buildTableBody() {
    if (!this.#headers) {
      console.error("You need to define headers");
      return;
    }

    const table = this.root.querySelector("table");

    let tBody = table.querySelector("tbody");
    if (!tBody) {
      tBody = document.createElement("tbody");
      table.appendChild(tBody);
    }

    const rows = [];
    for (const item of this.#items) {
      const row = document.createElement("tr");

      for (const header of this.#headers) {
        const th = document.createElement("td");

        const itemValue = item[header.key];

        const elements = this.#slotsByKeys[header.key].assignedElements();

        if (elements.length) {
          th.appendChild(elements[0].cloneNode(true));
        } else {
          th.textContent = itemValue;
        }

        row.appendChild(th);
      }

      row.setAttribute("data-value", item.id);
      rows.push(row);
    }

    tBody.replaceChildren(...rows);
  }

  connectedCallback() {
    const template = document.createElement("template");

    template.innerHTML = `
        <style>
            :host {
              display: block;
              overflow-x: scroll;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
              font-family: Arial, sans-serif;
              color: var(--table-text-color);
            }

            th, td {
              padding: 12px 16px;
              text-align: left;
              border-bottom: 1px solid var(--table-border-color);
            }

            th {
              background-color: var(--table-header-background);
              font-weight: 600;
              text-transform: uppercase;
              font-size: 0.9em;
              color: var(--table-header-color);
            }

            tr:last-child td {
              border-bottom: none;
            }

            tr:hover {
              background-color: var(--table-row-hover);
            }

            td {
              font-size: 0.95em;
            }
        </style>

        <table>
        </table>
    `;

    this.root = this.attachShadow({ mode: "open" });

    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("data-table", DataTable);
