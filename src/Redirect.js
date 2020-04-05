import { Navigate } from "./actions";

export const Redirect = (state, { to }) => {
  const [nextState, [next]] = Navigate(state, to);
  next(null, { to, location: nextState.location });
};
