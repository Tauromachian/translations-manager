export const router = {
  routes: {},
  regexRoutes: {},
  mainEl: null,

  init(routes, el) {
    this.routes = routes;
    this.mainEl = el;

    for (const key in routes) {
      if (Object.hasOwnProperty.call(routes, key)) {
        if (key.includes(":")) {
          const routeShards = key.split(":");
          routeShards[1] = "(.*)";
          this.regexRoutes[routeShards.join("")] = routes[key];
        }
      }
    }

    globalThis.addEventListener("popstate", (event) => {
      this.go(event.state.route, false);
    });

    this.go(location.pathname);
  },

  getMatchingRegexRoutes(route) {
    const matchingRoutes = [];

    for (const key in this.regexRoutes) {
      if (Object.hasOwnProperty.call(this.regexRoutes, key)) {
        if (new RegExp(key).test(route)) {
          matchingRoutes.push(this.regexRoutes[key]);
        }
      }
    }

    return matchingRoutes;
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
    } else if (this.getMatchingRegexRoutes.call(this, route).length) {
      const matchingRegex = this.getMatchingRegexRoutes.call(this, route);
      pageElement = document.createElement(matchingRegex[0]);
      console.log(pageElement);
    } else {
      pageElement = document.createElement(this.routes["*"]);
    }

    this.mainEl.innerHTML = "";
    this.mainEl.appendChild(pageElement);
  },
};
