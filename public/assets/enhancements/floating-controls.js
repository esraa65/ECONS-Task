import { APP_CONFIG, SELECTORS } from "./config.js";
import { getTranslations } from "./i18n.js";

export function localizeFloatingControls() {
  const translations = getTranslations();
  const whatsapp = document.querySelector(SELECTORS.whatsapp);
  const backToTop = document.querySelector(SELECTORS.backToTop);

  if (whatsapp) {
    whatsapp.href = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(translations.whatsappMessage)}`;
    whatsapp.setAttribute("aria-label", translations.whatsappLabel);
    whatsapp.title = translations.whatsappTooltip;
    whatsapp.dataset.tooltip = translations.whatsappTooltip;
  }

  if (backToTop) {
    backToTop.setAttribute("aria-label", translations.backToTop);
    backToTop.title = translations.backToTop;
    backToTop.dataset.tooltip = translations.backToTop;
  }
}

export function setupBackToTop() {
  const backToTop = document.querySelector(SELECTORS.backToTop);
  if (!backToTop || backToTop.dataset.enhanced === "true") return;

  const updateVisibility = () => {
    const visible = window.scrollY > Math.max(600, window.innerHeight * 0.8);
    backToTop.dataset.visible = String(visible);
    backToTop.setAttribute("aria-hidden", String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  };

  backToTop.dataset.enhanced = "true";
  backToTop.addEventListener("click", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

    window.setTimeout(() => {
      const heading = document.querySelector("#home h1");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }, 0);
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
}

export function setupFooterCollisionAvoidance() {
  const whatsapp = document.querySelector(SELECTORS.whatsapp);
  const footer = document.querySelector(SELECTORS.footer);

  if (
    !whatsapp ||
    !footer ||
    whatsapp.dataset.footerObserverReady === "true" ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  whatsapp.dataset.footerObserverReady = "true";
  new IntersectionObserver(
    ([entry]) => {
      whatsapp.dataset.footerOverlap = String(entry.isIntersecting);
    },
    { threshold: 0.08 },
  ).observe(footer);
}
