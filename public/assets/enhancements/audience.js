import { getLocale } from "./i18n.js";

const audienceContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "Who it's for",
    title: "Where are you starting?",
    startingPoints: Object.freeze([
      "New to investing?",
      "Already active in the markets?",
      "Building a brand?",
    ]),
    closing: "Your path starts here.",
  }),
  ar: Object.freeze({
    eyebrow: "لمن نقدّم خدماتنا",
    title: "من أين تبدأ؟",
    startingPoints: Object.freeze([
      "جديد في عالم الاستثمار؟",
      "نشط بالفعل في الأسواق؟",
      "تبني علامة تجارية؟",
    ]),
    closing: "مسارك يبدأ هنا.",
  }),
});

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function createStartingPoint(label, index) {
  const item = createElement("li", "econs-audience-path");
  const number = createElement(
    "span",
    "econs-audience-path__number",
    String(index + 1).padStart(2, "0"),
  );
  const title = createElement("span", "econs-audience-path__title", label);

  number.setAttribute("aria-hidden", "true");
  item.append(number, title);
  return item;
}

export function setupAudience() {
  const section = document.querySelector("#audience");
  const locale = getLocale();

  if (
    !section ||
    (section.dataset.audienceLocale === locale &&
      section.querySelector(":scope > .econs-audience-shell"))
  ) {
    return;
  }

  const content = audienceContent[locale];
  const shell = createElement("div", "econs-audience-shell");
  const introduction = createElement("header", "econs-audience-introduction");
  const eyebrow = createElement("p", "econs-audience-eyebrow", content.eyebrow);
  const title = createElement("h2", "econs-audience-title", content.title);
  const closing = createElement("p", "econs-audience-closing", content.closing);
  const list = createElement("ol", "econs-audience-paths");

  title.id = "audience-title";
  title.tabIndex = -1;
  content.startingPoints.forEach((point, index) => {
    list.append(createStartingPoint(point, index));
  });

  introduction.append(eyebrow, title, closing);
  shell.append(introduction, list);

  section.querySelector(":scope > .econs-audience-shell")?.remove();
  Array.from(section.children).forEach((child) => {
    child.dataset.econsOriginalAudience = "true";
    child.setAttribute("aria-hidden", "true");
    child.setAttribute("inert", "");
  });

  section.dataset.refined = "true";
  section.dataset.audienceLocale = locale;
  section.setAttribute("aria-labelledby", "audience-title");
  section.append(shell);
}
