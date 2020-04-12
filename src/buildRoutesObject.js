import UrlPattern from "url-pattern";

// Build routes object
export const buildRoutesObject = routes =>
  Object.keys(routes).reduce(
    (routesObj, route) => {
      let { component: bundlePromise, guard, name } = routes[route];
      if (!bundlePromise) {
        bundlePromise = routes[route];
      }
      return {
        ...routesObj,
        [route]: {
          ...routesObj[route],
          route,
          bundlePromise,
          guard,
          name,
          pattern: new UrlPattern(route)
        }
      };
    },
    window.initialState ? window.initialState.routes : {}
  );
