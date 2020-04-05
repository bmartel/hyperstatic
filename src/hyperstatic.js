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

  // Merge user init with hyperstatic init
  if (Array.isArray(userInit)) {
    init = [
      ParseUrl(
        { ...init, ...userInit[0] },
        window.location.pathname + window.location.search
      ),
      userInit[1],
    ];
  } else {
    init = ParseUrl(
      { ...init, ...userInit },
      window.location.pathname + window.location.search
    );
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

  // logging middleware
  if (process.env.NODE_ENV !== "production") {
    import("hypermiddleware").then(({ middleware, loggerMiddleware }) => {
      appConfig.middleware = middleware(
        [loggerMiddleware, appConfig.middleware].filter(Boolean)
      );
    });
  }

  // Initialize hyperapp
  app(appConfig);

  // I added this because there is no oncreate event when re-hydrating existing html (which is the expected behavior)
  setTimeout(() => {
    document.querySelectorAll("a").forEach((link) => {
      link.dispatchEvent(new CustomEvent("triggerpageload"));
    });
  }, 75);
};
