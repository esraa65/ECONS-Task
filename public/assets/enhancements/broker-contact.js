const GROUP_SELECTOR = "[data-broker-contact-group]";

const COPY = Object.freeze({
  en: {
    label: "Broker and contact options",
    brokerLabel: "BROKER PARTNER",
    contactLabel: "START A CONVERSATION",
  },
  ar: {
    label: "وسيط التداول وخيارات التواصل",
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

  let eyebrow = intro.querySelector("[data-combined-section-eyebrow]");
  if (!eyebrow) {
    eyebrow = document.createElement("p");
    eyebrow.dataset.combinedSectionEyebrow = "true";
    intro.prepend(eyebrow);
  }

  if (eyebrow.textContent !== text) {
    eyebrow.textContent = text;
  }
}

function observeGroup(group) {
  if (group.dataset.revealReady === "true") return;

  group.dataset.revealReady = "true";
  const reveal = () => {
    group.dataset.visible = "true";
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

  observer.observe(group);
}

export function setupBrokerContactGroup() {
  const brokers = document.querySelector("#brokers");
  const contact = document.querySelector("#contact");
  if (!brokers || !contact) return;

  let group = document.querySelector(GROUP_SELECTOR);
  let layout = group?.querySelector("[data-broker-contact-layout]");

  if (!group || !layout) {
    group = document.createElement("div");
    group.dataset.brokerContactGroup = "true";

    layout = document.createElement("div");
    layout.dataset.brokerContactLayout = "true";
    group.append(layout);

    brokers.before(group);
  }

  const copy = currentCopy();
  group.setAttribute("role", "region");
  group.setAttribute("aria-label", copy.label);

  if (brokers.parentElement !== layout) layout.append(brokers);
  if (contact.parentElement !== layout) layout.append(contact);

  ensureEyebrow(brokers, "[data-broker-intro]", copy.brokerLabel);
  ensureEyebrow(contact, "[data-final-cta-layout] > div", copy.contactLabel);
  observeGroup(group);
}
