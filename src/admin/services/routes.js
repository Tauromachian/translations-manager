export const routes = {
  "/app": {
    component: () => import("../pages/CollectionsPage.js"),
    name: "collection-page",
  },
  "/app/collection/:id": {
    component: () => import("../pages/TranslationsPage.js"),
    name: "translations-page",
  },
  "*": {
    component: () => import("../pages/NotFound.js"),
    name: "not-found",
  },
};
