class AppList extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["items"];
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "items") {
      this.renderList(JSON.parse(newValue));
    }
  }

  renderList(items) {
    const ul = this.querySelector("ul");

    for (const item of items) {
      const li = document.createElement("li");

      li.setAttribute("value", item.value);
      li.innerText = item.text;

      ul.appendChild(li);
    }
  }

  connectedCallback() {
    this.innerHTML = `
            <style>
                ul  {
                    list-style: none;
                }

                ul > li {
                    padding: 8px;
                    cursor: pointer;
                }

                ul > li:hover {
                    background: var(--table-row-hover);
                }
            </style>
    
            <ul>
            </ul>
        `;

    const ul = this.querySelector("ul");
    ul.addEventListener("click", (event) => {
      console.log(event.target);
    });
  }
}

customElements.define("app-list", AppList);
