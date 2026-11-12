import { externalUrls, projectTitles, type Language } from "./content";

export const articleSlugs = [
  "lol-weekly-data-pipeline",
  "football-scout-agent",
  "caf-report-automation",
  "french-rap-rag",
  "ticket-workflow-prototype",
  "tobit-fraud-targeting",
  "academic-projects",
  "filament",
] as const;

export type ArticleSlug = (typeof articleSlugs)[number];

export type ArticleTextSegment = {
  text: string;
  href?: string;
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "rich-paragraph"; segments: readonly ArticleTextSegment[] }
  | { type: "heading-3"; text: string }
  | { type: "list"; ordered?: boolean; items: readonly string[] }
  | { type: "code"; code: string; language?: string }
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; label: string };

export type ArticleSectionContent = {
  title: string;
  index?: string;
  blocks: readonly ArticleBlock[];
};

export type ArticleCopy = {
  title: string;
  date: string;
  intro: readonly string[];
  featurePlaceholder?: string;
  sections: readonly ArticleSectionContent[];
  note?: string;
};

type LocalizedArticle = Record<Language, ArticleCopy>;

const cafReportAutomation: LocalizedArticle = {
  fr: {
    title: projectTitles.cafReportAutomation.fr,
    date: "2024",
    intro: [
      "Une automatisation développée à la CAF de la Côte-d'Or pour remplacer un processus manuel de génération de rapports de territoire.",
      "Le workflow automatisé générait environ 50 rapports par an et son gain était estimé à près de 200 heures de travail manuel par an.",
    ],
    sections: [
      {
        title: "Le problème",
        blocks: [
          { type: "paragraph", text: "La création de rapport initiale reposait sur un document Word de plus de vingt pages, rempli manuellement à partir de plusieurs sources de données (internes et bases de données cloud)." },
          { type: "paragraph", text: "Le travail était répétitif : récupérer les bonnes informations, les mettre au bon format, compléter le document puis produire le rapport final." },
          { type: "paragraph", text: "Avec plusieurs dizaines de rapports à produire chaque année, cela représentait beaucoup de temps consacré à une tâche largement automatisable." },
        ],
      },
      {
        title: "Ce que j'ai construit",
        blocks: [
          { type: "paragraph", text: "J'ai développé un notebook en Python dans Databricks qui récupérait directement les informations nécessaires depuis les bases de données internes." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "Les données étaient ensuite préparées et injectées dans un template HTML avant que le document final soit rendu automatiquement en PDF avec " },
              { text: "WeasyPrint", href: "https://weasyprint.org/" },
              { text: "." },
            ],
          },
          { type: "paragraph", text: "Les principales technologies utilisées étaient Python, SQL, Databricks et WeasyPrint." },
        ],
      },
      {
        title: "Comment ça fonctionne",
        blocks: [
          { type: "paragraph", text: "L'interface visible ci-dessous était un prototype séparé et non déployé. Le workflow professionnel de génération restait piloté par le notebook Python dans Databricks." },
          {
            type: "video",
            src: "/project-media/caf-report-automation.mp4",
            poster: "/project-images/caf-report-prototype.png",
            label: "Démonstration de l'interface de visualisation et d'export des rapports CAF",
          },
          { type: "paragraph", text: "Ce prototype explorait une prévisualisation du rapport avant export, notamment pour rendre les corrections plus simples qu'après la génération du PDF." },
        ],
      },
      {
        title: "Ce que j'en retiens",
        blocks: [
          { type: "paragraph", text: "C'est le type de problème que j'aime résoudre : partir d'un processus métier manuel et construire une automatisation assez simple pour alléger réellement le quotidien." },
        ],
      },
    ],
    note: "Projet professionnel — code et données non publics.",
  },
  en: {
    title: projectTitles.cafReportAutomation.en,
    date: "2024",
    intro: [
      "An automation developed at CAF de la Côte-d'Or to replace a manual process for generating local-area reports.",
      "The automated workflow generated approximately 50 reports per year and was estimated to save roughly 200 hours of manual work annually.",
    ],
    sections: [
      {
        title: "The problem",
        blocks: [
          { type: "paragraph", text: "The initial report-creation process relied on a Word document of more than twenty pages, completed manually using several data sources (internal and cloud databases)." },
          { type: "paragraph", text: "The work was repetitive: retrieve the right information, format it, complete the document, then produce the final report." },
          { type: "paragraph", text: "With several dozen reports to produce each year, a significant amount of time was spent on a largely automatable task." },
        ],
      },
      {
        title: "What I built",
        blocks: [
          { type: "paragraph", text: "I developed a Python notebook in Databricks that retrieved the required information directly from internal databases." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "The data was then prepared and inserted into an HTML template before the final document was rendered automatically as a PDF with " },
              { text: "WeasyPrint", href: "https://weasyprint.org/" },
              { text: "." },
            ],
          },
          { type: "paragraph", text: "The main technologies used were Python, SQL, Databricks and WeasyPrint." },
        ],
      },
      {
        title: "How it works",
        blocks: [
          { type: "paragraph", text: "The interface shown below was a separate, undeployed prototype. The professional report workflow continued to run through the Python notebook in Databricks." },
          {
            type: "video",
            src: "/project-media/caf-report-automation.mp4",
            poster: "/project-images/caf-report-prototype.png",
            label: "Demonstration of the CAF report preview and export interface",
          },
          { type: "paragraph", text: "The prototype explored a report preview before export, particularly to make corrections easier than editing the generated PDF." },
        ],
      },
      {
        title: "What I took from it",
        blocks: [
          { type: "paragraph", text: "This is the kind of problem I enjoy: starting with a manual business process and building a simple automation that meaningfully reduces the work around it." },
        ],
      },
    ],
    note: "Professional project — code and data are not public.",
  },
};

