const COPY = Object.freeze({
  en: {
    brokerLabel: "BROKER PARTNER",
    contactLabel: "START A CONVERSATION",
  },
  ar: {
    brokerLabel: "شريك الوساطة",
    contactLabel: "ابدأ محادثة",
  },
});

function currentCopy() {
  return document.documentElement.lang?.toLowerCase().startsWith("ar")
    ? COPY.ar
    : COPY.en;
}

function ensureEyebrow(section, selector, text) {
  const intro = section.querySelector(selector);
  if (!intro) return;

  let eyebrow = intro.querySelector("[data-final-section-eyebrow]");
  if (!eyebrow) {
    eyebrow = document.createElement("p");
    eyebrow.dataset.finalSectionEyebrow = "true";
    intro.prepend(eyebrow);
  }

  if (eyebrow.textContent !== text) {
    eyebrow.textContent = text;
  }
}

function observeSection(section) {
  if (section.dataset.finalRevealReady === "true") return;

  section.dataset.finalRevealReady = "true";
  const reveal = () => {
    section.dataset.finalVisible = "true";
  };

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      reveal();
      observer.disconnect();
    },
    { rootMargin: "0px 0px -12%", threshold: 0.12 },
  );

  observer.observe(section);
}

function unwrapLegacyGroup(brokers, contact) {
  // Restore the document structure when this module replaces the earlier combined layout during hot reload.
  const group = brokers.closest("[data-broker-contact-group]");
  if (!group) return;

  const host = group.parentElement;
  if (!host) return;

  host.insertBefore(brokers, group);
  host.insertBefore(contact, group);
  group.remove();
}

export function setupFinalSections() {
  const brokers = document.querySelector("#brokers");
  const contact = document.querySelector("#contact");
  if (!brokers || !contact) return;

  unwrapLegacyGroup(brokers, contact);
  const copy = currentCopy();
  brokers.dataset.finalSection = "broker";
  contact.dataset.finalSection = "contact";
  contact.dataset.scrollbarTone = "gold";

  ensureEyebrow(brokers, "[data-broker-intro]", copy.brokerLabel);
  ensureEyebrow(contact, "[data-final-cta-layout] > div", copy.contactLabel);
  observeSection(brokers);
  observeSection(contact);
}
