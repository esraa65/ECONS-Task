import { APP_CONFIG, SELECTORS } from "./config.js";
import { getTranslations } from "./i18n.js";

export function localizeBranchLink() {
  document
    .querySelector(SELECTORS.branchSection)
    ?.setAttribute("aria-label", getTranslations().branchMap);
}

export function setupBranchLink() {
  const branchSection = document.querySelector(SELECTORS.branchSection);
  if (!branchSection || branchSection.dataset.mapEnabled === "true") return;

  const openMap = () => window.location.assign(APP_CONFIG.mapsUrl);

  branchSection.dataset.mapEnabled = "true";
  branchSection.tabIndex = 0;
  branchSection.setAttribute("role", "link");
  localizeBranchLink();

  branchSection.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    openMap();
  });

  branchSection.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openMap();
  });
}
