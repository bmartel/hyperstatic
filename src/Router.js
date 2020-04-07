import { h } from "hyperapp";
import { htmlToVdom } from "./htmlToVdom";

const id = "router-outlet";

const RouterOutlet = (children) => h("div", { id }, children);

// the previous router outlet that rendered or a fallback
const previousOutlet = (fallback, notFound, skipPrevious = false) => {
  if (skipPrevious) {
    return RouterOutlet([notFound]);
  }
  const outlet = document.getElementById(id);
  if (outlet) {
    return RouterOutlet([htmlToVdom(outlet.innerHTML)]);
  }
  return RouterOutlet([fallback]);
};

// Router component
export function Router(
  state,
  fallback = "Loading ...",
  notFound = "Page Not Found"
) {
  try {
    const matchedRoute = state.routes[state.location.route];

    // check matchedRoute for component and optionally a guard condition
    let { component, guard } = matchedRoute;
    if (!component) {
      component = matchedRoute;
    }

    console.log(component);
    let next = null;
    // Render a notFound component when route is unmatched or failed guard condition
    // if next is false render the previousOutlet, if true render the fallback
    // otherwise use the return of next as fallback
    if (!component || (guard && (next = guard(state)) !== undefined)) {
      return typeof next !== "boolean"
        ? next
        : previousOutlet(fallback, notFound, next);
    }

    const pageData = state.pageData[state.location.path];

    // Render the loaded page component
    if (
      (component.view && !component.initAction) ||
      (pageData && pageData.initiated)
    ) {
      return RouterOutlet([component.view(state)]);
    }

    // Render a loading or intermediary fallback or previousOutlet
    return previousOutlet(fallback, notFound);
  } catch (err) {
    return RouterOutlet([notFound]);
  }
}
