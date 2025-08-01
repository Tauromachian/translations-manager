import "../components/RouterLink.js";

export class AppBreadcrumbs extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["breadcrumbs"];
  }

  buildBreadcrumbs(breadcrumbsData) {
    if (!breadcrumbsData) return [];

    let breadcrumbs = this.getAttribute("breadcrumbs");
    breadcrumbs = JSON.parse(breadcrumbs);

    return breadcrumbs.map((breadcrumb) => {
      const liEl = document.createElement("li");

      liEl.innerHTML =
        `<router-link to="${breadcrumb.url}">${breadcrumb.name}</router-link>`;

      return liEl;
    });
  }

  renderBreadcrumbs(breadcrumbsItems) {
    const ulEl = this.querySelector(".breadcrumbs");
    ulEl.innerHTML = "";

    breadcrumbsItems.forEach((listItem, index) => {
      const separatorLi = document.createElement("li");
      separatorLi.innerHTML = "/";

      ulEl.appendChild(listItem);

      if (index !== breadcrumbsItems.length - 1) {
        ulEl.appendChild(separatorLi);
      }
    });
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "breadcrumbs") {
      const breadcrumbsListItems = this.buildBreadcrumbs(newValue);

      this.renderBreadcrumbs(breadcrumbsListItems);
    }
  }

  connectedCallback() {
    this.innerHTML = `
                    <style>
                       .breadcrumbs {
                          list-style: none;
                          padding: 0;
                          margin: 0;
                          display: flex;
                          gap: 0.7rem;
                       }

                       .breadcrumbs li {
                          display: inline-block;
                       }

                       .breadcrumbs li router-link {
                           text-decoration: none;
                           color: var(--primary-20);
                           cursor: pointer;
                       }

                       .breadcrumbs li:last-child router-link{
                           color: var(--disabled-10);
                           pointer-events: none;
                           cursor: default;
                       }
                    </style>
    
    
                    <ul class="breadcrumbs">
                    </ul>
                `;

    const breadcrumbs = this.getAttribute("breadcrumbs");
    if (!breadcrumbs) return;

    const breadcrumbsLiItems = this.buildBreadcrumbs(breadcrumbs);
    this.renderBreadcrumbs(breadcrumbsLiItems);
  }
}

customElements.define("app-breadcrumbs", AppBreadcrumbs);
