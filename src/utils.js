export const isNumber = v => typeof v === "number";
export const isString = v => typeof v === "string";
export const isObject = v => typeof v === "object";
export const isPosition = pos => isNumber(pos.x) || isNumber(pos.y);

export const normalizeOffset = offset => ({
  x: isNumber(offset.x) ? offset.x : 0,
  y: isNumber(offset.y) ? offset.y : 0
});

export const normalizePosition = pos => ({
  x: isNumber(pos.x) ? pos.x : window.pageXOffset,
  y: isNumber(pos.y) ? pos.y : window.pageYOffset
});

let scrollPosition = {};
export const captureScrollPosition = () => (scrollPosition = {
  x: window.pageXOffset,
  y: window.pageYOffset
});

export const elementPosition = (el, offset) => {
  const docEl = document.documentElement;
  const docRect = docEl.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  };
};

export const scrollView = ({hash, offset, position }) => {
  if (isString(hash)) {
    const el = document.querySelector(hash);
    if (el) {
      offset =
        offset && isObject(offset)
          ? offset
          : {};
      offset = normalizeOffset(offset);
      position = elementPosition(el, offset);
    }
  } else if (isPosition(position)) {
    position = normalizePosition(position);
  }
  if (position) {
    window.scrollTo(position.x, position.y);
  }
};

export const getPathInfo = (state, path) => {
  const url = new URL(path, "https://localhost");
  const { search, pathname, searchParams, hash } = url;

  // Ignore trailing slashes EXPEPT for home page
  const withoutTrailingSlash =
    pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const routes = Object.keys(state.routes).map(route => state.routes[route]);
  const matchedRoute = routes.find(route =>
    route.pattern.match(withoutTrailingSlash)
  );
  const matchParams =
    matchedRoute && matchedRoute.pattern.match(withoutTrailingSlash);
  const loaded = matchedRoute && matchedRoute.view;

  return {
    path: withoutTrailingSlash,
    params: matchParams || {},
    query: search,
    queryParams: Object.fromEntries(searchParams.entries()),
    route: matchedRoute && matchedRoute.route, // Route pattern, ex: /products/:id
    loaded: !!loaded,
    position: scrollPosition,
    hash,
  };
};
