export const router = {
  route: {},

  _routes: {},
  _regexRoutes: {},
  _mainEl: null,

  init(routes, el) {
    this._routes = routes;
    this._mainEl = el;

    this.initRegexRoutes(routes);

    globalThis.addEventListener("popstate", (event) => {
      this.go(event.state.pathname, false);
    });

    this.go(location.pathname);
  },

  initRegexRoutes(routes) {
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
  },

  renderPage(pageElement) {
    this._mainEl.innerHTML = "";
    this._mainEl.appendChild(pageElement);
  },

  getMatchingRoute(pathname) {
    if (this._routes[pathname]) {
      return this._routes[pathname];
    }

    let matchedRoute;

    for (const key in this._regexRoutes) {
      if (new RegExp(key).test(pathname)) {
        matchedRoute = this._regexRoutes[key];
      }
    }

    if (!matchedRoute && this._routes["*"]) {
      return this._routes["*"];
    }

    return matchedRoute;
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

  async go(pathname, addToHistory = true) {
    if (addToHistory) {
      history.pushState({ pathname }, "", pathname);
    }

    if (pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    const route = this.getMatchingRoute(pathname);
    const pageElement = document.createElement(route?.name ?? "");

    if (route.indexOfParam) {
      this.route.params = {
        [route.params[0]]: pathname.slice(route.indexOfParam),
      };
    }

    await this.definePage(pathname);
    this.renderPage(pageElement);
  },
};
