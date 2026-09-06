import "@fontsource/roboto-mono/latin-300.css";
import "./styles.css";
import "./editorial.css";

import { renderArticlePage } from "./article-page";
import { articles } from "./article-content";
import { copy, documentTitles, externalUrls, footerLinks, projects, type Language } from "./content";
import { mountFootballScout } from "./football-scout";
import { mountFrenchRapRag } from "./french-rap-rag";
import { mountLolSnapshot } from "./lol-snapshot";
import { languageFromLocation, languageUrl, localizedPath, resolveRoute, type Route } from "./router";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("Application root not found");
}

const app = appElement;

type ScrollPosition = {
  windowY: number;
  viewportY: number;
};

type NavigationState = {
  portfolioScroll?: ScrollPosition;
};

const topOfPage: ScrollPosition = { windowY: 0, viewportY: 0 };
let scrollFrame: number | undefined;
let routeCleanup: (() => void) | undefined;

window.history.scrollRestoration = "manual";

function languageSwitchMarkup(language: Language, className = ""): string {
  const extraClass = className ? ` ${className}` : "";

  return `
    <div class="language-switch${extraClass}" aria-label="${copy[language].languageLabel}">
      <a data-route data-language href="${languageUrl("fr")}" lang="fr"${language === "fr" ? ' aria-current="true"' : ""}>FR</a>
      <span aria-hidden="true"> / </span>
      <a data-route data-language href="${languageUrl("en")}" lang="en"${language === "en" ? ' aria-current="true"' : ""}>EN</a>
    </div>
  `;
}

function projectMarkup(language: Language): string {
  return projects
    .map(({ index, title, href, external }) => {
      const body = `<span class="work-item__index">${index}</span><span class="work-item__title">${title}</span>`;

      if (!href) {
        return `<li class="work-item work-item--inactive" aria-disabled="true">${body}</li>`;
      }

      const destination = external ? href : localizedPath(href, language);
      const externalAttributes = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      const routeAttribute = external ? "" : " data-route";
      return `<li class="work-item"><a href="${destination}"${routeAttribute}${externalAttributes}>${body}</a></li>`;
    })
    .join("");
}

function shell(content: string, language: Language): string {
  const links = footerLinks[language]
    .map(({ label, href, download }) => {
      const externalAttributes = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
      const downloadAttribute = download ? ` download="${download}"` : "";
      return `<a href="${href}"${externalAttributes}${downloadAttribute}>${label}</a>`;
    })
    .join("");

  return `
    <div class="app-shell">
      <header class="site-header">
        ${languageSwitchMarkup(language)}
      </header>
      <main class="viewport">${content}</main>
      <footer class="site-footer" aria-label="${language === "fr" ? "Liens de contact" : "Contact links"}">
        <div class="footer-links">${links}</div>
      </footer>
    </div>
  `;
}

function notFoundMarkup(language: Language): string {
  const message = language === "fr" ? "Cette page n'existe pas." : "This page does not exist.";
  const link = language === "fr" ? "Retour à l'accueil" : "Back to the homepage";

  return `
    <div class="not-found">
      <p>${message}</p>
      <a data-route href="${localizedPath("/", language)}">${link}</a>
    </div>
  `;
}

function setMeta(selector: string, attribute: "content" | "href", value: string): void {
  const element = document.head.querySelector<HTMLElement>(selector);
  element?.setAttribute(attribute, value);
}

function updateMetadata(route: Route, language: Language): void {
  const isHome = route.kind === "home";
  const isArticle = route.kind === "article";
  const title = isArticle
    ? `${articles[route.slug][language].title} — Alex Daucourt`
    : isHome
      ? documentTitles[language]
      : language === "fr" ? "Page introuvable — Alex Daucourt" : "Page not found — Alex Daucourt";
  const description = isArticle
    ? articles[route.slug][language].intro[0]
    : language === "fr"
      ? "Ingénieur data et automatisation spécialisé en Python, SQL, intégrations de données et outils internes."
      : "Data and automation engineer focused on Python, SQL, data integrations and useful internal tools.";
  const canonicalPath = isArticle ? `/work/${route.slug}` : "/";
  const canonicalUrl = `${externalUrls.canonicalSite}${canonicalPath}`;

  document.title = title;
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", canonicalUrl);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", canonicalUrl);
  setMeta('meta[name="robots"]', "content", route.kind === "not-found" ? "noindex" : "index,follow");
}

