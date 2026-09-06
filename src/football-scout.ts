import { externalUrls, type Language } from "./content";

export const FOOTBALL_SCOUT_API_URL = import.meta.env.DEV
  ? "/scout-api"
  : externalUrls.footballScoutApi;

type ScoutRow = Record<string, unknown>;

type ScoutResponse = {
  type: "table" | "text";
  data: ScoutRow[];
  summary: string;
  sql: string | null;
};

const demoCopy = {
  en: {
    title: "Try the Scout Agent",
    meta: "2024–25 season · 5 leagues · around 2,000 players",
    examples: "Try this:",
    suggestions: [
      "Who are the top 3 forwards in Ligue 1?",
    ],
    questionPlaceholder: "Find left-footed forwards under 24 with strong xG numbers…",
    submit: "Ask the scout",
    submitting: "Scouting…",
    required: "Write a question of at least three characters.",
    loading: "Analysing… The first wake-up can take around 30 seconds…",
    sql: "View the validated SQL query",
    rateLimited: "The public demo is limited to three questions per minute. Please wait before trying again.",
    unavailable: "The free scouting service is temporarily unavailable. Please try again later.",
    timeout: "The scouting request took too long. Try a simpler question.",
    invalid: "The scouting service returned an unexpected response.",
    network: "The portfolio could not reach the scouting service. It may still be waking up.",
  },
  fr: {
    title: "Tester le Scout Agent",
    meta: "Saison 2024–25 · 5 championnats · environ 2 000 joueurs",
    examples: "Par exemple :",
    suggestions: [
      "Quels sont les trois meilleurs attaquants de Ligue 1 ?",
    ],
    questionPlaceholder: "Trouve des attaquants gauchers de moins de 24 ans avec un bon xG…",
    submit: "Interroger le scout",
    submitting: "Analyse…",
    required: "Écrivez une question d'au moins trois caractères.",
    loading: "Analyse... Le premier réveil peut prendre environ 30 secondes…",
    sql: "Voir la requête SQL validée",
    rateLimited: "La démo publique est limitée à trois questions par minute. Attendez avant de réessayer.",
    unavailable: "Le service de scouting gratuit est temporairement indisponible. Réessayez plus tard.",
    timeout: "La requête a pris trop de temps. Essayez une question plus simple.",
    invalid: "Le service de scouting a renvoyé une réponse inattendue.",
    network: "Le portfolio n'a pas pu joindre le service de scouting. Il est peut-être encore en cours de réveil.",
  },
} as const;

const columnPriority = [
  "name",
  "team",
  "league",
  "position",
  "age",
  "market_value_eur",
  "composite_score",
  "goals_p90",
  "assists_p90",
  "xg_p90",
  "xa_p90",
  "minutes_played",
] as const;

