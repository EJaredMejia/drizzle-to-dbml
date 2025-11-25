import { lazy } from "react";

// oxlint-disable-next-line no-explicit-any
export function lazyOnlyDev<T extends React.ComponentType<any>>(
  cb: () => Promise<{ default: T }>
) {
  if (import.meta.env.PROD) {
    return () => null;
  }

  return lazy(cb);
}
