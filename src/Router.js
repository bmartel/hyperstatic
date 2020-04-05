import { h } from "hyperapp";

import { htmlToVdom } from "./htmlToVdom";

// Router component
export function Router(
  state,
  fallback = "Loading ...",
  notFound = "Page Not Found"
) {
  try {
    const matchedRoute = state.routes[state.location.route];

    let { component, guard } = matchedRoute;

    if (!component) {
      component = matchedRoute;
    }

    // Render a notFound component when route is unmatched or failed guard condition
    if (!component || (guard && !guard(state))) {
      return notFound;
    }

    const pageData = state.pageData[state.location.path];

    if (component.view) {
      if (!component.initAction) {
        return h("div", { id: "router-outlet" }, [component.view(state)]);
      } else {
        if (pageData && pageData.initiated) {
          return h("div", { id: "router-outlet" }, [component.view(state)]);
        }
      }
    }

    const previousOutlet = document.getElementById("router-outlet");
    if (previousOutlet) {
      return h("div", { id: "router-outlet" }, [
        htmlToVdom(previousOutlet.innerHTML),
      ]);
    }
    // Render a loading or intermediary fallback
    return fallback;
  } catch (err) {
    return notFound;
  }
}
