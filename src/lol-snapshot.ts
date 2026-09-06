import { externalUrls, type Language } from "./content";

export const LOL_SNAPSHOT_URL = externalUrls.lolMetaTrackerSnapshot;
export const LOL_REPOSITORY_URL = externalUrls.lolMetaTrackerRepository;

const roleNames = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"] as const;

type LolRole = (typeof roleNames)[number];

type LolLeader = {
  rank: number;
  champion: string;
  win_rate: number;
  pick_rate: number;
  games: number;
  kda_ratio: number;
  pick_rate_delta: number | null;
};

type LolMover = {
  role: LolRole;
  champion: string;
  pick_rate_delta: number;
};

export type LolSnapshot = {
  schema_version: 2;
  generated_at: string;
  scope: {
    patch: string;
    region: string;
    tiers: string[];
    queue: string;
    lookback_days: number;
  };
  sample: {
    matches: number;
    champions: number;
  };
  methodology: {
    minimum_games: number;
  };
  comparison: {
    available: boolean;
    same_patch: boolean;
    previous_patch?: string;
    reason?: string;
  };
  roles: Record<LolRole, { leaders: LolLeader[] }>;
  movers: {
    up: LolMover[];
    down: LolMover[];
  };
};

const uiCopy = {
  en: {
    title: "Latest snapshot",
    loading: "Loading latest snapshot…",
    unavailable: "Live data is temporarily unavailable.",
    sourceLink: "View the snapshot on GitHub",
    patch: "Patch",
    region: "Region",
    matches: "Matches",
    updated: "Updated",
    roles: "Roles",
    winRate: "WR",
    pickRate: "Pick",
    games: "Games",
    kda: "KDA",
    weeklyMovement: "Weekly pick-rate movement",
    up: "Up",
    down: "Down",
    noComparison: "A comparison will be available after two snapshots from the same patch.",
    patchChanged: (previous: string, current: string) => `The previous snapshot used patch ${previous}; movement is not compared with patch ${current}.`,
  },
  fr: {
    title: "Dernier snapshot",
    loading: "Chargement du dernier snapshot…",
    unavailable: "Les données live sont temporairement indisponibles.",
    sourceLink: "Voir le snapshot sur GitHub",
    patch: "Patch",
    region: "Région",
    matches: "Matchs",
    updated: "Mise à jour",
    roles: "Postes",
    winRate: "WR",
    pickRate: "Pick",
    games: "Parties",
    kda: "KDA",
    weeklyMovement: "Évolutions hebdomadaires du pick rate",
    up: "Hausses",
    down: "Baisses",
    noComparison: "La comparaison sera disponible après deux snapshots du même patch.",
    patchChanged: (previous: string, current: string) => `Le snapshot précédent utilisait le patch ${previous} ; les évolutions ne sont pas comparées avec le patch ${current}.`,
  },
} as const;

let snapshotCache: LolSnapshot | undefined;
let selectedRole: LolRole = "TOP";

