import { localizeBranchLink, setupBranchLink } from "./branches.js";
import { SELECTORS } from "./config.js";
import {
  localizeFloatingControls,
  setupBackToTop,
  setupFooterCollisionAvoidance,
} from "./floating-controls.js";
import { optimizeBelowFoldImages } from "./images.js";
import { setupHero } from "./hero.js";
import { focusCurrentHashTarget, setupNavigation } from "./navigation.js";
import { setupNewsletter } from "./newsletter.js";

function initializeDynamicEnhancements() {
  setupHero();
  setupNewsletter();
  setupBranchLink();
  setupNavigation();
  setupFooterCollisionAvoidance();
  optimizeBelowFoldImages();
}

function observeLocaleChanges() {
  const observer = new MutationObserver(() => {
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
