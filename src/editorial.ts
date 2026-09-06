type ArticleHeaderProps = {
  title: string;
  author: string;
  authorHref?: string;
  date: string;
};

type ArticleSectionProps = {
  title: string;
  children: string;
  id?: string;
  index?: string;
};

type ArticleLayoutProps = {
  header: string;
  intro: string;
  sectionIndex?: string;
  feature?: string;
  children: string;
  note?: string;
  contact?: string;
};

type ArticleImageProps = {
  src: string;
  alt: string;
};

type ArticleVideoProps = {
  src: string;
  poster?: string;
  label: string;
};

type ArticleSectionIndexProps = {
  label: string;
  items: readonly { index: string; title: string; href: string }[];
};

type ArticleTextSegment = {
  text: string;
  href?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function ArticleLayout({ header, intro, sectionIndex, feature, children, note, contact }: ArticleLayoutProps): string {
  const articleFeature = feature
    ? `<div class="article-feature">${feature}</div>`
    : "";
  const articleNote = note
    ? `<p class="article-note">${escapeHtml(note)}</p>`
    : "";
  const articleContact = contact
    ? `<p class="article-contact">${contact}</p>`
    : "";

  return `
    <main class="article-page">
      <article class="article-layout">
        ${header}
        <div class="article-intro">${intro}</div>
        ${sectionIndex ?? ""}
        ${articleFeature}
        <div class="article-body">${children}</div>
        ${articleNote}
        ${articleContact}
      </article>
    </main>
  `;
}

export function ArticleBackLink(label: string, href: string): string {
  return `<a data-route href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

export function ArticleHeader({ title, author, authorHref = "/", date }: ArticleHeaderProps): string {
  return `
    <header class="article-header">
      <h1>${escapeHtml(title)}</h1>
      <p class="article-metadata">
        <a data-route href="${escapeHtml(authorHref)}">${escapeHtml(author)}</a>
        <span class="article-metadata__separator" aria-hidden="true">·</span>
        <span>${escapeHtml(date)}</span>
      </p>
    </header>
  `;
}

export function ArticleSection({ title, children, id, index }: ArticleSectionProps): string {
  const idAttribute = id ? ` id="${escapeHtml(id)}"` : "";
  const indexMarkup = index
    ? `<span class="article-section__index" aria-hidden="true">${escapeHtml(index)}</span>`
    : "";

  return `
    <section class="article-section"${idAttribute}>
      <h2>${indexMarkup}${escapeHtml(title)}</h2>
      ${children}
    </section>
  `;
}

export function ArticleSectionIndex({ label, items }: ArticleSectionIndexProps): string {
  return `
    <nav class="article-section-index" aria-label="${escapeHtml(label)}">
      <ol>
        ${items.map(({ index, title, href }) => `
          <li>
            <a href="${escapeHtml(href)}">
              <span aria-hidden="true">${escapeHtml(index)}</span>
              <span>${escapeHtml(title)}</span>
            </a>
          </li>
        `).join("")}
      </ol>
    </nav>
  `;
}

export function ArticleParagraphs(paragraphs: readonly string[]): string {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

export function ArticleRichParagraph(segments: readonly ArticleTextSegment[]): string {
  const content = segments.map(({ text, href }) => {
    if (!href) {
      return escapeHtml(text);
    }

    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
  }).join("");

  return `<p>${content}</p>`;
}

export function ArticleHeading3(text: string): string {
  return `<h3>${escapeHtml(text)}</h3>`;
}

export function ArticleList(items: readonly string[], ordered = false): string {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

export function ArticleCode(code: string, language?: string): string {
  const languageAttribute = language ? ` data-language="${escapeHtml(language)}"` : "";
  return `<pre class="article-code"${languageAttribute}><code>${escapeHtml(code)}</code></pre>`;
}

export function ArticleDemoPlaceholder(text: string): string {
  return `<p class="article-demo-placeholder">${escapeHtml(text)}</p>`;
}

export function ArticleImage({ src, alt }: ArticleImageProps): string {
  return `
    <figure class="article-image">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="1600" height="1000" loading="lazy" />
    </figure>
  `;
}

export function ArticleVideo({ src, poster, label }: ArticleVideoProps): string {
  const posterAttribute = poster ? ` poster="${escapeHtml(poster)}"` : "";

  return `
    <figure class="article-image article-video">
      <video
        src="${escapeHtml(src)}"
        aria-label="${escapeHtml(label)}"
        controls
        playsinline
        preload="metadata"${posterAttribute}
      ></video>
    </figure>
  `;
}
