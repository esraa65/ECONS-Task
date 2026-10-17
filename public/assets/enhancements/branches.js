import { APP_CONFIG, SELECTORS } from "./config.js";
import { getLocale, getTranslations } from "./i18n.js";

const branchContent = Object.freeze({
  en: Object.freeze({
    eyebrow: "Regional presence",
    title: "Branches in Kuwait, Egypt, and Bahrain with clients everywhere.",
    summary:
      "Rooted in the region, working with traders and businesses wherever they are.",
    locationAction: "View location",
    mapLabel: "Minimal map showing the Econs branch region",
    countries: Object.freeze([
      Object.freeze({
        id: "kuwait",
        code: "KWT",
        name: "Kuwait",
        latitude: 29.369813660394605,
        longitude: 47.98126943707022,
      }),
      Object.freeze({
        id: "egypt",
        code: "EGY",
        name: "Egypt",
        latitude: 30.04089779150388,
        longitude: 31.24452870441047,
      }),
      Object.freeze({
        id: "bahrain",
        code: "BHR",
        name: "Bahrain",
        latitude: 26.219138342540216,
        longitude: 50.587977275232646,
      }),
    ]),
  }),
  ar: Object.freeze({
    eyebrow: "حضور إقليمي",
    title: "فروعنا في الكويت ومصر والبحرين وعملاؤنا في كل مكان.",
    summary:
      "جذورنا في المنطقة، ونعمل مع المتداولين والشركات أينما كانوا.",
    locationAction: "عرض الموقع",
    mapLabel: "خريطة مبسطة تعرض منطقة فروع إيكونز",
    countries: Object.freeze([
      Object.freeze({
        id: "kuwait",
        code: "KWT",
        name: "الكويت",
        latitude: 29.369813660394605,
        longitude: 47.98126943707022,
      }),
      Object.freeze({
        id: "egypt",
        code: "EGY",
        name: "مصر",
        latitude: 30.04089779150388,
        longitude: 31.24452870441047,
      }),
      Object.freeze({
        id: "bahrain",
        code: "BHR",
        name: "البحرين",
        latitude: 26.219138342540216,
        longitude: 50.587977275232646,
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

const MAP_VIEW_BOUNDS = Object.freeze({
  west: 26,
  east: 58,
  south: 22,
  north: 34,
});
const OPEN_FREE_MAP_STYLE =
  "https://tiles.openfreemap.org/styles/positron";

function createAttributionLink(text, href) {
  const link = createElement("a", "", text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function positionPins(map, countries, mapInstance) {
  countries.forEach((country) => {
    const pin = map.querySelector(`[data-branch-id="${country.id}"]`);
    if (!pin) return;

    const point = mapInstance.project([country.longitude, country.latitude]);
    pin.style.left = `${point.x}px`;
    pin.style.top = `${point.y}px`;
  });
}

function positionFallbackPins(map, countries) {
  countries.forEach((country) => {
    const pin = map.querySelector(`[data-branch-id="${country.id}"]`);
    if (!pin) return;

    pin.style.left = `${
      ((country.longitude - MAP_VIEW_BOUNDS.west) /
        (MAP_VIEW_BOUNDS.east - MAP_VIEW_BOUNDS.west)) *
      100
    }%`;
    pin.style.top = `${
      ((MAP_VIEW_BOUNDS.north - country.latitude) /
        (MAP_VIEW_BOUNDS.north - MAP_VIEW_BOUNDS.south)) *
      100
    }%`;
  });
}

async function createMinimalMap(map, content) {
  const canvas = createElement("div", "econs-branch-map__canvas");
  const attribution = createElement("p", "econs-branch-map__attribution");

  canvas.setAttribute("aria-hidden", "true");
  attribution.append(
    createAttributionLink(
      "© OpenStreetMap contributors",
      "https://www.openstreetmap.org/copyright",
    ),
    document.createTextNode(" · "),
    createAttributionLink("OpenFreeMap", "https://openfreemap.org/"),
  );
  map.setAttribute("aria-label", content.mapLabel);
  map.append(canvas, attribution);

  if (!window.maplibregl) {
    map.classList.add("is-map-fallback");
    positionFallbackPins(map, content.countries);
    return;
  }

  try {
    const response = await fetch(OPEN_FREE_MAP_STYLE);
    if (!response.ok) throw new Error("Map style unavailable");
    const style = await response.json();
    if (!map.isConnected) return;

    style.layers = style.layers.filter((layer) => layer.type !== "symbol");
    const mapInstance = new window.maplibregl.Map({
      container: canvas,
      style,
      bounds: [
        [MAP_VIEW_BOUNDS.west, MAP_VIEW_BOUNDS.south],
        [MAP_VIEW_BOUNDS.east, MAP_VIEW_BOUNDS.north],
      ],
      fitBoundsOptions: { padding: 18, animate: false },
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });
    const fitView = () =>
      mapInstance.fitBounds(
        [
          [MAP_VIEW_BOUNDS.west, MAP_VIEW_BOUNDS.south],
          [MAP_VIEW_BOUNDS.east, MAP_VIEW_BOUNDS.north],
        ],
        { padding: 18, animate: false },
      );
    const updatePins = () => positionPins(map, content.countries, mapInstance);

    map._econsMapLibre = mapInstance;
    mapInstance.once("load", () => {
      fitView();
      map.classList.add("is-map-loaded");
      updatePins();
    });
    mapInstance.on("resize", updatePins);
    mapInstance.on("moveend", updatePins);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        mapInstance.resize();
        fitView();
        updatePins();
      });
      observer.observe(map);
      map._econsMapResizeObserver = observer;
    }
  } catch {
    map.classList.add("is-map-fallback");
    positionFallbackPins(map, content.countries);
  }
}

function createBranchPin(country, index, content) {
  const link = createElement(
    "a",
    `econs-branch-pin econs-branch-pin--${country.id}`,
  );
  const marker = createElement("span", "econs-branch-pin__marker");
  const dot = createElement("span", "econs-branch-pin__dot");

  link.href = APP_CONFIG.mapsUrl;
  link.dataset.branchId = country.id;
  link.style.setProperty("--pin-delay", `${180 + index * 180}ms`);
  link.setAttribute(
    "aria-label",
    `${content.locationAction}: ${country.name} — ${getTranslations().branchMap}`,
  );
  marker.setAttribute("aria-hidden", "true");
  marker.append(dot);
  link.append(marker);

  return link;
}

function setupMapAnimation(map) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    map.classList.add("is-visible");
    return;
  }

  map.classList.add("is-animation-ready");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.18) {
        map.classList.add("is-visible");
        return;
      }

      if (!entry.isIntersecting) map.classList.remove("is-visible");
    },
    { threshold: [0, 0.18] },
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => observer.observe(map));
  });
}

