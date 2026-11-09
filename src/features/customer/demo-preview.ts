"use client";

import { useSyncExternalStore } from "react";

const storageKey = "doybi-customer-demo-preview";
const changeEvent = "doybi:demo-preview-change";

export function isDemoPreviewEnabled() {
  return typeof window !== "undefined" && window.sessionStorage.getItem(storageKey) === "enabled";
}

function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useDemoPreview() {
  return useSyncExternalStore(subscribe, isDemoPreviewEnabled, () => false);
}

export function enableDemoPreview() {
  window.sessionStorage.setItem(storageKey, "enabled");
  window.dispatchEvent(new Event(changeEvent));
}

export function disableDemoPreview() {
  window.sessionStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(changeEvent));
}
