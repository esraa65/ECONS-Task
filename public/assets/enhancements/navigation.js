import { APP_CONFIG, SELECTORS } from "./config.js";

function getNavigationLinks() {
  return [...document.querySelectorAll(SELECTORS.navigationLinks)];
}

function focusSectionHeading(section) {
  const heading = section?.querySelector("h1, h2") ?? section;
  if (!heading) return;

  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

function updateCurrentNavigationItem() {
  const links = getNavigationLinks();
  const sectionIds = [...new Set(links.map((link) => link.hash.slice(1)))];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const viewportMarker = window.innerHeight * 0.38;
  let currentSectionId = sections[0]?.id;

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= viewportMarker) {
      currentSectionId = section.id;
    }
  }

  links.forEach((link) => {
    if (link.hash === `#${currentSectionId}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

export function focusCurrentHashTarget() {
  const id = window.location.hash.slice(1);
  if (!id) return;

  window.setTimeout(() => {
    focusSectionHeading(document.getElementById(id));
  }, APP_CONFIG.focusDelayMs);
}

export function setupNavigation() {
  const links = getNavigationLinks();
  if (!links.length) return;

  links.forEach((link) => {
    if (link.dataset.focusEnhanced === "true") return;

    link.dataset.focusEnhanced = "true";
    link.addEventListener("click", () => {
      window.setTimeout(() => {
        focusSectionHeading(document.querySelector(link.hash));
      }, APP_CONFIG.focusDelayMs);
    });
  });

  if (document.documentElement.dataset.navObserverReady === "true") return;

  document.documentElement.dataset.navObserverReady = "true";
  window.addEventListener("scroll", updateCurrentNavigationItem, { passive: true });
  window.addEventListener("resize", updateCurrentNavigationItem, { passive: true });
  updateCurrentNavigationItem();
}