const tobitFraudTargeting: LocalizedArticle = {
  fr: {
    title: projectTitles.tobitFraudTargeting.fr,
    date: "2024",
    intro: [
      "Un modèle statistique développé et testé à la CAF de la Côte-d'Or pour mieux prioriser les dossiers susceptibles de produire un impact financier.",
    ],
    sections: [
      {
        title: "Le problème",
        blocks: [
          { type: "paragraph", text: "L'objectif n'était pas seulement d'identifier un risque de fraude. Il fallait surtout aider à sélectionner, parmi les dossiers à contrôler, ceux dont l'impact financier potentiel semblait le plus important." },
          { type: "paragraph", text: "Le score de référence utilisé en CAF formule ce problème comme une classification binaire autour d'un seuil. Cette sortie était utile pour filtrer des dossiers, mais moins directement adaptée à leur priorisation par montant attendu." },
        ],
      },
      {
        title: "L'approche",
        blocks: [
          { type: "paragraph", text: "J'ai exploré une régression Tobit afin de modéliser directement l'impact financier attendu tout en tenant compte de la censure présente dans la variable cible." },
          { type: "paragraph", text: "Le modèle produisait ainsi une valeur continue utilisable pour classer les dossiers. Le travail restait une expérimentation appliquée, construite autour du besoin opérationnel plutôt qu'un système de machine learning industrialisé." },
        ],
      },
      {
        title: "L'évaluation",
        blocks: [
          { type: "paragraph", text: "Le modèle a été comparé au ciblage existant pendant une période de test de deux mois. Sur cette évaluation, les dossiers qu'il sélectionnait présentaient un impact financier environ 10 % supérieur à celui de la référence." },
          { type: "paragraph", text: "Ce résultat était prometteur, mais il décrivait une fenêtre courte et un volume de test limité. Il ne constitue pas une mesure de performance garantie en production." },
        ],
      },
      {
        title: "Les limites",
        blocks: [
          { type: "paragraph", text: "Une évaluation plus longue et plus structurée aurait été nécessaire pour mesurer la stabilité du gain, analyser les biais et suivre le comportement du modèle dans le temps." },
          { type: "paragraph", text: "Le projet n'a pas atteint le niveau d'un pipeline ML mature : l'industrialisation, le monitoring et la gouvernance du modèle restaient à construire." },
        ],
      },
      {
        title: "Ce que j'en retiens",
        blocks: [
          { type: "paragraph", text: "Ce travail relie ma formation en mathématiques appliquées à un problème opérationnel concret. Il m'a surtout appris à formuler une cible utile au métier, à évaluer prudemment un modèle et à expliquer ses résultats sans masquer leurs limites." },
        ],
      },
    ],
    note: "Projet professionnel — code et données non publics.",
  },
  en: {
    title: projectTitles.tobitFraudTargeting.en,
    date: "2024",
    intro: [
      "A statistical model developed and tested at CAF de la Côte-d'Or to better prioritize cases likely to produce a financial impact.",
    ],
    sections: [
      {
        title: "The problem",
        blocks: [
          { type: "paragraph", text: "The objective was not simply to identify fraud risk. It was to help select, among the cases available for review, those that appeared most likely to produce a significant financial impact." },
          { type: "paragraph", text: "The reference score used at CAF frames the problem as binary classification around a threshold. That output was useful for filtering cases, but less directly suited to ranking them by expected amount." },
        ],
      },
      {
        title: "The approach",
        blocks: [
          { type: "paragraph", text: "I explored Tobit regression to model expected financial impact directly while accounting for censoring in the target variable." },
          { type: "paragraph", text: "The resulting continuous score could be used to rank cases. This was an applied experiment built around the operational need, not an industrialized machine-learning system." },
        ],
      },
      {
        title: "The evaluation",
        blocks: [
          { type: "paragraph", text: "The model was compared with the existing targeting process over a two-month test period. In that evaluation, the cases it selected showed approximately 10% higher financial impact than the baseline." },
          { type: "paragraph", text: "The result was promising, but it came from a short window and a limited test volume. It should not be read as a guaranteed production uplift." },
        ],
      },
      {
        title: "Limitations",
        blocks: [
          { type: "paragraph", text: "A longer and more structured evaluation would have been required to assess the stability of the gain, examine bias and monitor the model over time." },
          { type: "paragraph", text: "The project did not reach the level of a mature ML pipeline: industrialization, monitoring and model governance still had to be built." },
        ],
      },
      {
        title: "What I took from it",
        blocks: [
          { type: "paragraph", text: "This work connected my applied mathematics background with a concrete operational problem. More importantly, it taught me to define a target that was useful to the business, evaluate a model carefully and explain its results without hiding their limits." },
        ],
      },
    ],
    note: "Professional project — code and data are not public.",
  },
};

