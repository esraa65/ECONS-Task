import { APP_CONFIG, SELECTORS } from "./config.js";

let dismissTimer;

export function showToast(message) {
  const toast = document.querySelector(SELECTORS.toast);
  if (!toast) return;

  window.clearTimeout(dismissTimer);
  toast.textContent = message;
  toast.dataset.visible = "true";

  dismissTimer = window.setTimeout(() => {
    toast.dataset.visible = "false";
  }, APP_CONFIG.toastDurationMs);
}
