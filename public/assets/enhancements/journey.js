import { getLocale } from "./i18n.js";

const journeyContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "How it works",
    title: "You won't be deciding alone.",
    summary:
      "Here's how we work with you, trader or business, from the first conversation onward.",
    steps: Object.freeze([
      Object.freeze({
        title: "Start with a conversation",
        description:
          "Reach out on WhatsApp and tell us what you need. No forms, no account to create. Just tell us where you are.",
      }),
      Object.freeze({
        title: "We set a time that works",
        description:
          "Share a few details and pick a time. It's confirmed right there in the chat. No separate booking system, no waiting on a callback.",
      }),
      Object.freeze({
        title: "You meet a consultant",
        description:
          "At a branch or on a call, someone who listens to your situation and gives guidance built around it, not a script.",
      }),
      Object.freeze({
        title: "And the support continues",
        description:
          "Live sessions, timely updates, and a community that's there between conversations. The relationship doesn't end at the call.",
      }),
    ]),
  }),
  ar: Object.freeze({
    eyebrow: "كيف نعمل",
    title: "لن تقرر وحدك.",
    summary:
      "إليك كيف نعمل معك، متداولًا كنت أو شركة، بدءًا من محادثتنا الأولى وما بعدها.",
    steps: Object.freeze([
      Object.freeze({
        title: "ابدأ بمحادثة",
        description:
          "راسلنا عبر الواتساب وأخبرنا بما تحتاجه. من دون نماذج أو إنشاء حساب. فقط أخبرنا أين أنت الآن.",
      }),
      Object.freeze({
        title: "نحدد لك موعدًا يناسبك",
        description:
          "شاركنا بعض التفاصيل واختر موعدًا، ويُؤكَّد الموعد في المحادثة نفسها، بلا نظام حجز منفصل، وبلا انتظار لمكالمة لاحقة.",
      }),
      Object.freeze({
        title: "تلتقي باستشاري",
        description:
          "في أحد فروعنا أو عبر مكالمة، شخص يستمع إلى وضعك ويقدّم إرشادًا مبنيًا عليه، لا وفق نص جاهز.",
      }),
      Object.freeze({
        title: "والدعم يستمر",
        description:
          "جلسات مباشرة، وتحديثات في وقتها، ومجتمع حاضر بين المحادثات. العلاقة لا تنتهي عند المكالمة.",
      }),
    ]),
  }),
});

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function createJourneyStep(step, index) {
  const item = createElement("li", "econs-journey-step");
  const number = createElement(
    "span",
    "econs-journey-step__number",
    String(index + 1).padStart(2, "0"),
  );
  const content = createElement("div", "econs-journey-step__content");
  const title = createElement("h3", "econs-journey-step__title", step.title);
  const description = createElement(
    "p",
    "econs-journey-step__description",
    step.description,
  );

  number.setAttribute("aria-hidden", "true");
  content.append(title, description);
  item.append(number, content);

  return item;
}

function hideOriginalJourneyContent(section, enhancedShell) {
  Array.from(section.children).forEach((child) => {
    if (child === enhancedShell) return;

    child.dataset.econsOriginalJourney = "true";
    child.setAttribute("aria-hidden", "true");
    child.setAttribute("inert", "");
  });
}

function setupJourneyAnimation(shell) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    shell.classList.add("is-visible");
    return;
  }

  shell.classList.add("is-animation-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          shell.classList.add("is-visible");
          return;
        }

        if (!entry.isIntersecting) shell.classList.remove("is-visible");
      });
    },
    {
      rootMargin: "0px 0px -10%",
      threshold: 0.12,
    },
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => observer.observe(shell));
  });
}

export function setupJourney() {
  const section = document.querySelector("#journey");
  const locale = getLocale();

  if (!section) return;

  const existingShell = section.querySelector(":scope > .econs-journey-shell");
  hideOriginalJourneyContent(section, existingShell);

  if (section.dataset.journeyLocale === locale && existingShell) return;

  const content = journeyContent[locale];
  const shell = createElement("div", "econs-journey-shell");
  const header = createElement("header", "econs-journey-header");
  const eyebrow = createElement("p", "econs-journey-eyebrow", content.eyebrow);
  const title = createElement("h2", "econs-journey-title", content.title);
  const summary = createElement("p", "econs-journey-summary", content.summary);
  const roadmap = createElement("ol", "econs-journey-roadmap");

  title.id = "journey-title-refined";
  title.tabIndex = -1;
  roadmap.append(...content.steps.map(createJourneyStep));
  header.append(eyebrow, title, summary);
  shell.append(header, roadmap);

  existingShell?.remove();

  section.dataset.refined = "true";
  section.dataset.journeyLocale = locale;
  section.setAttribute("aria-labelledby", title.id);
  section.append(shell);
  setupJourneyAnimation(shell);
}
