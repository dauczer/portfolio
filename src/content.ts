export type Language = "en" | "fr";

export type LocalizedText = Record<Language, string>;

export type Project = {
  index: string;
  title: LocalizedText;
  href?: string;
  external?: boolean;
};

export const projectTitles = {
  cafReportAutomation: {
    en: "Report Automation",
    fr: "Automatisation rapports",
  },
  lolWeeklyDataPipeline: {
    en: "LoL Data Pipeline",
    fr: "Pipeline data LoL",
  },
  footballScoutAgent: {
    en: "Football Scout Agent",
    fr: "Scout football",
  },
  tobitFraudTargeting: {
    en: "Tobit Fraud Model",
    fr: "Modèle fraude Tobit",
  },
  ticketWorkflowPrototype: {
    en: "Ticket Workflow",
    fr: "Suivi de tickets",
  },
  frenchRapRag: {
    en: "French Rap RAG",
    fr: "RAG rap français",
  },
  academicProjects: {
    en: "Academic Projects",
    fr: "Projets académiques",
  },
  macosPortfolio: {
    en: "macOS Portfolio",
    fr: "Portfolio macOS",
  },
} as const satisfies Record<string, LocalizedText>;

export const externalUrls = {
  canonicalSite: "https://alexdaucourt.dev",
  email: "alexdaucourt@gmail.com",
  footballScoutApi: "https://scout-agent-jkrv.onrender.com",
  frenchRapRagApi: "https://music-rag.onrender.com",
  frenchRapRagRepository: "https://github.com/dauczer/music-RAG",
  frenchRapDataset: "https://www.kaggle.com/datasets/quentinlelan/french-rap-lyrics-several-dataset-union",
  geniusLyricsDataset: "https://www.kaggle.com/datasets/carlosgdcj/genius-song-lyrics-with-language-information",
  footballScoutRepository: "https://github.com/dauczer/scout-agent",
  lolMetaTrackerRepository: "https://github.com/dauczer/lol-meta-tracker",
  lolMetaTrackerSnapshot: "https://raw.githubusercontent.com/dauczer/lol-meta-tracker/main/data/output/portfolio_snapshot.json",
} as const;

export const copy: Record<
  Language,
  {
    greeting: string;
    introduction: readonly string[];
    infoLabel: string;
    workLabel: string;
    languageLabel: string;
  }
> = {
  en: {
    greeting: "Hi, I'm Alex!",
    introduction: [
      "I'm an integration engineer at Agicap, after three years working with data at CAF de la Côte-d'Or and a background in applied mathematics.",
      "I use Python and SQL to turn messy data and repetitive workflows into useful tools, automations and data products.",
    ],
    infoLabel: "info",
    workLabel: "work",
    languageLabel: "Afficher le site en français",
  },
  fr: {
    greeting: "Salut, moi c'est Alex !",
    introduction: [
      "Je suis integration engineer chez Agicap, après trois ans dans la data à la CAF de la Côte-d'Or et une formation en mathématiques appliquées.",
      "Je travaille surtout avec Python et SQL pour automatiser des tâches et rendre les données plus faciles à exploiter.",
    ],
    infoLabel: "info",
    workLabel: "work",
    languageLabel: "View the site in English",
  },
};

export const projects: readonly Project[] = [
  { index: "000", title: projectTitles.cafReportAutomation, href: "/work/caf-report-automation" },
  { index: "001", title: projectTitles.lolWeeklyDataPipeline, href: "/work/lol-weekly-data-pipeline" },
  { index: "002", title: projectTitles.footballScoutAgent, href: "/work/football-scout-agent" },
  { index: "003", title: projectTitles.tobitFraudTargeting, href: "/work/tobit-fraud-targeting" },
  { index: "004", title: projectTitles.ticketWorkflowPrototype, href: "/work/ticket-workflow-prototype" },
  { index: "005", title: projectTitles.frenchRapRag, href: "/work/french-rap-rag" },
  { index: "006", title: projectTitles.academicProjects, href: "/work/academic-projects" },
  {
    index: "007",
    title: projectTitles.macosPortfolio,
    href: "https://playground.alexdaucourt.dev",
    external: true,
  },
];

export const footerLinks: Record<Language, readonly {
  label: string;
  href: string;
  download?: string;
}[]> = {
  en: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/alex-daucourt/" },
    { label: "GitHub", href: "https://github.com/dauczer" },
    { label: "Email", href: `mailto:${externalUrls.email}` },
    {
      label: "Resume",
      href: "/resume/alex-daucourt-resume-en.pdf",
      download: "Alex-Daucourt-Resume-EN.pdf",
    },
  ],
  fr: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/alex-daucourt/" },
    { label: "GitHub", href: "https://github.com/dauczer" },
    { label: "Email", href: `mailto:${externalUrls.email}` },
    {
      label: "CV",
      href: "/resume/alex-daucourt-cv-fr.pdf",
      download: "Alex-Daucourt-CV-FR.pdf",
    },
  ],
};

export const documentTitles: LocalizedText = {
  en: "Alex Daucourt",
  fr: "Alex Daucourt",
};
