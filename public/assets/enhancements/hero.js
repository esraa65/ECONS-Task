import { getLocale } from "./i18n.js";

const heroContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "Regional financial consulting",
    exploreServices: "Explore our services",
    panelLabel: "The consultation path",
    panelTitle: "One conversation. A clearer next move.",
    steps: Object.freeze([
      Object.freeze({ title: "Understand", description: "Start with the decision in front of you." }),
      Object.freeze({ title: "Assess", description: "Work through the options and trade-offs." }),
      Object.freeze({ title: "Advance", description: "Leave with a practical direction." }),
    ]),
    proof: Object.freeze(["Personal guidance", "Regional perspective", "Direct WhatsApp access"]),
  }),
  ar: Object.freeze({
    eyebrow: "استشارات مالية بخبرة إقليمية",
    exploreServices: "استكشف خدماتنا",
    panelLabel: "مسار الاستشارة",
    panelTitle: "محادثة واحدة. وخطوة تالية أكثر وضوحًا.",
    steps: Object.freeze([
      Object.freeze({ title: "نفهم", description: "نبدأ بالقرار الذي يشغلك الآن." }),
      Object.freeze({ title: "نقيّم", description: "نراجع الخيارات والمفاضلات معًا." }),
      Object.freeze({ title: "نتقدّم", description: "تنهي المحادثة باتجاه عملي وواضح." }),
    ]),
    proof: Object.freeze(["توجيه شخصي", "خبرة إقليمية", "تواصل مباشر عبر واتساب"]),
  }),
});

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function createConsultationPanel(content) {
  const panel = createElement("aside", "econs-hero-panel");
  panel.setAttribute("aria-label", content.panelLabel);

  const label = createElement("p", "econs-hero-panel__label", content.panelLabel);
  const title = createElement("p", "econs-hero-panel__title", content.panelTitle);
  const list = createElement("ol", "econs-hero-panel__steps");

  content.steps.forEach((step, index) => {
    const item = createElement("li", "econs-hero-panel__step");
    const number = createElement("span", "econs-hero-panel__number", String(index + 1).padStart(2, "0"));
    const copy = createElement("span", "econs-hero-panel__copy");
    copy.append(
      createElement("strong", "econs-hero-panel__step-title", step.title),
      createElement("span", "econs-hero-panel__description", step.description),
    );
    item.append(number, copy);
    list.append(item);
  });

  panel.append(label, title, list);
  return panel;
}

function createProofList(content) {
  const list = createElement("ul", "econs-hero-proof");
  list.setAttribute("aria-label", content.eyebrow);

  content.proof.forEach((item) => {
    const listItem = createElement("li", "econs-hero-proof__item");
    listItem.append(createElement("span", "econs-hero-proof__dot"), document.createTextNode(item));
    list.append(listItem);
  });

  return list;
}

export function setupHero() {
  const hero = document.querySelector("#home");
  const layout = hero?.querySelector(".hero-layout");
  const copy = hero?.querySelector("[data-hero-copy]");
  const actions = hero?.querySelector("[data-hero-actions]");
  const primaryAction = actions?.querySelector("a");

  if (!hero || !layout || !copy || !actions || !primaryAction || hero.dataset.refined === "true") {
    return;
  }

  const content = heroContent[getLocale()];
  const eyebrow = createElement("p", "econs-hero-eyebrow", content.eyebrow);
  const secondaryAction = createElement("a", "econs-hero-secondary-action", content.exploreServices);
  secondaryAction.href = "#services";

  hero.dataset.refined = "true";
  primaryAction.classList.add("econs-hero-primary-action");
  copy.prepend(eyebrow);
  actions.append(secondaryAction);
  copy.append(createProofList(content));
  layout.append(createConsultationPanel(content));
}
