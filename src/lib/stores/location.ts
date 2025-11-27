import { derived, writable } from "svelte/store";

export function createUrlStore() {
  const href = writable(window.location.href);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  const updateHref = () => {
    return href.set(window.location.href);
  };

  history.pushState = function (...args: any[]) {
    originalPushState.apply(this, args as any);
    updateHref();
  };

  history.replaceState = function (...args: any[]) {
    originalReplaceState.apply(this, args as any);
    updateHref();
  };

  window.addEventListener("popstate", updateHref);
  window.addEventListener("hashchange", updateHref);

  return {
    subscribe: derived(href, ($href) => new URL($href)).subscribe,
  };
}

const locationStore = createUrlStore();
export default locationStore;
