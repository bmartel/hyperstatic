import { captureScrollPosition } from "./utils";

// PopState Subscription
const subFx = a => b => [a, b];

export const PopState = subFx((dispatch, props) => {
  const handleLocationChange = ev => {
    captureScrollPosition();
    dispatch([props.action, window.location.pathname + window.location.search]);
  };
  addEventListener("popstate", handleLocationChange);
  return () => {
    removeEventListener("popstate", handleLocationChange);
  };
});
