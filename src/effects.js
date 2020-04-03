import { scrollView } from "./utils";

// Load bundle FX
const loadBundleFx = (dispatch, { action, bundlePromise, path }) =>
  bundlePromise.then(importedModule => {
    dispatch(action, {
      path,
      bundle: importedModule
    });
  });

export const LoadBundle = ({ action, bundlePromise, path }) => [
  loadBundleFx,
  { action, bundlePromise, path }
];

const historyFx = (_dispatch, { to, location }) => {
  history.pushState(null, "", to);

  if (location) {
    scrollView(location);
  }
};

export const UpdateHistory = ({ to, location }) => [
  historyFx,
  { to, location }
];