const academicProjects: LocalizedArticle = {
  fr: {
    title: projectTitles.academicProjects.fr,
    date: "2023",
    intro: [
      "Deux projets réalisés pendant mes études en mathématiques appliquées et data, conservés ici pour leur contexte et leur démarche.",
      "Ils ne représentent pas nécessairement la manière dont je construirais les mêmes analyses aujourd'hui, mais ils documentent mes premiers travaux complets de text mining, de modélisation et d'interprétabilité.",
    ],
    sections: [
      {
        title: "Analyse textuelle du rap français",
        index: "01",
        blocks: [
          { type: "paragraph", text: "Ce projet partait d'une question simple : peut-on distinguer une chanson de rap français d'une chanson pop uniquement à partir de ses paroles ? L'analyse réunissait environ 50 000 titres de rap et 60 000 titres pop issus de deux jeux de données publics." },
          { type: "paragraph", text: "J'ai d'abord tokenisé les paroles pour explorer la taille et la diversité du vocabulaire par artiste. Les nuages de mots permettaient ensuite de comparer visuellement les termes fréquents, comme dans cet exemple construit à partir des paroles de Booba." },
          {
            type: "image",
            src: "/project-images/french-rap-wordcloud.png",
            alt: "Nuage de mots construit à partir des paroles de Booba",
          },
          { type: "paragraph", text: "Pour la partie prédictive, les paroles ont été vectorisées avec TF-IDF. Une comparaison limitée par les ressources disponibles a porté sur XGBoost et ExtraTrees ; le meilleur modèle atteignait un F1-score de 0,91 et une ROC AUC de 0,97 sur l'échantillon de test." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "Les sources provenaient de deux jeux de données Kaggle consacrés au " },
              { text: "rap français", href: externalUrls.frenchRapDataset },
              { text: " et aux " },
              { text: "paroles Genius", href: externalUrls.geniusLyricsDataset },
              { text: ". Le " },
              { text: "rapport académique archivé", href: "/reports/french-songs.pdf" },
              { text: " détaille l'analyse originale." },
            ],
          },
        ],
      },
      {
        title: "Classification des prix Airbnb",
        index: "02",
        blocks: [
          { type: "paragraph", text: "Ce projet d'examen utilisait plus de 35 000 annonces Airbnb à Rio de Janeiro. La tâche consistait à prédire une catégorie de prix définie à partir des quantiles du jeu de données, plutôt qu'un prix exact." },
          { type: "paragraph", text: "La préparation ajoutait notamment la distance au stade Maracanã et au Christ Rédempteur aux caractéristiques de l'annonce. J'ai comparé Random Forest, XGBoost et ExtraTrees ; le meilleur résultat provenait d'un modèle XGBoost avec une profondeur maximale de 7." },
          {
            type: "image",
            src: "/project-images/rio-airbnb-shap.png",
            alt: "Importance SHAP des variables du modèle de classification des prix Airbnb",
          },
          { type: "paragraph", text: "L'analyse SHAP montrait que la distance au Maracanã et le quartier faisaient partie des variables les plus influentes selon la classe de prix. Le type de logement et sa capacité contribuaient également aux prédictions." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "Le " },
              { text: "rapport académique archivé", href: "/reports/rio-airbnb.pdf" },
              { text: " présente la préparation des données, la comparaison des modèles et l'analyse d'interprétabilité." },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: projectTitles.academicProjects.en,
    date: "2023",
    intro: [
      "Two projects completed during my applied mathematics and data studies, kept here for their context and methodology.",
      "They do not necessarily represent how I would build the same analyses today, but they document my first complete work in text mining, predictive modeling and interpretability.",
    ],
    sections: [
      {
        title: "French Rap Text Mining",
        index: "01",
        blocks: [
          { type: "paragraph", text: "This project started with a simple question: can a model distinguish a French rap song from a pop song using lyrics alone? The analysis combined around 50,000 rap tracks and 60,000 pop tracks from two public datasets." },
          { type: "paragraph", text: "I first tokenized the lyrics to explore vocabulary size and diversity by artist. Word clouds then provided a visual comparison of frequent terms, as in this example built from Booba's lyrics." },
          {
            type: "image",
            src: "/project-images/french-rap-wordcloud.png",
            alt: "Word cloud built from Booba's lyrics",
          },
          { type: "paragraph", text: "For the predictive part, the lyrics were vectorized with TF-IDF. A resource-constrained comparison covered XGBoost and ExtraTrees; the best model reached an F1 score of 0.91 and a ROC AUC of 0.97 on the test sample." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "The sources were two Kaggle datasets covering " },
              { text: "French rap", href: externalUrls.frenchRapDataset },
              { text: " and " },
              { text: "Genius lyrics", href: externalUrls.geniusLyricsDataset },
              { text: ". The " },
              { text: "archived academic report", href: "/reports/french-songs.pdf" },
              { text: " contains the original analysis." },
            ],
          },
        ],
      },
      {
        title: "Airbnb Price Classification",
        index: "02",
        blocks: [
          { type: "paragraph", text: "This final-exam project used more than 35,000 Airbnb listings in Rio de Janeiro. The task was to predict a price category defined from dataset quantiles rather than an exact price." },
          { type: "paragraph", text: "Feature preparation added the distance to Maracanã stadium and Christ the Redeemer to the listing characteristics. I compared Random Forest, XGBoost and ExtraTrees; the best result came from an XGBoost model with a maximum depth of 7." },
          {
            type: "image",
            src: "/project-images/rio-airbnb-shap.png",
            alt: "SHAP feature importance for the Airbnb price-classification model",
          },
          { type: "paragraph", text: "The SHAP analysis showed that distance to Maracanã and neighborhood were among the most influential variables depending on the price class. Property type and capacity also contributed to the predictions." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "The " },
              { text: "archived academic report", href: "/reports/rio-airbnb.pdf" },
              { text: " covers data preparation, model comparison and the interpretability analysis." },
            ],
          },
        ],
      },
    ],
  },
};

