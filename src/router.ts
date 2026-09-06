import { articleSlugs, type ArticleSlug } from "./article-content";
import type { Language } from "./content";

const articleSlugSet = new Set<string>(articleSlugs);

export type Route =
  | { kind: "home" }
  | { kind: "article"; slug: ArticleSlug }
  | { kind: "not-found" };

export function languageFromLocation(): Language {
  return new URLSearchParams(window.location.search).get("lang") === "fr" ? "fr" : "en";
}

export function languageUrl(language: Language): string {
  const url = new URL(window.location.href);

  if (language === "en") {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", language);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function localizedPath(pathname: string, language: Language): string {
  const url = new URL(pathname, window.location.origin);

  if (language === "fr") {
    url.searchParams.set("lang", "fr");
  } else {
    url.searchParams.delete("lang");
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

export function resolveRoute(pathname: string): Route {
  if (pathname === "/" || pathname === "") {
    return { kind: "home" };
  }

  const match = pathname.match(/^\/work\/([a-z0-9-]+)\/?$/);

  if (match && articleSlugSet.has(match[1])) {
    return { kind: "article", slug: match[1] as ArticleSlug };
  }

  return { kind: "not-found" };
}
