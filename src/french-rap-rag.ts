import { externalUrls, type Language } from "./content";

export const FRENCH_RAP_RAG_API_URL = externalUrls.frenchRapRagApi;

type RagArtist = {
  slug: string;
  name: string;
};

type RagSource = {
  id: string;
  artist: string;
  title: string;
  album: string | null;
  year: string | null;
};

type RagResponse = {
  status: "answered" | "insufficient";
  mode: "single" | "compare" | "global";
  answer: string;
  artists: RagArtist[];
  sources: RagSource[];
  request_id: string;
};

const demoCopy = {
  en: {
    title: "Explore the lyrics",
    meta: "3,400 tracks · 22 artists",
    questionPlaceholder: "Which artists write about solitude, and how?",
    submit: "Ask",
    submitting: "Searching…",
    required: "Enter a question before submitting.",
    loading: "Searching the corpus and generating an answer. The first request may take around 30 seconds.",
    insufficient: "Insufficient corpus",
    sources: "Tracks cited",
    scope: "Scope",
    scopeGlobal: "All 22 artists",
    rateLimited: "The public demo is limited to three generations per minute. Please wait before trying again.",
    providerUnavailable: "A model provider is temporarily unavailable. Please try again later.",
    invalidResponse: "The API returned an invalid response.",
    networkError: "The demo could not reach the API. Please try again later.",
  },
  fr: {
    title: "Explorer les paroles",
    meta: "3 400 morceaux · 22 artistes",
    questionPlaceholder: "Quels artistes parlent de solitude, et comment ?",
    submit: "Interroger",
    submitting: "Recherche…",
    required: "Saisissez une question avant de l’envoyer.",
    loading: "Recherche dans le corpus et génération de la réponse. La première requête peut durer environ 30 secondes.",
    insufficient: "Corpus insuffisant",
    sources: "Morceaux cités",
    scope: "Périmètre",
    scopeGlobal: "Les 22 artistes",
    rateLimited: "La démo publique est limitée à trois générations par minute. Attendez avant de réessayer.",
    providerUnavailable: "Un fournisseur de modèle est temporairement indisponible. Réessayez plus tard.",
    invalidResponse: "L’API a renvoyé une réponse invalide.",
    networkError: "La démo n’a pas pu joindre l’API. Réessayez plus tard.",
  },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === null || value === undefined || typeof value === "string";
}

function isArtist(value: unknown): value is RagArtist {
  return isRecord(value)
    && isNonEmptyString(value.slug)
    && isNonEmptyString(value.name);
}

function isSource(value: unknown): value is RagSource {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.artist)
    && isNonEmptyString(value.title)
    && isOptionalString(value.album)
    && isOptionalString(value.year);
}

export function isRagResponse(value: unknown): value is RagResponse {
  if (!isRecord(value)
    || (value.status !== "answered" && value.status !== "insufficient")
    || (value.mode !== "single" && value.mode !== "compare" && value.mode !== "global")
    || !isNonEmptyString(value.answer)
    || !Array.isArray(value.artists)
    || !value.artists.every(isArtist)
    || !Array.isArray(value.sources)
    || !value.sources.every(isSource)
    || !isNonEmptyString(value.request_id)) {
    return false;
  }

  if (value.mode === "global" && value.artists.length !== 0) {
    return false;
  }
  if (value.mode === "single" && value.artists.length !== 1) {
    return false;
  }
  if (value.mode === "compare" && value.artists.length < 2) {
    return false;
  }
  return value.status === "insufficient" || value.sources.length > 0;
}

