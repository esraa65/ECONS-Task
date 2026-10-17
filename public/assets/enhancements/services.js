import { getLocale } from "./i18n.js";

const DISCORD_URL = "https://discord.gg/TYQ94xExn6";

const servicesContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "Ways we can help",
    title: "One team, five ways to help.",
    summary:
      "For traders and the businesses that serve them, with one team behind all of it.",
    tabListLabel: "Choose a service",
    joinDiscord: "Join Discord",
    services: Object.freeze([
      Object.freeze({
        id: "financial-consulting",
        title: "Financial Consulting",
        description:
          "Guidance for individuals and firms, shaped around your goals, your risk, and the decision actually in front of you, not a generic playbook. We work through the trade-offs together until the next step is yours to make.",
      }),
      Object.freeze({
        id: "marketing-consulting",
        title: "Marketing Consulting",
        description:
          "Go-to-market strategy for businesses, built to win funded, active clients rather than clicks. We help you say what you actually do, to the people it serves, without overpromising your way into a problem.",
      }),
      Object.freeze({
        id: "educational-courses",
        title: "Educational Courses",
        description:
          "Structured courses that turn market concepts into skills you actually use. You move from definitions to decisions, with each module building on the last rather than restarting the theory from scratch.",
      }),
      Object.freeze({
        id: "trading-signals",
        title: "Trading Signals",
        description:
          "Clear entries, exits, and the reasoning behind every call, built on context rather than hype. You see why a level matters before you act on it, so each trade teaches you something beyond its outcome.",
      }),
      Object.freeze({
        id: "discord-community",
        title: "Discord Community",
        description:
          "A live trading room with a real-time economic calendar and instant breaking-news alerts, so you're never the last to know. For partners, it's an engaged audience that already trusts the room.",
        action: true,
      }),
    ]),
  }),
  ar: Object.freeze({
    eyebrow: "كيف يمكننا مساعدتك",
    title: "فريق واحد، خمس طرق لمساعدتك.",
    summary: "للمتداولين وللشركات التي تخدمهم، وفريق واحد وراء كل ذلك.",
    tabListLabel: "اختر خدمة",
    joinDiscord: "انضم إلى ديسكورد",
    services: Object.freeze([
      Object.freeze({
        id: "financial-consulting",
        title: "استشارات مالية",
        description:
          "إرشاد للأفراد والشركات مبني على أهدافك ومستوى مخاطرتك والقرار الذي أمامك فعلًا، لا خطة عامة تناسب الجميع. نمرّ على الخيارات وموازناتها معًا حتى تصبح الخطوة التالية قرارك أنت.",
      }),
      Object.freeze({
        id: "marketing-consulting",
        title: "استشارات تسويقية",
        description:
          "استراتيجية دخول السوق للوسطاء وشركات التقنية المالية والعلامات المالية، هدفها عملاء نشطون بحسابات مموّلة لا مجرد نقرات. نساعدك على قول ما تقدّمه فعلًا، لمن يحتاجه، دون وعود مبالغ فيها تُوقعك في مشكلة لاحقًا.",
      }),
      Object.freeze({
        id: "educational-courses",
        title: "دورات تعليمية",
        description:
          "دورات منظمة تحوّل مفاهيم السوق إلى مهارات تستخدمها فعلاً. تنتقل من التعريفات إلى القرارات، وكل وحدة تبني على ما قبلها بدل أن تعيد شرح النظرية من البداية.",
      }),
      Object.freeze({
        id: "trading-signals",
        title: "إشارات تداول",
        description:
          "إشارات دخول وخروج واضحة، مع الأسباب وراء كل قرار، مبنية على السياق لا على التخمين. ترى لماذا يهمّ المستوى قبل أن تتحرك عليه، فتتعلّم من كل صفقة أكثر من مجرد نتيجتها.",
      }),
      Object.freeze({
        id: "discord-community",
        title: "مجتمع ديسكورد",
        description:
          "مجتمع تداول حي يضم تقويمًا اقتصاديًا لحظيًا وتنبيهات فورية بالأخبار العاجلة، لتكون دائمًا أول من يعلم. وللشركاء، هو جمهور متفاعل يثق بالمجتمع مسبقًا.",
        action: true,
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

function createServiceTab(service, index) {
  const tab = createElement("button", "econs-services-tab");
  const number = createElement(
    "span",
    "econs-services-tab__number",
    String(index + 1).padStart(2, "0"),
  );
  const title = createElement("span", "econs-services-tab__title", service.title);

  tab.type = "button";
  tab.id = `services-tab-${service.id}`;
  tab.dataset.serviceIndex = String(index);
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", `services-panel-${service.id}`);
  tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
  tab.tabIndex = index === 0 ? 0 : -1;
  number.setAttribute("aria-hidden", "true");
  tab.append(number, title);

  return tab;
}

function createServicePanel(service, index, content) {
  const panel = createElement("article", "econs-services-panel");
  const count = createElement(
    "span",
    "econs-services-panel__count",
    `${String(index + 1).padStart(2, "0")} / ${String(content.services.length).padStart(2, "0")}`,
  );
  const title = createElement("h3", "econs-services-panel__title", service.title);
  const description = createElement(
    "p",
    "econs-services-panel__description",
    service.description,
  );

  panel.id = `services-panel-${service.id}`;
  panel.dataset.serviceId = service.id;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `services-tab-${service.id}`);
  panel.tabIndex = 0;
  panel.hidden = index !== 0;
  count.setAttribute("aria-hidden", "true");
  panel.append(count, title, description);

  if (service.action) {
    const action = createElement("a", "econs-services-panel__action", content.joinDiscord);
    action.href = DISCORD_URL;
    action.target = "_blank";
    action.rel = "noopener noreferrer";
    action.setAttribute("aria-label", `${content.joinDiscord}: ${service.title}`);
    panel.append(action);
  }

  return panel;
}

function setupServiceTabs(tabList, tabs, panels, locale) {
  const activate = (nextIndex, { focus = false } = {}) => {
    tabs.forEach((tab, index) => {
      const isActive = index === nextIndex;
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
      panels[index].hidden = !isActive;
    });

    if (focus) tabs[nextIndex].focus();
  };

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-service-index]");
    if (!tab || !tabList.contains(tab)) return;
    activate(Number(tab.dataset.serviceIndex));
  });

  tabList.addEventListener("keydown", (event) => {
    const currentTab = event.target.closest("[data-service-index]");
    if (!currentTab) return;

    const currentIndex = Number(currentTab.dataset.serviceIndex);
    const lastIndex = tabs.length - 1;
    const direction = locale === "ar" ? -1 : 1;
    let nextIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    }
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - direction + tabs.length) % tabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === undefined) return;

    event.preventDefault();
    activate(nextIndex, { focus: true });
  });
}

