import { Lifecycle } from "./Lifecycle";
import {
  Navigate,
  TriggerPageLoad,
  TriggerPageLoadIfGoodConnection
} from "./actions";

// Link component
export const Link = (
  { to, name, location, class: className, ...props },
  children
) => {
  return Lifecycle(
    "a",
    {
      href: to,
      onclick: [
        Navigate,
        ev => {
          ev.preventDefault();
          return to;
        }
      ],
      onmouseover: [TriggerPageLoad, to],
      oncreate: [TriggerPageLoadIfGoodConnection, to],
      ontriggerpageload: [TriggerPageLoadIfGoodConnection, to],
      class: {
        [className]: className,
        "link-active":
          location && name && location.name && location.name === name
      },
      ...props
    },
    children
  );
};
