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

const historyFx = (dispatch, { to, position }) => {
  history.pushState(null, "", to);

  if (position) {
    window.scrollTo(position.x, position.y);
  } else {
    window.scrollTo(0, 0);
  }
};

export const UpdateHistory = ({ to }) => [historyFx, { to }];