const roleLabels: Record<Language, Record<LolRole, string>> = {
  en: {
    TOP: "TOP",
    JUNGLE: "JUNGLE",
    MIDDLE: "MID",
    BOTTOM: "ADC",
    UTILITY: "SUPPORT",
  },
  fr: {
    TOP: "TOP",
    JUNGLE: "JUNGLE",
    MIDDLE: "MID",
    BOTTOM: "ADC",
    UTILITY: "SUPPORT",
  },
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRate(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 1;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRole(value: unknown): value is LolRole {
  return typeof value === "string" && roleNames.some((role) => role === value);
}

function isLeader(value: unknown): value is LolLeader {
  if (!isRecord(value)) {
    return false;
  }

  return Number.isInteger(value.rank)
    && isNonEmptyString(value.champion)
    && isRate(value.win_rate)
    && isRate(value.pick_rate)
    && Number.isInteger(value.games)
    && isFiniteNumber(value.kda_ratio)
    && (value.pick_rate_delta === null || isFiniteNumber(value.pick_rate_delta));
}

function isMover(value: unknown): value is LolMover {
  if (!isRecord(value)) {
    return false;
  }

  return isRole(value.role)
    && isNonEmptyString(value.champion)
    && isFiniteNumber(value.pick_rate_delta);
}

export function isLolSnapshot(value: unknown): value is LolSnapshot {
  if (!isRecord(value)
    || value.schema_version !== 2
    || !isNonEmptyString(value.generated_at)
    || Number.isNaN(Date.parse(value.generated_at))
    || !isRecord(value.scope)
    || !isNonEmptyString(value.scope.patch)
    || !isNonEmptyString(value.scope.region)
    || !Array.isArray(value.scope.tiers)
    || !value.scope.tiers.every(isNonEmptyString)
    || !isNonEmptyString(value.scope.queue)
    || !Number.isInteger(value.scope.lookback_days)
    || !isRecord(value.sample)
    || !Number.isInteger(value.sample.matches)
    || !Number.isInteger(value.sample.champions)
    || !isRecord(value.methodology)
    || !Number.isInteger(value.methodology.minimum_games)
    || !isRecord(value.comparison)
    || typeof value.comparison.available !== "boolean"
    || typeof value.comparison.same_patch !== "boolean"
    || (value.comparison.previous_patch !== undefined && typeof value.comparison.previous_patch !== "string")
    || (value.comparison.reason !== undefined && typeof value.comparison.reason !== "string")
    || !isRecord(value.roles)
    || !isRecord(value.movers)
    || !Array.isArray(value.movers.up)
    || !value.movers.up.every(isMover)
    || !Array.isArray(value.movers.down)
    || !value.movers.down.every(isMover)) {
    return false;
  }

  const roles = value.roles;

  if (!isRecord(roles)) {
    return false;
  }

  return roleNames.every((role) => {
    const roleData = roles[role];
    return isRecord(roleData)
      && Array.isArray(roleData.leaders)
      && roleData.leaders.length >= 3
      && roleData.leaders.every(isLeader);
  });
}

export async function loadLolSnapshot(
  signal?: AbortSignal,
  url = LOL_SNAPSHOT_URL,
): Promise<LolSnapshot> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Snapshot request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isLolSnapshot(payload)) {
    throw new Error("Snapshot schema is invalid");
  }

  return payload;
}

function formatPercent(value: number, language: Language): string {
  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-GB", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatInteger(value: number, language: Language): string {
  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-GB").format(value);
}

function formatDecimal(value: number, language: Language): string {
  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string, language: Language): string {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

function formatDelta(value: number, language: Language): string {
  const magnitude = new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value * 100));
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${magnitude} pp`;
}

function championAssetName(champion: string): string {
  const normalized = champion.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const overrides: Record<string, string> = {
    leblanc: "Leblanc",
    nunuwillump: "Nunu",
    renataglasc: "Renata",
    wukong: "MonkeyKing",
  };

  return overrides[normalized]
    ?? champion.replace(/[^a-z0-9]/gi, "");
}

function championImageUrl(champion: string, patch: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(patch)}.1/img/champion/${encodeURIComponent(championAssetName(champion))}.png`;
}

function renderChampionPortrait(champion: string, patch: string, className: string): string {
  return `<img class="${className}" src="${championImageUrl(champion, patch)}" alt="" loading="lazy" width="48" height="48" />`;
}

function renderLeader(leader: LolLeader, language: Language, patch: string): string {
  const text = uiCopy[language];

  return `
    <li class="lol-leader">
      <span class="lol-leader__rank">${String(leader.rank).padStart(2, "0")}</span>
      ${renderChampionPortrait(leader.champion, patch, "lol-leader__portrait")}
      <span class="lol-leader__champion">${escapeHtml(leader.champion)}</span>
      <dl class="lol-leader__metrics">
        <div><dt>${text.winRate}</dt><dd>${formatPercent(leader.win_rate, language)}</dd></div>
        <div><dt>${text.pickRate}</dt><dd>${formatPercent(leader.pick_rate, language)}</dd></div>
        <div><dt>${text.games}</dt><dd>${formatInteger(leader.games, language)}</dd></div>
        <div><dt>${text.kda}</dt><dd>${formatDecimal(leader.kda_ratio, language)}</dd></div>
      </dl>
    </li>
  `;
}

