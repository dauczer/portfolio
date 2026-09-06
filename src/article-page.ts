import {
  ArticleCode,
  ArticleBackLink,
  ArticleDemoPlaceholder,
  ArticleHeader,
  ArticleHeading3,
  ArticleImage,
  ArticleLayout,
  ArticleList,
  ArticleParagraphs,
  ArticleRichParagraph,
  ArticleSection,
  ArticleSectionIndex,
  ArticleVideo,
} from "./editorial";
import { articles, type ArticleBlock, type ArticleSlug } from "./article-content";
import type { Language } from "./content";
import { renderFootballScoutFeature } from "./football-scout";
import { renderFrenchRapRagFeature } from "./french-rap-rag";
import { renderLolSnapshotFeature } from "./lol-snapshot";
import { localizedPath } from "./router";

function renderBlock(block: ArticleBlock): string {
  switch (block.type) {
    case "paragraph":
      return ArticleParagraphs([block.text]);
    case "rich-paragraph":
      return ArticleRichParagraph(block.segments);
    case "heading-3":
      return ArticleHeading3(block.text);
    case "list":
      return ArticleList(block.items, block.ordered);
    case "code":
      return ArticleCode(block.code, block.language);
    case "image":
      return ArticleImage({ src: block.src, alt: block.alt });
    case "video":
      return ArticleVideo({ src: block.src, poster: block.poster, label: block.label });
  }
}

export function renderArticlePage(slug: ArticleSlug, language: Language): string {
  const content = articles[slug][language];
  const header = ArticleHeader({
    title: content.title,
    author: "Alex Daucourt",
    authorHref: localizedPath("/", language),
    date: content.date,
  });
  const intro = ArticleParagraphs(content.intro);
  const indexedSections = content.sections.filter((section) => section.index);
  const sectionIndex = indexedSections.length > 0
    ? ArticleSectionIndex({
      label: language === "fr" ? "Projets présentés" : "Projects featured",
      items: indexedSections.map((section) => ({
        index: section.index ?? "",
        title: section.title,
        href: `#project-${section.index}`,
      })),
    })
    : undefined;
  const feature = slug === "lol-weekly-data-pipeline"
    ? renderLolSnapshotFeature(language)
    : slug === "football-scout-agent"
      ? renderFootballScoutFeature(language)
    : slug === "french-rap-rag"
      ? renderFrenchRapRagFeature(language)
    : content.featurePlaceholder
      ? ArticleDemoPlaceholder(content.featurePlaceholder)
      : undefined;
  const sections = content.sections
    .map((section) => ArticleSection({
      title: section.title,
      id: section.index ? `project-${section.index}` : undefined,
      index: section.index,
      children: section.blocks.map(renderBlock).join(""),
    }))
    .join("");

  return ArticleLayout({
    header,
    intro,
    sectionIndex,
    feature,
    children: sections,
    note: content.note,
    contact: ArticleBackLink(
      language === "fr" ? "Retour à la page d'accueil" : "Back to the homepage",
      localizedPath("/", language),
    ),
  });
}
