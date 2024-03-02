import { Homepage } from "./components/Homepage";
import { CategoryPage } from "./components/CategoryPage";
import { ModelViewerPage } from "./components/ModelViewerPage";
import { clearApp } from "./main";

function getPathSegments(url) {
  const trimmed = url.replace(/^\/+|\/+$/g, "");
  return trimmed.split("/");
}

function matchRoute(routes, urlSegments) {
  for (const route of routes) {
    const routeSegments = getPathSegments(route.path);
    if (routeSegments.length !== urlSegments.length) {
      continue;
    }

    const params = {};
    const match = routeSegments.every((segment, i) => {
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = urlSegments[i];
        return true;
      }
      return segment === urlSegments[i];
    });

    if (match) {
      return { route, params };
    }
  }
  return null;
}

export const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

export const router = () => {
  const routes = [
    { path: "/", view: Homepage },
    { path: "/category/:categoryName/models", view: CategoryPage },
    { path: "/model/:id", view: ModelViewerPage },
  ];

  const urlSegments = getPathSegments(window.location.pathname);
  const match = matchRoute(routes, urlSegments);

  if (match) {
    const { route, params } = match;
    route.view(params);
  } else {
    clearApp();
    document.querySelector("#app").innerHTML = `
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist. <a href="/" data-link>Go back home</a>.</p>
        `;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});
