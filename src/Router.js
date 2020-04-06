import { h } from "hyperapp";
import { htmlToVdom } from "./htmlToVdom";

const RouterOutlet = (children) => h("div", { id: "router-outlet" }, children);

// Router component
export function Router(
  state,
  fallback = "Loading ...",
  notFound = "Page Not Found"
) {
  try {
    if (state.redirect) {
      return RouterOutlet([fallback]);
    }

    const matchedRoute = state.routes[state.location.route];

    let { component, guard } = matchedRoute;

    if (!component) {
      component = matchedRoute;
    }

    // Render a notFound component when route is unmatched or failed guard condition
    if (!component || (guard && !guard(state))) {
      return RouterOutlet([notFound]);
    }

    const pageData = state.pageData[state.location.path];

    if (
      (component.view && !component.initAction) ||
      (pageData && pageData.initiated)
    ) {
      return RouterOutlet([component.view(state)]);
    }

    const previousOutlet = document.getElementById("router-outlet");
    if (previousOutlet) {
      return RouterOutlet([htmlToVdom(previousOutlet.innerHTML)]);
    }

    // Render a loading or intermediary fallback
    return RouterOutlet([fallback]);
  } catch (err) {
    return RouterOutlet([notFound]);
  }
}
