import { SELECTORS } from "./config.js";
import { getTranslations } from "./i18n.js";
import { showToast } from "./toast.js";

function validateEmail(input) {
  const translations = getTranslations();
  input.setCustomValidity("");

  if (!input.value.trim()) {
    return translations.emailRequired;
  }

  if (!input.validity.valid) {
    return translations.emailInvalid;
  }

  return "";
}

export function setupNewsletter() {
  const newsletter = document.querySelector(SELECTORS.newsletter);
  if (!newsletter || newsletter.dataset.enhanced === "true") return;

  const input = newsletter.querySelector('input[type="email"]');
  const button = newsletter.querySelector("button");
  if (!input || !button) return;

  newsletter.dataset.enhanced = "true";
  input.disabled = false;
  input.required = true;
  input.autocomplete = "email";
  input.inputMode = "email";
  button.disabled = false;

  input.addEventListener("input", () => {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const validationMessage = validateEmail(input);

    if (validationMessage) {
      input.setCustomValidity(validationMessage);
      input.setAttribute("aria-invalid", "true");
      input.reportValidity();
      showToast(validationMessage);
      return;
    }

    input.removeAttribute("aria-invalid");
    showToast(getTranslations().unavailable);
  });
}
