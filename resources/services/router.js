export const router = {
  routes: {},
  mainEl: null,
  init(routes, el) {
    this.routes = routes;
    this.mainEl = el;

    globalThis.addEventListener("popstate", () => {
      this.go(event.state.route, false);
    });

    this.go(location.pathname);
  },
  go(route, addToHistory = true) {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    let pageElement = null;

    if (route.endsWith("/")) {
      route = route.slice(0, -1);
    }

    if (this.routes[route]) {
      pageElement = document.createElement(this.routes[route]);
    } else {
      pageElement = document.createElement(this.routes["*"]);
    }

    this.mainEl.innerHTML = "";
    this.mainEl.appendChild(pageElement);
  },
};
