import { getLocale } from "./i18n.js";

const groupLabels = Object.freeze({
  en: "Decision and starting point",
  ar: "القرار ونقطة البداية",
});

export function setupDecisionAudienceGroup() {
  const hook = document.querySelector("#hook");
  const audience = document.querySelector("#audience");
  const locale = getLocale();

  if (!hook || !audience) return;

  // Both sections now sit on one navy surface, so the fixed navigation must
  // keep its light/gold treatment throughout the complete shared card.
  hook.dataset.scrollbarTone = "gold";
  audience.dataset.scrollbarTone = "gold";

  const existingCard = hook.closest("[data-decision-audience-card]");
  if (existingCard && existingCard.contains(audience)) {
    existingCard.setAttribute("aria-label", groupLabels[locale]);
    return;
  }

  document.querySelectorAll("[data-decision-audience-region]").forEach((region) => {
    if (region.contains(hook) || region.contains(audience)) {
      const parent = region.parentElement;
      const hookUnit = hook.closest(".pin-spacer") || hook;

      if (parent) {
        if (region.contains(hookUnit)) parent.insertBefore(hookUnit, region);
        if (region.contains(audience)) parent.insertBefore(audience, region);
      }
    }

    region.remove();
  });

  const hookUnit = hook.closest(".pin-spacer") || hook;
  if (hookUnit.parentElement !== audience.parentElement) return;

  const region = document.createElement("div");
  const card = document.createElement("div");

  region.className = "econs-decision-audience-region";
  region.dataset.decisionAudienceRegion = "true";
  card.className = "econs-decision-audience-card";
  card.dataset.decisionAudienceCard = "true";
  card.setAttribute("role", "group");
  card.setAttribute("aria-label", groupLabels[locale]);

  hookUnit.before(region);
  region.append(card);
  card.append(hookUnit, audience);
}
