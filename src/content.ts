export type Language = "en" | "fr";

type LocalizedText = Record<Language, string>;

export type Project = {
  index: string;
  title: string;
  href?: string;
  external?: boolean;
};

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
  { index: "000", title: "Report Automation", href: "/work/caf-report-automation" },
  { index: "001", title: "LoL Data Pipeline", href: "/work/lol-weekly-data-pipeline" },
  { index: "002", title: "Football Scout Agent", href: "/work/football-scout-agent" },
  { index: "003", title: "Tobit Fraud Model", href: "/work/tobit-fraud-targeting" },
  { index: "004", title: "Ticket Workflow", href: "/work/ticket-workflow-prototype" },
  { index: "005", title: "French Rap RAG", href: "/work/french-rap-rag" },
  { index: "006", title: "Academic Projects", href: "/work/academic-projects" },
  {
    index: "007",
    title: "macOS Portfolio",
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
  en: "Alex Daucourt — Data & Automation Engineer",
  fr: "Alex Daucourt — Data & Automation Engineer",
};