function renderRoleTab(role: LolRole, language: Language, selected: boolean): string {
  const panelId = `lol-role-panel-${role.toLowerCase()}`;
  const tabId = `lol-role-tab-${role.toLowerCase()}`;
  return `
    <button
      class="lol-role-tab"
      id="${tabId}"
      type="button"
      role="tab"
      data-lol-role-tab
      aria-selected="${selected}"
      aria-controls="${panelId}"
      tabindex="${selected ? "0" : "-1"}"
    >${roleLabels[language][role]}</button>
  `;
}

function renderRolePanel(
  role: LolRole,
  leaders: LolLeader[],
  language: Language,
  patch: string,
  selected: boolean,
): string {
  return `
    <div
      class="lol-role-panel"
      id="lol-role-panel-${role.toLowerCase()}"
      role="tabpanel"
      aria-labelledby="lol-role-tab-${role.toLowerCase()}"
      ${selected ? "" : "hidden"}
    >
      <ol class="lol-leaders">
        ${leaders.slice(0, 3).map((item) => renderLeader(item, language, patch)).join("")}
      </ol>
    </div>
  `;
}

function renderMover(mover: LolMover, language: Language, patch: string): string {
  return `
    <li class="lol-mover">
      ${renderChampionPortrait(mover.champion, patch, "lol-mover__portrait")}
      <span class="lol-mover__identity">
        <span>${escapeHtml(mover.champion)}</span>
        <span class="lol-mover__role">${roleLabels[language][mover.role]}</span>
      </span>
      <span class="lol-mover__delta">${formatDelta(mover.pick_rate_delta, language)}</span>
    </li>
  `;
}

