export class AppBreadcrumbs extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["breadcrumbs"];
  }

  buildBreadcrumbs() {
    if (!this.getAttribute("breadcrumbs")) {
      return "";
    }

    let breadcrumbs = this.getAttribute("breadcrumbs");
    breadcrumbs = JSON.parse(breadcrumbs);

    return breadcrumbs.map((breadcrumb) => {
      const liEl = document.createElement("li");

      liEl.innerHTML =
        `<router-link to="${breadcrumb.url}">${breadcrumb.name}</router-link>`;

      return liEl;
    });
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
                           color: var(--disabled);
                           pointer-events: none;
                           cursor: default;
                       }
                    </style>
    
    
                    <ul class="breadcrumbs">
                    </ul>
                `;

    const breadCrumbsItems = this.buildBreadcrumbs();

    const ulEl = this.querySelector(".breadcrumbs");

    breadCrumbsItems.forEach((listItem, index) => {
      const separatorLi = document.createElement("li");
      separatorLi.innerHTML = "/";

      ulEl.appendChild(listItem);

      if (index !== breadCrumbsItems.length - 1) {
        ulEl.appendChild(separatorLi);
      }
    });
  }
}
