import { Redirect as RedirectAction } from "./actions";
import {
  captureScrollPosition,
  scrollPosition,
  scrollView,
  assign,
} from "./utils";

const subFx = (a) => (b) => [a, b];

// PopState Subscription
export const PopState = subFx((dispatch, props) => {
  const handleLocationChange = () => {
    const position = assign({}, scrollPosition);
    captureScrollPosition();
    const to = window.location.pathname + window.location.search;
    dispatch([props.action, to]);
    if (to.indexOf("#") < 0) {
      scrollView({ position });
    }
  };
  addEventListener("popstate", handleLocationChange);
  return () => {
    removeEventListener("popstate", handleLocationChange);
  };
});

// Redirect Subscription
export const Redirect = subFx((dispatch, props) => {
  const handleRedirect = (ev) => {
    dispatch([RedirectAction, ev.detail]);
    dispatch([props.action, ev.detail]);
  };
  addEventListener("redirect", handleRedirect);
  return () => {
    removeEventListener("redirect", handleRedirect);
  };
});
