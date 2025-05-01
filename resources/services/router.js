export const router = {
  _routes: {},
  _regexRoutes: {},
  _mainEl: null,

  init(routes, el) {
    this._routes = routes;
    this._mainEl = el;

    for (const key in routes) {
      if (key.includes(":")) {
        const formattedRoute = key.replace(/:(.*)$/, "(.*)");

        this._regexRoutes[formattedRoute] = routes[key];
      }
    }

    globalThis.addEventListener("popstate", (event) => {
      this.go(event.state.route, false);
    });

    this.go(location.pathname);
  },

  renderPage(pageElement) {
    this._mainEl.innerHTML = "";
    this._mainEl.appendChild(pageElement);
  },

  getMatchingPage(route) {
    if (this._routes[route]) {
      return document.createElement(this._routes[route]);
    }

    let matchingRegex;

    for (const key in this._regexRoutes) {
      if (new RegExp(key).test(route)) {
        matchingRegex = this._regexRoutes[key];
      }
    }

    if (!matchingRegex) return;

    const pageElement = document.createElement(matchingRegex);

    return pageElement;
  },

  go(route, addToHistory = true) {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    if (route.endsWith("/")) {
      route = route.slice(0, -1);
    }

    let pageElement = this.getMatchingPage.call(this, route);

    if (pageElement) {
      this.renderPage(pageElement);
      return;
    }

    pageElement = document.createElement(this._routes["*"]);
    this.renderPage(Promise.all(value));
  },
};