const lolWeeklyDataPipeline: LocalizedArticle = {
  fr: {
    title: projectTitles.lolWeeklyDataPipeline.fr,
    date: "2025",
    intro: [
      "Ce projet est un pipeline batch Python exécuté chaque semaine par GitHub Actions. Il analyse les matchs classés récents des joueurs dits \"high elo\" (Challenger et Grandmaster) sur le serveur européen et publie des snapshots JSON statiques.",
      "Les données affichées ci-dessous sont chargées directement depuis le dernier snapshot publié dans le dépôt GitHub.",
    ],
    sections: [
      {
        title: "Fonctionnement",
        blocks: [
          { type: "heading-3", text: "Collecte" },
          {
            type: "list",
            items: [
              "Récupère les joueurs Challenger et Grandmaster sur EUW.",
              "Récupère jusqu'à cinq matchs classés récents par joueur sur une fenêtre de sept jours.",
              "Déduplique les matchs et respecte les limites de l'API Riot.",
              "Réutilise les réponses brutes déjà téléchargées.",
            ],
          },
          { type: "heading-3", text: "Transformation" },
          {
            type: "list",
            items: [
              "Retire les remakes (parties de moins de quinze minutes).",
              "Groupe les données par champion, rôle et patch.",
              "Calcule le win rate, le pick rate et le ratio KDA.",
            ],
          },
          { type: "heading-3", text: "Publication" },
          {
            type: "list",
            items: [
              "Produit quatre fichiers JSON statiques.",
              "Publie les fichiers générés dans le dépôt GitHub.",
              "Permet au portfolio de lire directement le snapshot public.",
            ],
          },
        ],
      },
      {
        title: "Décisions techniques",
        blocks: [
          {
            type: "list",
            items: [
              "Une architecture batch plutôt qu'une API permanente.",
              "Aucune base de données nécessaire pour ce volume et cette fréquence.",
              "Un cache des données brutes pour permettre la reprise de la collecte.",
              "Des seuils d'échec pour éviter de publier un snapshot trop incomplet.",
              "Un classement avec un minimum de 30 parties et la borne basse de Wilson à 95 %.",
              "Une comparaison des pick rates uniquement entre deux snapshots du même patch.",
            ],
          },
        ],
      },
      {
        title: "Limites connues",
        blocks: [
          {
            type: "list",
            items: [
              "EUW uniquement.",
              "Joueurs Challenger et Grandmaster uniquement.",
              "Cinq matchs récents maximum par joueur.",
              "Mise à jour hebdomadaire (pas en temps réel).",
              "Dépendance à l'API et aux quotas Riot.",
            ],
          },
        ],
      },
      {
        title: "Source",
        blocks: [
          { type: "paragraph", text: "Le projet utilise Python, pandas, l'API Riot, pytest et GitHub Actions." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "Le code source et les sorties publiées sont disponibles sur " },
              { text: "GitHub", href: externalUrls.lolMetaTrackerRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: projectTitles.lolWeeklyDataPipeline.en,
    date: "2025",
    intro: [
      "This project is a Python batch pipeline run every week by GitHub Actions. It analyzes recent ranked matches from so-called high-elo players (Challenger and Grandmaster) on the European server, and publishes static JSON snapshots.",
      "The data shown below is loaded directly from the latest snapshot published in the GitHub repository.",
    ],
    sections: [
      {
        title: "How it works",
        blocks: [
          { type: "heading-3", text: "Collection" },
          {
            type: "list",
            items: [
              "Retrieves Challenger and Grandmaster players on EUW.",
              "Fetches up to five recent ranked matches per player within a seven-day window.",
              "Deduplicates matches and respects Riot API limits.",
              "Reuses raw responses that have already been downloaded.",
            ],
          },
          { type: "heading-3", text: "Transformation" },
          {
            type: "list",
            items: [
              "Removes remakes (games shorter than fifteen minutes).",
              "Groups data by champion, role and patch.",
              "Calculates win rate, pick rate and KDA ratio.",
            ],
          },
          { type: "heading-3", text: "Publication" },
          {
            type: "list",
            items: [
              "Produces four static JSON files.",
              "Commits the outputs to GitHub.",
              "Lets the portfolio read the public snapshot directly.",
            ],
          },
        ],
      },
      {
        title: "Technical decisions",
        blocks: [
          {
            type: "list",
            items: [
              "A batch architecture rather than a permanently running API.",
              "No database required for this volume and frequency.",
              "A raw-data cache so collection can resume after interruption.",
              "Failure thresholds that prevent an overly incomplete snapshot from being published.",
              "Portfolio rankings requiring at least 30 games and using the 95% Wilson lower bound.",
              "Pick-rate comparisons only between two snapshots from the same patch.",
            ],
          },
        ],
      },
      {
        title: "Known limitations",
        blocks: [
          {
            type: "list",
            items: [
              "EUW only.",
              "Challenger and Grandmaster players only.",
              "A maximum of five recent matches per player.",
              "Weekly data (not real time).",
              "Dependent on the Riot API and its rate limits.",
            ],
          },
        ],
      },
      {
        title: "Source",
        blocks: [
          { type: "paragraph", text: "The project uses Python, pandas, the Riot API, pytest and GitHub Actions." },
          {
            type: "rich-paragraph",
            segments: [
              { text: "The source code and published outputs are available on " },
              { text: "GitHub", href: externalUrls.lolMetaTrackerRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
};

const footballScoutAgent: LocalizedArticle = {
  fr: {
    title: projectTitles.footballScoutAgent.fr,
    date: "2025",
    intro: [
      "Football Scout Agent permet d'interroger en langage naturel près de 2 000 joueurs des cinq grands championnats européens.",
      "Les données couvrent la saison 2024-25 : 96 clubs, des statistiques FBref enrichies avec Transfermarkt et un minimum de 450 minutes par joueur.",
    ],
    sections: [
      {
        title: "Le problème",
        blocks: [
          { type: "paragraph", text: "Une question de scouting combine souvent des contraintes exactes : championnat, poste, âge, budget ou seuil statistique. Le système doit appliquer chacune d'elles et retourner une réponse vérifiable, sans inventer de joueur ni de mesure." },
        ],
      },
      {
        title: "Comment cela fonctionne",
        blocks: [
          { type: "paragraph", text: "Les statistiques brutes sont normalisées par 90 minutes, puis converties en z-scores par championnat et groupe de position. Des scores composites pondérés pour GK, DF, MF et FW permettent de comparer les joueurs et de mesurer l'écart d'un club par rapport à la moyenne de son championnat." },
          { type: "paragraph", text: "À l'exécution, la question passe par openai/gpt-oss-20b sur Groq, qui produit un plan JSON structuré. SQLGlot valide ensuite la requête avant son exécution dans SQLite en lecture seule, puis la réponse JSON est formatée de manière déterministe." },
          { type: "heading-3", text: "Exemple vérifié" },
          { type: "paragraph", text: "Question : « Who are the top 3 forwards in Ligue 1? »" },
          {
            type: "code",
            language: "sql",
            code: "SELECT name, team, composite_score\nFROM players\nWHERE league = 'Ligue 1'\n  AND position = 'FW'\n  AND minutes_played >= 450\nORDER BY composite_score DESC\nLIMIT 3;",
          },
          { type: "paragraph", text: "Résultat : Ousmane Dembélé, Gonçalo Ramos et Mika Biereth. L'API renvoie également la requête SQL validée utilisée pour produire ce résultat." },
        ],
      },
      {
        title: "Pourquoi SQL",
        blocks: [
          { type: "paragraph", text: "Le text-to-SQL est un choix adapté à ce projet : on a des données tabulaires et des contraintes exactes. SQL garantit qu'un filtre de poste, de championnat ou de budget est effectivement appliqué. Un système RAG serait plus pertinent pour des rapports de scouting, des commentaires de match ou d'autres textes non structurés. Ici, on a de la donnée quantitative." },
        ],
      },
      {
        title: "Fiabilité et sécurité",
        blocks: [
          {
            type: "list",
            items: [
              "SQLGlot n'accepte qu'une requête SELECT ou WITH et vérifie les tables et colonnes autorisées.",
              "SQLite reste immutable et en lecture seule ; les résultats sont limités à 20 lignes et les requêtes à deux secondes.",
              "L'API limite /scout à trois requêtes par minute et renvoie des erreurs 503 explicites lorsque le modèle est indisponible.",
            ],
          },
          { type: "paragraph", text: "Le diagnostic du besoin d'un club est traité localement après résolution de son nom canonique. Pour FC Nantes, le système identifie l'attaque comme priorité, avec un écart composite de -0,35 et un rang de 14/18 en Ligue 1." },
        ],
      },
      {
        title: "Le compromis coût zéro",
        blocks: [
          { type: "paragraph", text: "Le plan de requête est généré par openai/gpt-oss-20b sur le free tier de Groq. La majorité des questions utilise un seul appel LLM ; la validation, l'exécution SQL et le formatage du JSON restent déterministes et locaux." },
          {
            type: "list",
            items: [
              "Les questions répétées sont servies depuis un cache en mémoire.",
              "Le service peut être temporairement indisponible lorsque le quota gratuit est épuisé. Cette démonstration accepte une légère perte de qualité face à un modèle premium afin de rester entièrement gratuite.",
            ],
          },
        ],
      },
      {
        title: "Limites connues et code source",
        blocks: [
          {
            type: "list",
            items: [
              "Quatre groupes de position seulement : GK, DF, MF et FW.",
              "Les statistiques spécifiques aux gardiens sont incomplètes.",
              "Environ 15 % des joueurs n'ont pas d'enrichissement Transfermarkt.",
              "Les données sont un snapshot statique de la saison 2024-25 et excluent les joueurs sous 450 minutes.",
            ],
          },
          {
            type: "rich-paragraph",
            segments: [
              { text: "Le code source, le schéma de données et les tests sont disponibles sur " },
              { text: "GitHub", href: externalUrls.footballScoutRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: projectTitles.footballScoutAgent.en,
    date: "2025",
    intro: [
      "Football Scout Agent makes it possible to query nearly 2,000 players from Europe's Big Five leagues in natural language.",
      "The data covers the 2024-25 season: 96 clubs, FBref statistics enriched with Transfermarkt and a minimum of 450 minutes per player.",
    ],
    sections: [
      {
        title: "The problem",
        blocks: [
          { type: "paragraph", text: "A scouting question often combines exact constraints: league, position, age, budget or a statistical threshold. The system has to apply every constraint and return a verifiable answer without inventing a player or metric." },
        ],
      },
      {
        title: "How it works",
        blocks: [
          { type: "paragraph", text: "Raw statistics are normalized per 90 minutes, then converted into z-scores by league and position group. Composite scores weighted for GK, DF, MF and FW make it possible to compare players and measure a club's gap from its league average." },
          { type: "paragraph", text: "At runtime, the question goes to openai/gpt-oss-20b on Groq, which produces a structured JSON plan. SQLGlot then validates the query before it runs against read-only SQLite, and the JSON response is formatted deterministically." },
          { type: "heading-3", text: "Verified example" },
          { type: "paragraph", text: "Question: “Who are the top 3 forwards in Ligue 1?”" },
          {
            type: "code",
            language: "sql",
            code: "SELECT name, team, composite_score\nFROM players\nWHERE league = 'Ligue 1'\n  AND position = 'FW'\n  AND minutes_played >= 450\nORDER BY composite_score DESC\nLIMIT 3;",
          },
          { type: "paragraph", text: "Result: Ousmane Dembélé, Gonçalo Ramos and Mika Biereth. The API also returns the validated SQL query used to produce the result." },
        ],
      },
      {
        title: "Why SQL",
        blocks: [
          { type: "paragraph", text: "Text-to-SQL is a good fit for this project: the data is tabular and the constraints are exact. SQL guarantees that a position, league or budget filter is actually applied. RAG would be more appropriate for scouting reports, match commentary or other unstructured text. Here, the data is quantitative." },
        ],
      },
      {
        title: "Reliability and safety",
        blocks: [
          {
            type: "list",
            items: [
              "SQLGlot accepts only one SELECT or WITH query and validates allowlisted tables and columns.",
              "SQLite remains immutable and read-only; results are capped at 20 rows and queries at two seconds.",
              "The API limits /scout to three requests per minute and returns explicit 503 errors when the model is unavailable.",
            ],
          },
          { type: "paragraph", text: "Club-need diagnostics are handled locally after resolving the canonical club name. For FC Nantes, the system identifies attack as the priority, with a -0.35 composite gap and a 14/18 Ligue 1 rank." },
        ],
      },
      {
        title: "The zero-cost trade-off",
        blocks: [
          { type: "paragraph", text: "The query plan is generated by openai/gpt-oss-20b on Groq's free tier. Most questions use one LLM call; SQL validation, execution and deterministic JSON formatting remain local." },
          {
            type: "list",
            items: [
              "Repeated questions are served from an in-memory cache.",
              "The service can be temporarily unavailable when the free quota is exhausted. A small quality loss compared with a premium model is accepted for this demo, since the goal is to keep it entirely free.",
            ],
          },
        ],
      },
      {
        title: "Known limitations and source code",
        blocks: [
          {
            type: "list",
            items: [
              "Only four position groups: GK, DF, MF and FW.",
              "Goalkeeper-specific statistics are incomplete.",
              "Around 15% of players have no Transfermarkt enrichment.",
              "The data is a static snapshot of the 2024-25 season and excludes players below 450 minutes.",
            ],
          },
          {
            type: "rich-paragraph",
            segments: [
              { text: "The source code, data schema and tests are available on " },
              { text: "GitHub", href: externalUrls.footballScoutRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
};

const frenchRapRag: LocalizedArticle = {
  fr: {
    title: projectTitles.frenchRapRag.fr,
    date: "2025",
    intro: [
      "Un moteur RAG qui permet d'interroger les paroles de 22 artistes de rap français et d'obtenir une réponse reliée aux morceaux utilisés comme sources.",
      "Le corpus rassemble environ 3 400 chansons, découpées en 15 496 passages indexés.",
    ],
    sections: [
      {
        title: "Le problème",
        blocks: [
          { type: "paragraph", text: "Une question sur un thème, une émotion ou un morceau précis ne peut pas être résolue correctement avec les seules connaissances générales d'un modèle. Il faut retrouver les passages pertinents dans les paroles, puis limiter la réponse à ces éléments." },
          { type: "paragraph", text: "Le projet sépare donc la recherche documentaire de la génération. Les paroles servent de corpus vérifiable et les titres cités dans la réponse restent visibles comme sources." },
        ],
      },
      {
        title: "Comment le système fonctionne",
        blocks: [
          { type: "paragraph", text: "La collecte initiale utilise Genius. Le corpus et son index sont ensuite reconstruits hors ligne : les paroles sont découpées en fenêtres de 160 mots avec un chevauchement de 30 mots, puis les passages sont encodés localement avec intfloat/multilingual-e5-small." },
          { type: "paragraph", text: "Le routage est déterministe : un artiste nommé déclenche une recherche ciblée, plusieurs artistes une comparaison, et une question sans artiste interroge les 22 collections. Un seul embedding de requête est produit par Hugging Face puis réutilisé pour toutes les recherches ChromaDB locales." },
          { type: "paragraph", text: "En mode global, les candidats sont fusionnés par distance, dédupliqués par morceau et limités à deux passages par artiste avant de retenir les huit meilleurs. Une recherche ciblée conserve cinq passages et renforce les résultats associés lorsqu'un titre exact est mentionné." },
          { type: "paragraph", text: "Les passages récupérés sont transmis à openai/gpt-oss-120b sur Groq. La sortie structurée indique si la réponse est suffisamment étayée, le périmètre détecté et les morceaux effectivement cités." },
        ],
      },
      {
        title: "Décisions techniques",
        blocks: [
          { type: "paragraph", text: "Calculer les embeddings du corpus localement évite d'envoyer les paroles à un service distant et ne consomme pas de quota d'inférence pendant l'indexation. En production, seule la question du visiteur passe par Hugging Face, la recherche ChromaDB reste locale." },
          { type: "paragraph", text: "La détection d'artiste n'appelle pas le LLM. Une question utilise donc normalement un appel Hugging Face pour l'embedding et un appel Groq pour la réponse, qu'elle soit ciblée, comparative ou globale." },
          { type: "paragraph", text: "Les textes des passages sont stockés dans un fichier compressé séparé des vecteurs. Cette reconstruction a réduit l'index complet d'environ 188 Mio à environ 48 Mio tout en conservant les 15 496 passages." },
          { type: "paragraph", text: "L'API FastAPI est déployée sur Render. Les endpoints de génération sont limités à trois requêtes par minute et par adresse IP afin de rester compatibles avec les quotas des services utilisés." },
        ],
      },
      {
        title: "Limites connues",
        blocks: [
          {
            type: "list",
            items: [
              "La couverture dépend des paroles et métadonnées disponibles sur Genius.",
              "Le système analyse les paroles, pas le son, la production ou l'interprétation vocale.",
              "L'évaluation reste petite et ne mesure pas encore tous les comportements de génération.",
              "Hugging Face, Groq et Render imposent leurs propres quotas et contraintes de disponibilité.",
              "Un démarrage à froid de Render peut retarder la première requête d'environ trente secondes.",
              "Chaque question est indépendante : aucune mémoire conversationnelle n'est conservée.",
            ],
          },
        ],
      },
      {
        title: "Source",
        blocks: [
          {
            type: "rich-paragraph",
            segments: [
              { text: "Le code source, le pipeline d'indexation, l'API et les cas d'évaluation sont disponibles sur " },
              { text: "GitHub", href: externalUrls.frenchRapRagRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: projectTitles.frenchRapRag.en,
    date: "2025",
    intro: [
      "A RAG engine for querying lyrics from 22 French rap artists and receiving an answer linked to the songs used as sources.",
      "The corpus contains around 3,400 songs split into 15,496 indexed passages.",
    ],
    sections: [
      {
        title: "The problem",
        blocks: [
          { type: "paragraph", text: "A question about a theme, emotion or specific track cannot be answered reliably from a model's general knowledge alone. The relevant lyric passages have to be retrieved first, and the answer must remain limited to that evidence." },
          { type: "paragraph", text: "Retrieval and generation are kept separate: lyrics provide verifiable evidence, while cited song titles remain visible in the answer." },
        ],
      },
      {
        title: "How it works",
        blocks: [
          { type: "paragraph", text: "The initial collection uses Genius. The corpus and index are then rebuilt offline: lyrics are split into 160-word windows with a 30-word overlap, and passages are encoded locally with intfloat/multilingual-e5-small." },
          { type: "paragraph", text: "Routing is deterministic: one named artist triggers a targeted search, multiple artists a comparison, and a question without an artist searches all 22 collections. Hugging Face produces one query embedding, which is then reused across every local ChromaDB search." },
          { type: "paragraph", text: "In global mode, candidates are merged by distance, deduplicated by track and limited to two passages per artist before the best eight are retained. A targeted search keeps five passages and boosts matching results when an exact track title is mentioned." },
          { type: "paragraph", text: "The retrieved passages are sent to openai/gpt-oss-120b on Groq. The structured output states whether the evidence is sufficient, identifies the detected scope and lists the songs actually cited." },
        ],
      },
      {
        title: "Technical decisions",
        blocks: [
          { type: "paragraph", text: "Computing corpus embeddings locally avoids sending lyrics to a remote service and consumes no inference quota during indexing. In production, only the visitor's question goes through Hugging Face, while the ChromaDB search remains local." },
          { type: "paragraph", text: "Artist detection does not call the LLM. Each question normally uses one Hugging Face call for its embedding and one Groq call for the answer, whether the scope is targeted, comparative or global." },
          { type: "paragraph", text: "Passage text is stored in a compressed file separate from the vectors. This rebuild reduced the complete index from roughly 188 MiB to around 48 MiB while preserving all 15,496 passages." },
          { type: "paragraph", text: "The FastAPI service is deployed on Render. Generation endpoints are limited to three requests per minute and IP address to remain compatible with the quotas of the services involved." },
        ],
      },
      {
        title: "Known limitations",
        blocks: [
          {
            type: "list",
            items: [
              "Coverage depends on the lyrics and metadata available through Genius.",
              "The system analyzes lyrics, not sound, production or vocal delivery.",
              "The evaluation is still small and does not yet measure every generation behavior.",
              "Hugging Face, Groq and Render impose their own quotas and availability constraints.",
              "A Render cold start can delay the first request by around thirty seconds.",
              "Each question is independent: no conversational memory is retained.",
            ],
          },
        ],
      },
      {
        title: "Source",
        blocks: [
          {
            type: "rich-paragraph",
            segments: [
              { text: "The source code, indexing pipeline, API and evaluation cases are available on " },
              { text: "GitHub", href: externalUrls.frenchRapRagRepository },
              { text: "." },
            ],
          },
        ],
      },
    ],
  },
};

const ticketWorkflowPrototype: LocalizedArticle = {
  fr: {
    title: projectTitles.ticketWorkflowPrototype.fr,
    date: "2026",
    intro: [
      "Une application web locale que j'ai construite pour simplifier le suivi de mon propre flux de tickets d'intégration chez Agicap.",
      "Il s'agit d'un prototype personnel utilisé uniquement par moi, et non d'un produit interne Agicap déployé auprès de l'équipe.",
    ],
    sections: [
      {
        title: "Le problème",
        blocks: [
          { type: "paragraph", text: "Dans mon quotidien d'integration engineer, je pouvais suivre environ 30 tickets en parallèle. Chacun avançait à un rythme différent, avec des relances, des prochaines actions et des informations à ne pas perdre." },
          { type: "paragraph", text: "Les outils existants ne correspondaient pas bien à la manière dont je voulais organiser ce suivi. Passer régulièrement d'un sujet client à l'autre augmentait la charge mentale, surtout lorsqu'il fallait se rappeler ce qui bloquait et quand relancer." },
        ],
      },
      {
        title: "Le prototype",
        blocks: [
          { type: "paragraph", text: "J'ai développé une application web en React et JavaScript qui rassemble une vue d'ensemble des tickets actifs et des prochaines étapes, une vue détaillée par ticket, des checklists, le suivi des relances et un espace de notes." },
          {
            type: "video",
            src: "/project-media/ticket-workflow-prototype.mp4",
            poster: "/project-images/ticket-workflow-dashboard.png",
            label: "Démonstration de la navigation dans le prototype de suivi des tickets",
          },
          { type: "paragraph", text: "L'interface réunit les informations utiles dans un format adapté à ma façon de travailler, sans chercher à devenir une plateforme complète." },
        ],
      },
      {
        title: "Comment je l'utilise",
        blocks: [
          { type: "paragraph", text: "Le prototype tourne localement et reste construit autour de mon propre workflow. Je suis actuellement son seul utilisateur." },
          { type: "paragraph", text: "Je m'en sers pour expérimenter une organisation plus claire de mes sujets en cours et ajuster l'interface à partir de mon usage réel. Le projet m'a aussi amené vers un problème plus orienté produit que mes travaux centrés sur la donnée." },
        ],
      },
      {
        title: "Limites",
        blocks: [
          { type: "paragraph", text: "Le prototype reste local et mono-utilisateur. Il n'intègre pas encore Gainsight, Gmail ou Slack et n'a pas été déployé auprès de l'équipe." },
        ],
      },
    ],
    note: "Prototype personnel lié à mon travail — utilisé localement, code non disponible.",
  },
  en: {
    title: projectTitles.ticketWorkflowPrototype.en,
    date: "2026",
    intro: [
      "A local web application I built to make my own integration-ticket workflow at Agicap easier to manage.",
      "It is a personal prototype used only by me, not an internal Agicap product deployed to the team.",
    ],
    sections: [
      {
        title: "The problem",
        blocks: [
          { type: "paragraph", text: "In my day-to-day work as an integration engineer, I could be tracking around 30 tickets at the same time. Each moved at a different pace, with follow-ups, next actions and information that could not be lost." },
          { type: "paragraph", text: "The existing tools did not fit the way I wanted to organize that work. Moving repeatedly between client topics increased the cognitive overhead, especially when I needed to remember what was blocked and when to follow up." },
        ],
      },
      {
        title: "The prototype",
        blocks: [
          { type: "paragraph", text: "I built a React and JavaScript web application that combines an overview of active tickets and upcoming actions, a detailed ticket view, checklists, follow-up tracking and a space for notes." },
          {
            type: "video",
            src: "/project-media/ticket-workflow-prototype.mp4",
            poster: "/project-images/ticket-workflow-dashboard.png",
            label: "Navigation demo of the ticket workflow prototype",
          },
          { type: "paragraph", text: "The interface brings the useful information together around the way I work, without trying to become a complete platform." },
        ],
      },
      {
        title: "How I use it",
        blocks: [
          { type: "paragraph", text: "The prototype runs locally and remains built around my own workflow. I am currently its only user." },
          { type: "paragraph", text: "I use it to experiment with a clearer way to organize active topics and adjust the interface through real use. The project also moved me toward a more product-oriented problem than my data-focused work." },
        ],
      },
      {
        title: "Limitations",
        blocks: [
          { type: "paragraph", text: "The prototype remains local and single-user. It has no external integrations, shared authentication or team deployment; those are possible next steps, not current capabilities." },
        ],
      },
    ],
    note: "Personal work-related prototype — used locally, code unavailable.",
  },
};

const filament: LocalizedArticle = {
  fr: {
    title: projectTitles.filament.fr,
    date: "2026",
    intro: [
      "Filament est un jeu d'énigmes quotidiennes : une énigme par jour, en logique, probabilités ou petites maths. La réponse est toujours un nombre et on a trois essais. Après chaque erreur, le jeu indique s'il faut viser plus haut ou plus bas et débloque un indice.",
      "Je l'ai conçu, développé, mis en production et promu seul, en français et en anglais, sur playfilament.com.",
    ],
    sections: [
      {
        title: "Le pari",
        blocks: [
          { type: "paragraph", text: "Un jeu quotidien vit ou meurt sur une seule question : est-ce que les gens reviennent le lendemain ?" },
          { type: "paragraph", text: "Je voulais y répondre avec de vrais joueurs le plus tôt possible, et pour le moins cher possible." },
          { type: "image", src: "/project-images/filament-screens.png", alt: "Deux écrans de Filament sur mobile : l'énigme du jour et l'écran des règles" },
        ],
      },
      {
        title: "Pourquoi le web",
        blocks: [
          { type: "paragraph", text: "Le format naturel d'un jeu quotidien, c'est une app mobile. Mais publier sur l'App Store demande un compte développeur payant, une review à chaque version et une fiche store, avant même de savoir si quelqu'un veut jouer." },
          { type: "paragraph", text: "J'ai donc lancé Filament comme une application web. Un lien suffit pour jouer, sans installation. Une nouvelle version est en ligne en quelques minutes, et chaque partie est mesurée dès le premier jour." },
        ],
      },
      {
        title: "Ce que j'ai construit",
        blocks: [
          {
            type: "list",
            items: [
              "Une application React (Vite) hébergée sur Cloudflare Pages, pensée d'abord pour le mobile, en français et en anglais.",
              "Un backend Supabase : Postgres, fonctions RPC pour servir l'énigme du jour, migrations versionnées et purge automatique des anciennes données avec pg_cron.",
              "Une vérification des réponses côté serveur : le navigateur ne reçoit jamais la réponse avant la fin de la partie. Chaque essai passe par une fonction Supabase qui compare la réponse et compte les tentatives elle-même. La solution n'est renvoyée qu'après une victoire ou le troisième essai, et la clé publique ne peut lire aucune table, seulement appeler ces fonctions.",
              "Un suivi des sources : chaque lien partagé (reel, post Reddit) porte son propre paramètre, enregistré avec chaque réponse.",
              "Des vues SQL qui calculent la rétention à J1 et J7 par cohorte de premier jour de jeu, globalement et par canal.",
            ],
          },
        ],
      },
      {
        title: "Faire venir des joueurs",
        blocks: [
          { type: "paragraph", text: "Je n'ai payé aucune publicité. Toute l'acquisition est venue de contenu :" },
          {
            type: "list",
            items: [
              "Un pipeline de reels en motion design générés par code, une vidéo par énigme, publiés sur Instagram, TikTok et YouTube Shorts. Un reel Instagram a dépassé 50 000 vues et un autre 32 000.",
              "Des posts Reddit sur des communautés d'énigmes et de jeux, chacun avec son propre lien suivi.",
            ],
          },
        ],
      },
      {
        title: "Les chiffres",
        blocks: [
          { type: "paragraph", text: "En un mois, du 12 octobre au 11 novembre 2026 :" },
          {
            type: "list",
            items: [
              "165 joueurs, 222 parties et 453 réponses sur 30 énigmes ;",
              "70 % des parties résolues, dont la moitié dès le premier essai ;",
              "81 % des joueurs venus d'Instagram, 12 % de Reddit ;",
              "une rétention d'environ 5 % à J1 et 2 % à J7.",
            ],
          },
        ],
      },
      {
        title: "Ce que les chiffres m'ont appris",
        blocks: [
          { type: "paragraph", text: "L'acquisition fonctionnait : le jour où le reel à 50 000 vues est sorti, 63 nouveaux joueurs sont arrivés, plus d'un tiers du total. Les énigmes aussi : sept parties sur dix se terminaient par une bonne réponse." },
          { type: "paragraph", text: "Mais presque personne ne revenait le lendemain. Des dizaines de milliers de vues donnaient quelques dizaines de joueurs, et ces joueurs ne prenaient pas l'habitude. Pour un jeu quotidien, c'est le seul chiffre qui compte." },
          { type: "paragraph", text: "J'ai donc arrêté le marketing plutôt que de continuer à produire de l'attention qui ne se transformait pas en joueurs réguliers. Le test n'a coûté ni compte développeur ni budget publicitaire, seulement du temps." },
        ],
      },
      {
        title: "Aujourd'hui",
        blocks: [
          {
            type: "rich-paragraph",
            segments: [
              { text: "Le site " },
              { text: "playfilament.com", href: externalUrls.filamentSite },
              { text: " reste en ligne en mode infini : les énigmes déjà publiées tournent en boucle, sans nouveau contenu à produire. Le jeu reste jouable sans demander de maintenance." },
            ],
          },
        ],
      },
      {
        title: "Limites connues",
        blocks: [
          {
            type: "list",
            items: [
              "L'identifiant joueur est généré dans le navigateur : en vidant son stockage, on peut rejouer une énigme ou perdre exprès pour voir la solution. C'est le niveau de protection habituel des jeux quotidiens sans compte.",
              "Un mois de données et 165 joueurs : les taux de rétention restent indicatifs, surtout par canal.",
            ],
          },
        ],
      },
      {
        title: "Ce que j'en retiens",
        blocks: [
          { type: "paragraph", text: "C'est le projet où j'ai tenu tous les rôles : produit, développement, contenu, acquisition et analyse." },
          { type: "paragraph", text: "Il m'a surtout appris à formuler une hypothèse produit mesurable, à choisir le moyen le moins cher de la tester, puis à accepter la réponse des données, même quand ce n'est pas celle que j'espérais." },
        ],
      },
    ],
    note: "Projet personnel — code non public.",
  },
  en: {
    title: projectTitles.filament.en,
    date: "2026",
    intro: [
      "Filament is a daily puzzle game: one puzzle a day, covering logic, probability or light maths. The answer is always a number and you get three tries. After each wrong guess, the game tells you whether to aim higher or lower and unlocks a hint.",
      "I designed, built, shipped and promoted it on my own, in French and English, at playfilament.com.",
    ],
    sections: [
      {
        title: "The bet",
        blocks: [
          { type: "paragraph", text: "A daily game lives or dies on a single question: do people come back the next day?" },
          { type: "paragraph", text: "I wanted to answer it with real players as early and as cheaply as possible." },
          { type: "image", src: "/project-images/filament-screens.png", alt: "Two Filament screens on mobile: the daily puzzle and the rules screen" },
        ],
      },
      {
        title: "Why the web",
        blocks: [
          { type: "paragraph", text: "The natural format for a daily game is a mobile app. But publishing on the App Store means a paid developer account, a review for every release and a store listing, before even knowing whether anyone wants to play." },
          { type: "paragraph", text: "So I launched Filament as a web app. A link is all it takes to play, with nothing to install. A new version goes live in minutes, and every game is measured from day one." },
        ],
      },
      {
        title: "What I built",
        blocks: [
          {
            type: "list",
            items: [
              "A mobile-first React (Vite) app hosted on Cloudflare Pages, in French and English.",
              "A Supabase backend: Postgres, RPC functions that serve the daily puzzle, versioned migrations and automatic purging of old data with pg_cron.",
              "Server-side answer checking: the browser never receives the answer before the game ends. Every guess goes through a Supabase function that checks it and counts attempts itself. The solution is only returned after a win or the third try, and the public key cannot read any table, only call these functions.",
              "Source tracking: every shared link (reel, Reddit post) carries its own parameter, stored with each guess.",
              "SQL views that compute day-1 and day-7 retention by first-play cohort, overall and per channel.",
            ],
          },
        ],
      },
      {
        title: "Bringing players in",
        blocks: [
          { type: "paragraph", text: "I paid for no advertising. All acquisition came from content:" },
          {
            type: "list",
            items: [
              "A pipeline of code-generated motion design reels, one video per puzzle, published on Instagram, TikTok and YouTube Shorts. One Instagram reel passed 50,000 views and another 32,000.",
              "Reddit posts in puzzle and gaming communities, each with its own tracked link.",
            ],
          },
        ],
      },
      {
        title: "The numbers",
        blocks: [
          { type: "paragraph", text: "Over one month, from October 12 to November 11, 2026:" },
          {
            type: "list",
            items: [
              "165 players, 222 games and 453 guesses across 30 puzzles;",
              "70% of games solved, half of them on the first try;",
              "81% of players came from Instagram, 12% from Reddit;",
              "retention of about 5% on day 1 and 2% on day 7.",
            ],
          },
        ],
      },
      {
        title: "What the numbers taught me",
        blocks: [
          { type: "paragraph", text: "Acquisition worked: on the day the 50,000-view reel came out, 63 new players arrived, more than a third of the total. The puzzles worked too: seven games out of ten ended with a correct answer." },
          { type: "paragraph", text: "But almost nobody came back the next day. Tens of thousands of views turned into a few dozen players, and those players did not build a habit. For a daily game, that is the only number that matters." },
          { type: "paragraph", text: "So I stopped marketing rather than keep producing attention that did not turn into regular players. The test cost no developer account and no ad budget, only time." },
        ],
      },
      {
        title: "Today",
        blocks: [
          {
            type: "rich-paragraph",
            segments: [
              { text: "playfilament.com", href: externalUrls.filamentSite },
              { text: " stays online in infinite mode: the puzzles already published loop, with no new content to produce. The game stays playable without needing maintenance." },
            ],
          },
        ],
      },
      {
        title: "Known limitations",
        blocks: [
          {
            type: "list",
            items: [
              "The player ID is generated in the browser: clearing storage lets someone replay a puzzle or lose on purpose to see the solution. That is the usual level of protection for daily games without accounts.",
              "One month of data and 165 players: retention rates are indicative, especially per channel.",
            ],
          },
        ],
      },
      {
        title: "What I take away",
        blocks: [
          { type: "paragraph", text: "This is the project where I held every role: product, development, content, acquisition and analysis." },
          { type: "paragraph", text: "Above all, it taught me to frame a measurable product hypothesis, pick the cheapest way to test it, then accept the data's answer, even when it is not the one I hoped for." },
        ],
      },
    ],
    note: "Personal project — code not public.",
  },
};

export const articles: Record<ArticleSlug, LocalizedArticle> = {
  "lol-weekly-data-pipeline": lolWeeklyDataPipeline,
  "football-scout-agent": footballScoutAgent,
  "caf-report-automation": cafReportAutomation,
  "french-rap-rag": frenchRapRag,
  "ticket-workflow-prototype": ticketWorkflowPrototype,
  "tobit-fraud-targeting": tobitFraudTargeting,
  "academic-projects": academicProjects,
  filament,
};
