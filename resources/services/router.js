export const router = {
  route: {},

  _routes: {},
  _regexRoutes: {},
  _mainEl: null,

  init(routes, el) {
    this._routes = routes;
    this._mainEl = el;

    for (const key in routes) {
      if (key.includes(":")) {
        const formattedRoute = key.replace(/:(.*)$/, "(.*)");

        this._regexRoutes[formattedRoute] = {
          page: routes[key].name,
          name: routes[key].name,
          indexOfParam: key.indexOf(":"),
          component: routes[key].component,
          params: [key.match(/:(.*)$/)[1]],
        };
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

  getMatchingRoute(route) {
    if (this._routes[route]) {
      return this._routes[route];
    }

    let matchedRoute;

    for (const key in this._regexRoutes) {
      if (new RegExp(key).test(route)) {
        matchedRoute = this._regexRoutes[key];
      }
    }

    return matchedRoute;
  },

  getMatchingPage(route) {
    if (this._routes[route]) {
      delete route.params;
      return document.createElement(this._routes[route].name);
    }

    let matchedRoute;

    for (const key in this._regexRoutes) {
      if (new RegExp(key).test(route)) {
        matchedRoute = this._regexRoutes[key];
      }
    }

    if (!matchedRoute) return;

    const page = matchedRoute.page;

    this.route.params = {
      [matchedRoute.params[0]]: route.slice(matchedRoute.indexOfParam),
    };

    const pageElement = document.createElement(page);

    return pageElement;
  },

  async definePage(route) {
    const routeObject = this.getMatchingRoute(route);

    if (!routeObject) {
      this.definePage("*");
      return;
    }

    if (customElements.get(routeObject.name)) return;

    const routeComponent = await routeObject.component();

    customElements.define(
      routeObject.name,
      routeComponent[Object.keys(routeComponent)[0]],
    );
  },

  async go(route, addToHistory = true) {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    if (route.endsWith("/")) {
      route = route.slice(0, -1);
    }

    let pageElement = this.getMatchingPage(route);

    if (pageElement) {
      await this.definePage(route);
      this.renderPage(pageElement);

      return;
    }

    await this.definePage("*");
    pageElement = document.createElement(this._routes["*"].name);
    this.renderPage(pageElement);
  },
};