function hideOriginalServicesContent(section, enhancedShell) {
  Array.from(section.children).forEach((child) => {
    if (child === enhancedShell) return;

    child.dataset.econsOriginalServices = "true";
    child.setAttribute("aria-hidden", "true");
    child.setAttribute("inert", "");
  });
}

export function setupServices() {
  const section = document.querySelector("#services");
  const locale = getLocale();

  if (!section) return;

  const existingShell = section.querySelector(":scope > .econs-services-shell");
  hideOriginalServicesContent(section, existingShell);

  if (section.dataset.servicesLocale === locale && existingShell) return;

  const content = servicesContent[locale];
  const shell = createElement("div", "econs-services-shell");
  const header = createElement("header", "econs-services-header");
  const eyebrow = createElement("p", "econs-services-eyebrow", content.eyebrow);
  const title = createElement("h2", "econs-services-title", content.title);
  const summary = createElement("p", "econs-services-summary", content.summary);
  const explorer = createElement("div", "econs-services-explorer");
  const tabList = createElement("div", "econs-services-tabs");
  const panelsContainer = createElement("div", "econs-services-panels");
  const tabs = content.services.map(createServiceTab);
  const panels = content.services.map((service, index) =>
    createServicePanel(service, index, content),
  );

  title.id = "services-title";
  title.tabIndex = -1;
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", content.tabListLabel);
  tabList.append(...tabs);
  panelsContainer.append(...panels);
  explorer.append(tabList, panelsContainer);

  header.append(eyebrow, title, summary);
  shell.append(header, explorer);

  existingShell?.remove();

  section.dataset.refined = "true";
  section.dataset.servicesLocale = locale;
  section.setAttribute("aria-labelledby", "services-title");
  section.append(shell);
  setupServiceTabs(tabList, tabs, panels, locale);
}
