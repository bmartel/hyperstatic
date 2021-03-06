import { LoadBundle, UpdateHistory, historyFx } from "./effects";

import { getPathInfo } from "./utils";

export const Redirect = (state, to) => ({
  ...state,
  redirect: to,
});

export const ParseUrl = (state, path) => {
  // Set location params
  const pathInfo = getPathInfo(state, path);
  const next = {
    ...state,
    redirect: null,
    location: pathInfo,
  };

  // If route exists and isn't loaded, load it
  return pathInfo.route && !pathInfo.loaded
    ? TriggerPageLoad(next, pathInfo.path)
    : next;
};

const BundleLoaded = (state, { path, bundle }) => {
  const routes = Object.keys(state.routes).map((route) => state.routes[route]);
  const matchedRoute = routes.find((route) => route.pattern.match(path));

  const withBundleLoaded = {
    ...state,
    routes: {
      ...state.routes,
      [matchedRoute.route]: {
        ...matchedRoute,
        view: bundle.default,
        initAction: bundle.Init,
        loading: false,
      },
    },
  };

  if (bundle.Init) {
    const markedAsInitiated = {
      ...withBundleLoaded,
      pageData: {
        ...withBundleLoaded.pageData,
        [path]: {
          ...withBundleLoaded.pageData[path],
          initiated: true,
        },
      },
    };

    return bundle.Init(markedAsInitiated, getPathInfo(withBundleLoaded, path));
  }

  return withBundleLoaded;
};

// Navigate action
export const Navigate = (state, to) => {
  if (window.location.pathname === to) {
    return state;
  }

  const next = ParseUrl(state, to);

  if (state.redirect) {
    historyFx(null, { to });
    return next;
  }

  return [next, UpdateHistory({ to })];
};

export const TriggerPageLoadIfGoodConnection = (state, path) => {
  if (state.goodConnection) {
    return TriggerPageLoad(state, path);
  }

  return state;
};

export const TriggerPageLoad = (state, path) => {
  const routes = Object.keys(state.routes).map((route) => state.routes[route]);
  const matchedRoute = routes.find((route) => route.pattern.match(path));

  const pageData = state.pageData[path];

  if (matchedRoute && !matchedRoute.view && !matchedRoute.loading) {
    return [
      {
        ...state,
        routes: {
          ...state.routes,
          [matchedRoute.route]: {
            ...matchedRoute,
            loading: true,
          },
        },
      },
      LoadBundle({
        path,
        action: BundleLoaded,
        bundlePromise: matchedRoute.bundlePromise,
      }),
    ];
  }

  if (
    matchedRoute &&
    matchedRoute.view &&
    !pageData &&
    matchedRoute.initAction
  ) {
    return matchedRoute.initAction({
      ...state,
      pageData: {
        ...state.pageData,
        [path]: {
          ...pageData,
          initiated: true,
        },
      },
    });
  }

  return state;
};