function renderMovers(snapshot: LolSnapshot, language: Language): string {
  const text = uiCopy[language];

  if (!snapshot.comparison.available || !snapshot.comparison.same_patch) {
    const message = snapshot.comparison.reason === "patch_changed" && snapshot.comparison.previous_patch
      ? text.patchChanged(snapshot.comparison.previous_patch, snapshot.scope.patch)
      : text.noComparison;
    return `<p class="lol-movers__unavailable">${message}</p>`;
  }

  return `
    <section class="lol-movers" aria-labelledby="lol-movers-title">
      <h3 id="lol-movers-title">${text.weeklyMovement}</h3>
      <div class="lol-movers__columns">
        <div>
          <h4>${text.up}</h4>
          <ul>${snapshot.movers.up.map((mover) => renderMover(mover, language, snapshot.scope.patch)).join("")}</ul>
        </div>
        <div>
          <h4>${text.down}</h4>
          <ul>${snapshot.movers.down.map((mover) => renderMover(mover, language, snapshot.scope.patch)).join("")}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderSnapshot(snapshot: LolSnapshot, language: Language): string {
  const text = uiCopy[language];
  const firstRole = selectedRole;

  return `
    <dl class="lol-snapshot__metadata">
      <div><dt>${text.patch}</dt><dd>${escapeHtml(snapshot.scope.patch)}</dd></div>
      <div><dt>${text.region}</dt><dd>${escapeHtml(snapshot.scope.region)}</dd></div>
      <div><dt>${text.matches}</dt><dd>${formatInteger(snapshot.sample.matches, language)}</dd></div>
      <div><dt>${text.updated}</dt><dd><time datetime="${escapeHtml(snapshot.generated_at)}">${formatDate(snapshot.generated_at, language)}</time></dd></div>
    </dl>
    <div class="lol-role-tabs" role="tablist" aria-label="${text.roles}">
      ${roleNames.map((role) => renderRoleTab(role, language, role === firstRole)).join("")}
    </div>
    <div class="lol-role-panels">
      ${roleNames.map((role) => renderRolePanel(role, snapshot.roles[role].leaders, language, snapshot.scope.patch, role === firstRole)).join("")}
    </div>
    ${renderMovers(snapshot, language)}
  `;
}

export function renderLolSnapshotFeature(language: Language): string {
  const text = uiCopy[language];

  return `
    <section class="lol-snapshot" data-lol-snapshot aria-labelledby="lol-snapshot-title">
      <h2 class="lol-snapshot__title" id="lol-snapshot-title">${text.title}</h2>
      <div class="lol-snapshot__content" data-lol-snapshot-content data-lol-state="loading" aria-live="polite">
        <p class="lol-snapshot__state">${text.loading}</p>
      </div>
    </section>
  `;
}

export function renderLolSnapshotError(language: Language): string {
  const text = uiCopy[language];
  return `
    <p class="lol-snapshot__state lol-snapshot__state--error">
      ${text.unavailable}
      <a href="${LOL_REPOSITORY_URL}" target="_blank" rel="noopener noreferrer">${text.sourceLink}</a>.
    </p>
  `;
}

function enableRoleSelection(root: HTMLElement): () => void {
  const selectTab = (button: HTMLButtonElement, focus = false): void => {
    const panelId = button.getAttribute("aria-controls");
    const role = panelId?.replace("lol-role-panel-", "").toUpperCase();
    if (isRole(role)) {
      selectedRole = role;
    }

    root.querySelectorAll<HTMLButtonElement>("[data-lol-role-tab]").forEach((roleButton) => {
      const isSelected = roleButton === button;
      const controlledPanelId = roleButton.getAttribute("aria-controls");
      const panel = controlledPanelId ? root.querySelector<HTMLElement>(`#${controlledPanelId}`) : null;

      roleButton.setAttribute("aria-selected", String(isSelected));
      roleButton.tabIndex = isSelected ? 0 : -1;
      if (panel) {
        panel.hidden = !isSelected;
      }
    });

    if (focus) {
      button.focus();
    }
  };

  const handleClick = (event: Event): void => {
    const target = event.target;
    const button = target instanceof Element
      ? target.closest<HTMLButtonElement>("[data-lol-role-tab]")
      : null;

    if (!button || !root.contains(button)) {
      return;
    }

    selectTab(button);
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>("[data-lol-role-tab]")
      : null;
    if (!target || !root.contains(target)) {
      return;
    }

    const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-lol-role-tab]")];
    const currentIndex = tabs.indexOf(target);
    const lastIndex = tabs.length - 1;
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    }
  };

  root.addEventListener("click", handleClick);
  root.addEventListener("keydown", handleKeyDown);
  return () => {
    root.removeEventListener("click", handleClick);
    root.removeEventListener("keydown", handleKeyDown);
  };
}

export function mountLolSnapshot(language: Language): () => void {
  const root = document.querySelector<HTMLElement>("[data-lol-snapshot]");
  const content = root?.querySelector<HTMLElement>("[data-lol-snapshot-content]");

  if (!root || !content) {
    return () => undefined;
  }

  const controller = new AbortController();
  let active = true;
  let removeInteraction: () => void = () => undefined;

  const showSnapshot = (snapshot: LolSnapshot): void => {
    if (!active || !root.isConnected) {
      return;
    }

    content.innerHTML = renderSnapshot(snapshot, language);
    content.dataset.lolState = "success";
    content.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.hidden = true;
      }, { once: true });
    });
    removeInteraction = enableRoleSelection(root);
  };

  if (snapshotCache) {
    showSnapshot(snapshotCache);
  } else {
    void loadLolSnapshot(controller.signal)
      .then((snapshot) => {
        snapshotCache = snapshot;
        showSnapshot(snapshot);
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) {
          return;
        }

        console.warn("Unable to load LoL portfolio snapshot", error);
        content.innerHTML = renderLolSnapshotError(language);
        content.dataset.lolState = "error";
      });
  }

  return () => {
    active = false;
    controller.abort();
    removeInteraction();
  };
}