function hideOriginalBranchesContent(section, enhancedShell) {
  Array.from(section.children).forEach((child) => {
    if (child === enhancedShell) return;

    child.dataset.econsOriginalBranches = "true";
    child.setAttribute("aria-hidden", "true");
    child.setAttribute("inert", "");
  });
}

export function localizeBranchLink() {
  const section = document.querySelector(SELECTORS.branchSection);
  if (!section) return;

  const locale = getLocale();
  const content = branchContent[locale];
  section.querySelectorAll(".econs-branch-pin").forEach((link) => {
    const country = content.countries.find(
      ({ id }) => id === link.dataset.branchId,
    );
    if (!country) return;

    link.setAttribute(
      "aria-label",
      `${content.locationAction}: ${country.name} — ${getTranslations().branchMap}`,
    );
  });
}

export function setupBranchLink() {
  const section = document.querySelector(SELECTORS.branchSection);
  const locale = getLocale();
  if (!section) return;

  const existingShell = section.querySelector(":scope > .econs-branches-shell");
  hideOriginalBranchesContent(section, existingShell);

  if (section.dataset.branchesLocale === locale && existingShell) {
    localizeBranchLink();
    return;
  }

  const content = branchContent[locale];
  const shell = createElement("div", "econs-branches-shell");
  const header = createElement("header", "econs-branches-header");
  const eyebrow = createElement("p", "econs-branches-eyebrow", content.eyebrow);
  const title = createElement("h2", "econs-branches-title", content.title);
  const summary = createElement("p", "econs-branches-summary", content.summary);
  const map = createElement("div", "econs-branch-map");

  title.id = "branches-title-refined";
  title.tabIndex = -1;
  map.append(
    ...content.countries.map((country, index) =>
      createBranchPin(country, index, content),
    ),
  );
  createMinimalMap(map, content);
  header.append(eyebrow, title, summary);
  shell.append(header, map);
  const previousMap = existingShell?.querySelector(".econs-branch-map");
  previousMap?._econsMapResizeObserver?.disconnect();
  previousMap?._econsMapLibre?.remove();
  existingShell?.remove();

  section.removeAttribute("tabindex");
  section.removeAttribute("role");
  section.removeAttribute("aria-label");
  section.dataset.refined = "true";
  section.dataset.branchesLocale = locale;
  section.setAttribute("aria-labelledby", title.id);
  section.append(shell);
  setupMapAnimation(map);
}
