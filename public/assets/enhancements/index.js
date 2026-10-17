import { localizeBranchLink, setupBranchLink } from "./branches.js?v=openfreemap-2";
import { setupAudience } from "./audience.js";
import { setupBrokerContactGroup } from "./broker-contact.js?v=combined-2";
import { SELECTORS } from "./config.js";
import { setupDecisionAudienceGroup } from "./decision-audience.js";
import {
  localizeFloatingControls,
  setupBackToTop,
  setupFooterCollisionAvoidance,
} from "./floating-controls.js";
import { optimizeBelowFoldImages } from "./images.js";
import { setupHero } from "./hero.js";
import { setupHook } from "./hook.js";
import { setupJourney } from "./journey.js?v=roadmap-motion-4";
import { focusCurrentHashTarget, setupNavigation } from "./navigation.js";
import { setupNewsletter } from "./newsletter.js";
import { setupServices } from "./services.js?v=selector-3";

function initializeDynamicEnhancements() {
  setupHero();
  setupHook();
  setupAudience();
  setupDecisionAudienceGroup();
  setupServices();
  setupJourney();
  setupNewsletter();
  setupBranchLink();
  setupBrokerContactGroup();
  setupNavigation();
  setupFooterCollisionAvoidance();
  optimizeBelowFoldImages();
}

function observeLocaleChanges() {
  const observer = new MutationObserver(() => {
    setupHook();
    setupAudience();
    setupDecisionAudienceGroup();
    setupServices();
    setupJourney();
    setupBranchLink();
    setupBrokerContactGroup();
    localizeFloatingControls();
    localizeBranchLink();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "dir"],
  });
}

function observeApplicationRoot() {
  const root = document.querySelector(SELECTORS.root);
  if (!root) return;

  new MutationObserver(initializeDynamicEnhancements).observe(root, {
    childList: true,
    subtree: true,
  });
}

window.addEventListener("hashchange", focusCurrentHashTarget);

localizeFloatingControls();
setupBackToTop();
initializeDynamicEnhancements();
observeLocaleChanges();
observeApplicationRoot();
