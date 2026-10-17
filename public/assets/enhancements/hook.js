import { getLocale } from "./i18n.js";

const hookContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "The question before the decision",
    context: "Before you risk capital, every client faces one question.",
    question: "Are you deciding alone?",
    alternative: "Or with people who've already been there?",
  }),
  ar: Object.freeze({
    eyebrow: "السؤال الذي يسبق القرار",
    context: "قبل أن تخاطر برأس مالك، يواجه كل عميل السؤال نفسه.",
    question: "هل تقرر وحدك؟",
    alternative: "أم مع مَن سبقوك إلى هذا الطريق؟",
  }),
});

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

export function setupHook() {
  const section = document.querySelector("#hook");
  const container = section?.querySelector("[data-hook-copy]");
  const locale = getLocale();

  if (!section || !container || section.dataset.hookLocale === locale) return;

  const content = hookContent[locale];
  const panel = createElement("div", "econs-hook-panel");
  const introduction = createElement("div", "econs-hook-introduction");
  const eyebrow = createElement("p", "econs-hook-eyebrow", content.eyebrow);
  const context = createElement("p", "econs-hook-context", content.context);
  const title = createElement("h2", "econs-hook-title");
  const question = createElement("span", "econs-hook-title__question", content.question);
  const alternative = createElement(
    "span",
    "econs-hook-title__alternative",
    content.alternative,
  );

  title.id = "hook-title";
  title.tabIndex = -1;
  introduction.append(eyebrow, context);
  title.append(question, alternative);
  panel.append(introduction, title);

  section.dataset.refined = "true";
  section.dataset.hookLocale = locale;
  container.replaceChildren(panel);
}
