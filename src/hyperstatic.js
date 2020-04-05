import { app } from "hyperapp";
import { PopState } from "./subscriptions";
import { ParseUrl } from "./actions";
import { buildRoutesObject } from "./buildRoutesObject";

export const hyperstatic = ({
  routes,
  init: userInit,
  view,
  subscriptions: userSubs,
  node,
  middleware: userMiddleware,
}) => {
  // TODO: use something more reliable
  const connSpeed = navigator.connection ? navigator.connection.downlink : 10;
  const goodConnection =
    window.navigator.userAgent === "puppeteer" ? false : connSpeed > 2;

  let init = {
    goodConnection,
    routes: buildRoutesObject(routes),
    pageData: {},
  };

  const url = window.location.pathname + window.location.search;
  // Merge user init with hyperstatic init
  if (Array.isArray(userInit)) {
    const next = ParseUrl(init, url);
    if (Array.isArray(next)) {
      init = [{ ...next[0], ...userInit[0] }, [next[1], userInit[1]]];
    } else {
      init = [next, userInit];
    }
  } else {
    init = ParseUrl({ ...init, ...userInit }, url);
  }

  const appConfig = {
    init,

    // Use view as-is
    view,

    // Add a subscription to the sub array
    subscriptions: (state) => {
      const subs = userSubs ? userSubs(state) : [];

      return subs.concat([PopState({ action: ParseUrl })]);
    },

    // Define user middleware
    middleware: userMiddleware,

    node,
  };

  // Initialize hyperapp
  if (process.env.NODE_ENV !== "production") {
    // logging middleware
    import("hypermiddleware").then(({ middleware, loggerMiddleware }) => {
      appConfig.middleware = middleware(
        [loggerMiddleware, appConfig.middleware].filter(Boolean)
      );
      app(appConfig);
    });
  } else {
    app(appConfig);
  }

  // I added this because there is no oncreate event when re-hydrating existing html (which is the expected behavior)
  setTimeout(() => {
    document.querySelectorAll("a").forEach((link) => {
      link.dispatchEvent(new CustomEvent("triggerpageload"));
    });
  }, 75);
};