const columnLabels: Record<Language, Record<string, string>> = {
  en: {
    name: "Player",
    team: "Club",
    league: "League",
    position: "Pos.",
    age: "Age",
    market_value_eur: "Value",
    composite_score: "Score",
    goals_p90: "Goals/90",
    assists_p90: "Assists/90",
    xg_p90: "xG/90",
    xa_p90: "xA/90",
    minutes_played: "Minutes",
  },
  fr: {
    name: "Joueur",
    team: "Club",
    league: "Championnat",
    position: "Poste",
    age: "Âge",
    market_value_eur: "Valeur",
    composite_score: "Score",
    goals_p90: "Buts/90",
    assists_p90: "Passes/90",
    xg_p90: "xG/90",
    xa_p90: "xA/90",
    minutes_played: "Minutes",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isScoutResponse(value: unknown): value is ScoutResponse {
  return isRecord(value)
    && (value.type === "table" || value.type === "text")
    && Array.isArray(value.data)
    && value.data.every(isRecord)
    && typeof value.summary === "string"
    && (value.sql === null || typeof value.sql === "string");
}

class ScoutApiError extends Error {
  constructor(readonly status: number) {
    super(`Scout API request failed with status ${status}`);
  }
}

async function submitScoutQuestion(question: string, language: Language, signal: AbortSignal): Promise<ScoutResponse> {
  const response = await fetch(`${FOOTBALL_SCOUT_API_URL}/scout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language === "fr" ? "fr" : "en",
    },
    body: JSON.stringify({ question }),
    signal,
  });

  if (!response.ok) {
    throw new ScoutApiError(response.status);
  }

  const payload: unknown = await response.json();
  if (!isScoutResponse(payload)) {
    throw new ScoutApiError(0);
  }

  return payload;
}

function createTextElement(tag: "div" | "p" | "span", className: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function humanizeColumn(column: string, language: Language): string {
  return columnLabels[language][column]
    ?? column.replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}

function formatValue(value: unknown, column: string, language: Language): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value !== "number") {
    return String(value);
  }

  const locale = language === "fr" ? "fr-FR" : "en-GB";
  if (column === "market_value_eur") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  if (Number.isInteger(value)) {
    return new Intl.NumberFormat(locale).format(value);
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

function responseColumns(rows: ScoutRow[]): string[] {
  const available = new Set(rows.flatMap((row) => Object.keys(row)));
  const prioritized = columnPriority.filter((column) => available.has(column));
  const remaining = [...available].filter((column) => !prioritized.includes(column as typeof columnPriority[number]));
  return [...prioritized, ...remaining].slice(0, 6);
}

function tableSummary(rows: ScoutRow[], language: Language): string {
  const names = rows
    .map((row) => row.name)
    .filter((name): name is string => typeof name === "string")
    .slice(0, 3);
  const count = rows.length;

  if (language === "fr") {
    if (count === 0) {
      return "Aucun joueur ne correspond à ces critères.";
    }
    return names.length > 0
      ? `${count} résultat${count > 1 ? "s" : ""} : ${names.join(", ")}.`
      : `${count} résultat${count > 1 ? "s" : ""} de scouting.`;
  }

  if (count === 0) {
    return "No players match these criteria.";
  }
  return names.length > 0
    ? `${count} result${count > 1 ? "s" : ""}: ${names.join(", ")}.`
    : `${count} scouting result${count > 1 ? "s" : ""}.`;
}

function renderTable(rows: ScoutRow[], language: Language): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "scout-demo__table-wrap";
  const table = document.createElement("table");
  table.className = "scout-demo__table";
  const columns = responseColumns(rows);
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  columns.forEach((column) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = humanizeColumn(column, language);
    headRow.append(cell);
  });
  head.append(headRow);

  const body = document.createElement("tbody");
  rows.forEach((row) => {
    const tableRow = document.createElement("tr");
    columns.forEach((column) => {
      const cell = document.createElement("td");
      cell.textContent = formatValue(row[column], column, language);
      tableRow.append(cell);
    });
    body.append(tableRow);
  });

  table.append(head, body);
  wrapper.append(table);
  return wrapper;
}

function formatSql(sql: string): string {
  return sql
    .replace(/\s+(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT)\s+/gi, "\n$1 ")
    .replace(/\s+(AND|OR)\s+/gi, "\n  $1 ")
    .trim();
}

function renderSql(code: HTMLElement, sql: string): void {
  const tokenPattern = /('(?:''|[^'])*'|\b(?:SELECT|FROM|WHERE|AND|OR|GROUP|BY|HAVING|ORDER|LIMIT|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|WITH|DESC|ASC|NULL|IN|LIKE|BETWEEN)\b|\b\d+(?:\.\d+)?\b)/gi;
  const tokens = formatSql(sql).split(tokenPattern);

  tokens.forEach((token) => {
    if (!token) {
      return;
    }

    const span = document.createElement("span");
    span.textContent = token;
    if (/^'(?:''|[^'])*'$/.test(token)) {
      span.className = "scout-demo__sql-string";
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      span.className = "scout-demo__sql-number";
    } else if (/^[A-Z]+$/i.test(token)) {
      span.className = "scout-demo__sql-keyword";
    }
    code.append(span);
  });
}

function renderAnswer(container: HTMLElement, response: ScoutResponse, language: Language): void {
  const text = demoCopy[language];
  const answer = document.createElement("div");
  answer.className = "scout-demo__answer-block";

  const prose = response.type === "table"
    ? tableSummary(response.data, language)
    : typeof response.data[0]?.text === "string"
      ? response.data[0].text
      : response.summary;
  answer.append(createTextElement("p", "scout-demo__answer", prose));

  if (response.type === "table" && response.data.length > 0) {
    answer.append(renderTable(response.data, language));
  }

  if (response.sql) {
    const details = document.createElement("details");
    details.className = "scout-demo__sql";
    const summary = document.createElement("summary");
    summary.textContent = text.sql;
    const code = document.createElement("code");
    renderSql(code, response.sql);
    details.append(summary, code);
    answer.append(details);
  }

  container.replaceChildren(answer);
}

export function renderFootballScoutFeature(language: Language): string {
  const text = demoCopy[language];

  return `
    <section class="scout-demo" data-scout-demo aria-labelledby="scout-demo-title">
      <h2 class="scout-demo__title" id="scout-demo-title">${text.title}</h2>
      <p class="scout-demo__meta">${text.meta}</p>
      <form class="scout-demo__form" data-scout-form>
        <textarea
          id="scout-question"
          data-scout-question
          aria-label="${text.questionPlaceholder}"
          minlength="3"
          maxlength="500"
          rows="2"
          placeholder="${text.questionPlaceholder}"
          aria-describedby="scout-status"
        ></textarea>
        <div class="scout-demo__controls">
          <button type="submit" data-scout-submit>${text.submit}</button>
        </div>
        <div class="scout-demo__suggestions" aria-label="${text.examples}">
          <span>${text.examples}</span>
          ${text.suggestions.map((question) => `<button type="button" data-scout-suggestion="${question}">${question}</button>`).join("")}
        </div>
        <p class="scout-demo__status" id="scout-status" data-scout-status role="status"></p>
      </form>
      <div class="scout-demo__exchange" data-scout-exchange aria-live="polite"></div>
    </section>
  `;
}

export function mountFootballScout(language: Language): () => void {
  const root = document.querySelector<HTMLElement>("[data-scout-demo]");
  const form = root?.querySelector<HTMLFormElement>("[data-scout-form]");
  const questionInput = root?.querySelector<HTMLTextAreaElement>("[data-scout-question]");
  const submit = root?.querySelector<HTMLButtonElement>("[data-scout-submit]");
  const status = root?.querySelector<HTMLElement>("[data-scout-status]");
  const exchange = root?.querySelector<HTMLElement>("[data-scout-exchange]");

  if (!root || !form || !questionInput || !submit || !status || !exchange) {
    return () => undefined;
  }

  const text = demoCopy[language];
  let active = true;
  let requestController: AbortController | undefined;

  const setBusy = (busy: boolean): void => {
    questionInput.disabled = busy;
    submit.disabled = busy;
    submit.textContent = busy ? text.submitting : text.submit;
    if (busy) {
      root.dataset.scoutState = "loading";
    }
  };

  const handleSuggestion = (event: Event): void => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>("[data-scout-suggestion]")
      : null;
    if (!target || !root.contains(target)) {
      return;
    }
    questionInput.value = target.dataset.scoutSuggestion ?? "";
    questionInput.focus();
  };

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const question = questionInput.value.trim();

    if (question.length < 3 || requestController) {
      if (question.length < 3) {
        status.textContent = text.required;
        questionInput.focus();
      }
      return;
    }

    exchange.replaceChildren();
    status.textContent = text.loading;
    setBusy(true);
    requestController = new AbortController();

    void submitScoutQuestion(question, language, requestController.signal)
      .then((response) => {
        if (!active || !root.isConnected) {
          return;
        }
        renderAnswer(exchange, response, language);
        status.textContent = "";
        root.dataset.scoutState = "answered";
      })
      .catch((error: unknown) => {
        if (!active || requestController?.signal.aborted) {
          return;
        }
        if (error instanceof ScoutApiError && error.status === 429) {
          status.textContent = text.rateLimited;
        } else if (error instanceof ScoutApiError && [502, 503].includes(error.status)) {
          status.textContent = text.unavailable;
        } else if (error instanceof ScoutApiError && error.status === 504) {
          status.textContent = text.timeout;
        } else if (error instanceof ScoutApiError && error.status === 0) {
          status.textContent = text.invalid;
        } else {
          status.textContent = text.network;
        }
        root.dataset.scoutState = "error";
      })
      .finally(() => {
        requestController = undefined;
        if (active) {
          setBusy(false);
        }
      });
  };

  root.addEventListener("click", handleSuggestion);
  form.addEventListener("submit", handleSubmit);

  return () => {
    active = false;
    requestController?.abort();
    root.removeEventListener("click", handleSuggestion);
    form.removeEventListener("submit", handleSubmit);
  };
}