export async function submitRagQuestion(
  question: string,
  signal?: AbortSignal,
): Promise<RagResponse> {
  const response = await fetch(`${FRENCH_RAP_RAG_API_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!response.ok) {
    throw new RagApiError(response.status);
  }

  const payload: unknown = await response.json();
  if (!isRagResponse(payload)) {
    throw new RagApiError(0);
  }

  return payload;
}

class RagApiError extends Error {
  constructor(readonly status: number) {
    super(`RAG API request failed with status ${status}`);
  }
}

export function renderFrenchRapRagFeature(language: Language): string {
  const text = demoCopy[language];

  return `
    <section class="rag-demo" data-rag-demo aria-labelledby="rag-demo-title">
      <h2 class="rag-demo__title" id="rag-demo-title">${text.title}</h2>
      <p class="rag-demo__meta">${text.meta}</p>
      <form class="rag-demo__form" data-rag-form>
        <div class="rag-demo__prompt">
          <textarea
            id="rag-question"
            data-rag-question
            aria-label="${text.questionPlaceholder}"
            maxlength="500"
            rows="3"
            placeholder="${text.questionPlaceholder}"
            aria-describedby="rag-status"
          ></textarea>
        </div>
        <div class="rag-demo__controls">
          <button type="submit" data-rag-submit>${text.submit}</button>
        </div>
        <p class="rag-demo__status" id="rag-status" data-rag-status role="status" aria-live="polite"></p>
      </form>
      <div class="rag-demo__result" data-rag-result aria-live="polite" hidden></div>
    </section>
  `;
}

function createTextElement(tag: "h3" | "p" | "span", className: string, value: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = value;
  return element;
}

function scopeText(response: RagResponse, language: Language): string {
  const text = demoCopy[language];
  const value = response.mode === "global"
    ? text.scopeGlobal
    : response.artists.map((artist) => artist.name).join(" · ");
  return `${text.scope} — ${value}`;
}

function renderResult(container: HTMLElement, response: RagResponse, language: Language): void {
  const text = demoCopy[language];
  const scope = createTextElement("p", "rag-demo__scope", scopeText(response, language));
  const answer = createTextElement("p", "rag-demo__answer", response.answer);
  const children: HTMLElement[] = response.status === "insufficient"
    ? [scope, createTextElement("h3", "rag-demo__result-title", text.insufficient), answer]
    : [scope, answer];

  if (response.sources.length > 0) {
    children.push(createTextElement("p", "rag-demo__sources-title", text.sources));
    const sourceList = document.createElement("ol");
    sourceList.className = "rag-demo__sources";

    response.sources.forEach((source) => {
      const item = document.createElement("li");
      item.append(createTextElement("span", "rag-demo__source-title", `${source.artist} — ${source.title}`));
      const details = [source.album, source.year].filter(isNonEmptyString);
      if (details.length > 0) {
        item.append(createTextElement("span", "rag-demo__source-meta", details.join(" · ")));
      }
      sourceList.append(item);
    });
    children.push(sourceList);
  }

  container.replaceChildren(...children);
  container.hidden = false;
}

export function mountFrenchRapRag(language: Language): () => void {
  const root = document.querySelector<HTMLElement>("[data-rag-demo]");
  const form = root?.querySelector<HTMLFormElement>("[data-rag-form]");
  const questionInput = root?.querySelector<HTMLTextAreaElement>("[data-rag-question]");
  const submit = root?.querySelector<HTMLButtonElement>("[data-rag-submit]");
  const status = root?.querySelector<HTMLElement>("[data-rag-status]");
  const result = root?.querySelector<HTMLElement>("[data-rag-result]");

  if (!root || !form || !questionInput || !submit || !status || !result) {
    return () => undefined;
  }

  const text = demoCopy[language];
  const controller = new AbortController();
  let active = true;
  let requestInProgress = false;

  const setFormDisabled = (disabled: boolean): void => {
    questionInput.disabled = disabled;
    submit.disabled = disabled;
  };

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const question = questionInput.value.trim();

    if (requestInProgress) {
      return;
    }
    if (!question) {
      status.textContent = text.required;
      questionInput.focus();
      return;
    }

    requestInProgress = true;
    setFormDisabled(true);
    submit.textContent = text.submitting;
    status.textContent = text.loading;
    result.hidden = true;
    result.replaceChildren();
    root.dataset.ragState = "loading";

    void submitRagQuestion(question, controller.signal)
      .then((response) => {
        if (!active || !root.isConnected) {
          return;
        }
        renderResult(result, response, language);
        status.textContent = "";
        root.dataset.ragState = response.status;
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) {
          return;
        }

        if (error instanceof RagApiError && error.status === 429) {
          status.textContent = text.rateLimited;
          root.dataset.ragState = "rate-limit";
        } else if (error instanceof RagApiError && error.status === 502) {
          status.textContent = text.providerUnavailable;
          root.dataset.ragState = "provider-error";
        } else if (error instanceof RagApiError && error.status === 0) {
          status.textContent = text.invalidResponse;
          root.dataset.ragState = "invalid";
        } else {
          status.textContent = text.networkError;
          root.dataset.ragState = "error";
        }
      })
      .finally(() => {
        if (!active) {
          return;
        }
        requestInProgress = false;
        setFormDisabled(false);
        submit.textContent = text.submit;
      });
  };

  form.addEventListener("submit", handleSubmit);
  root.dataset.ragState = "ready";

  return () => {
    active = false;
    controller.abort();
    form.removeEventListener("submit", handleSubmit);
  };
}
