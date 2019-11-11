import { h } from "hyperapp";

// import serialize from 'serialize-javascript'
import { htmlToVdom } from "./htmlToVdom";

// Router component
export function Router(state, fallback = "Loading ...", notFound = "404") {
  // State pre-fetching testing
  // if (window.navigator.userAgent === 'puppeteer') {

  //   let scriptTag = document.getElementById('initial-state')

  //   if (!scriptTag) {
  //     scriptTag = document.createElement('script')
  //     document.body.appendChild(scriptTag)
  //   }

  //   scriptTag.id = 'initial-state'
  //   scriptTag.text = `
  //     window.initialState = ${serialize(state)}
  //   `
  // }

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
    // console.log('Keeping existing HTML while view loads...')
    return h("div", { id: "router-outlet" }, [
      htmlToVdom(previousOutlet.innerHTML)
    ]);
  }

  // Render a loading or intermediary fallback
  return fallback;
}
