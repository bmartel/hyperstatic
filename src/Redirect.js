import { Navigate } from "./actions";

export const Redirect = to => {
  const [_, [next]] = Navigate({}, to);
  next(null, { to });
};