function homepage(language: Language): string {
  const text = copy[language];

  return `
    <div class="home">
      <h1>${text.greeting}</h1>
      <section class="introduction" aria-labelledby="info-heading">
        <h2 id="info-heading" class="section-label">${text.infoLabel}</h2>
        <div class="introduction__text">
          ${text.introduction.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      </section>
      <section class="work" aria-labelledby="work-heading">
        <h2 id="work-heading" class="section-label">${text.workLabel}</h2>
        <ol class="work-list">${projectMarkup(language)}</ol>
      </section>
    </div>
  `;
}

function currentScrollPosition(): ScrollPosition {
  const viewport = app.querySelector<HTMLElement>(".viewport");
  return {
    windowY: window.scrollY,
    viewportY: viewport?.scrollTop ?? 0,
  };
}

function storeScrollPosition(position = currentScrollPosition()): void {
  const state = (window.history.state ?? {}) as NavigationState;
  window.history.replaceState({ ...state, portfolioScroll: position }, "", window.location.href);
}

function scheduleScrollStateUpdate(): void {
  if (scrollFrame !== undefined) {
    return;
  }

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = undefined;
    storeScrollPosition();
  });
}

function restoreScrollPosition(position: ScrollPosition): void {
  window.scrollTo(0, position.windowY);
  const viewport = app.querySelector<HTMLElement>(".viewport");

  if (viewport) {
    viewport.scrollTop = position.viewportY;
  }
}

function articleShell(content: string, language: Language): string {
  return `
    <div class="article-site-header">
      ${languageSwitchMarkup(language)}
    </div>
    ${content}
  `;
}

function render(scrollPosition?: ScrollPosition): void {
  routeCleanup?.();
  routeCleanup = undefined;

  const language = languageFromLocation();
  const route = resolveRoute(window.location.pathname);
  const isArticle = route.kind === "article";

  updateMetadata(route, language);

  document.documentElement.classList.toggle("route-article", isArticle);
  document.body.classList.toggle("route-article", isArticle);
  document.documentElement.lang = language;

  if (route.kind === "article") {
    app.innerHTML = articleShell(renderArticlePage(route.slug, language), language);

    if (route.slug === "lol-weekly-data-pipeline") {
      routeCleanup = mountLolSnapshot(language);
    } else if (route.slug === "football-scout-agent") {
      routeCleanup = mountFootballScout(language);
    } else if (route.slug === "french-rap-rag") {
      routeCleanup = mountFrenchRapRag(language);
    }
  } else {
    const content = route.kind === "home" ? homepage(language) : notFoundMarkup(language);
    app.innerHTML = shell(content, language);
  }

  const viewport = app.querySelector<HTMLElement>(".viewport");
  viewport?.addEventListener("scroll", scheduleScrollStateUpdate, { passive: true });

  if (scrollPosition) {
    restoreScrollPosition(scrollPosition);
  }
}

window.addEventListener("scroll", scheduleScrollStateUpdate, { passive: true });
window.addEventListener("popstate", (event) => {
  const state = event.state as NavigationState | null;
  render(state?.portfolioScroll ?? topOfPage);
});
document.addEventListener("click", (event) => {
  if (!(event instanceof MouseEvent) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const target = event.target;
  const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a[data-route]") : null;

  if (!link) {
    return;
  }

  event.preventDefault();
  const preservedScroll = currentScrollPosition();
  const isLanguageSwitch = link.hasAttribute("data-language");

  storeScrollPosition(preservedScroll);
  const nextScroll = isLanguageSwitch ? preservedScroll : topOfPage;
  window.history.pushState({ portfolioScroll: nextScroll } satisfies NavigationState, "", link.href);
  render(nextScroll);
});
render();
storeScrollPosition();
