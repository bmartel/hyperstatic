import { redirectTo } from "./utils";

// Load bundle FX
const loadBundleFx = (dispatch, { action, bundlePromise, path }) =>
  bundlePromise.then((importedModule) => {
    dispatch(action, {
      path,
      bundle: importedModule,
    });
  });

export const LoadBundle = ({ action, bundlePromise, path }) => [
  loadBundleFx,
  { action, bundlePromise, path },
];

export const historyFx = (_dispatch, { to }) => {
  history.pushState(null, "", to);
};

export const UpdateHistory = ({ to }) => [historyFx, { to }];

const redirectFx = (_dispatch, { to }) => {
  redirectTo(to);
};

export const Redirect = ({ to }) => [redirectFx, { to }];
