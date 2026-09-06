# Copywriting français du portfolio

> Ce fichier rassemble tous les textes français actuellement affichés dans le portfolio. Modifie librement le contenu rédactionnel. Garde de préférence les marqueurs `<!-- page:... -->`, les routes, les URLs et les chemins de médias : ils me permettront de réintégrer puis traduire tes textes sans ambiguïté.

> Les valeurs entre crochets comme `[nombre]` décrivent du contenu dynamique généré par l’application.

---

<!-- page:home -->
# Page d’accueil

**Route :** `/`

## Salutation

Salut, moi c'est Alex !

## Introduction

Je suis integration engineer chez Agicap, après trois ans dans la data à la CAF de la Côte-d'Or et une formation en mathématiques appliquées.

Je travaille surtout avec Python et SQL pour automatiser des tâches et rendre les données plus faciles à exploiter.

## Labels de section

- Introduction : info
- Projets : work

## Index des projets

000 Report Automation
001 LoL Data Pipeline
002 Football Scout Agent
003 Tobit Fraud Model
004 Ticket Workflow
005 French Rap RAG
006 Academic Projects
007 macOS Portfolio — lien externe : https://playground.alexdaucourt.dev

## Pied de page

- [LinkedIn](https://www.linkedin.com/in/alex-daucourt/)
- [GitHub](https://github.com/dauczer)
- [Email](mailto:alexdaucourt@gmail.com)
- [CV](/resume/alex-daucourt-cv-fr.pdf)

## Accessibilité et métadonnées

- Titre du document : Alex.
- Libellé du sélecteur de langue : View the site in English

---

<!-- page:lol-weekly-data-pipeline -->
# LoL Weekly Data Pipeline

**Route :** `/work/lol-weekly-data-pipeline`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2025

## Introduction

Ce projet est un pipeline batch Python exécuté chaque semaine par GitHub Actions. Il analyse les matchs classés récents des joueurs dits "high elo" (Challenger et Grandmaster) sur le serveur européen et publie des snapshots JSON statiques.

Les données affichées ci-dessous sont chargées directement depuis le dernier snapshot publié dans le dépôt GitHub.

## Textes de l’interface interactive

- **Titre :** Dernier snapshot
- **Chargement :** Chargement du dernier snapshot…
- **Indisponible :** Les données live sont temporairement indisponibles.
- **Lien de secours :** Voir le snapshot sur GitHub
- **Métadonnées :** Patch · Région · Matchs · Mise à jour
- **Navigation :** Postes · TOP · JUNGLE · MID · ADC · SUPPORT
- **Mesures :** WR · Pick · Parties · KDA
- **Évolution :** Évolutions hebdomadaires du pick rate · Hausses · Baisses
- **Comparaison indisponible :** La comparaison sera disponible après deux snapshots du même patch.
- **Changement de patch :** Le snapshot précédent utilisait le patch [précédent] ; les évolutions ne sont pas comparées avec le patch [actuel].

## Fonctionnement

### Collecte

- Récupère les joueurs Challenger et Grandmaster sur EUW.
- Récupère jusqu'à cinq matchs classés récents par joueur sur une fenêtre de sept jours.
- Déduplique les matchs et respecte les limites de l'API Riot.
- Réutilise les réponses brutes déjà téléchargées.

### Transformation

- Retire les remakes (parties de moins de quinze minutes).
- Groupe les données par champion, rôle et patch.
- Calcule le win rate, le pick rate et le ratio KDA.

### Publication

- Produit quatre fichiers JSON statiques.
- Publie les fichiers générés dans le dépôt GitHub.
- Permet au portfolio de lire directement le snapshot public.

## Décisions techniques

- Une architecture batch plutôt qu'une API permanente.
- Aucune base de données nécessaire pour ce volume et cette fréquence.
- Un cache des données brutes pour permettre la reprise de la collecte.
- Des seuils d'échec pour éviter de publier un snapshot trop incomplet.
- Un classement avec un minimum de 30 parties et la borne basse de Wilson à 95 %.
- Une comparaison des pick rates uniquement entre deux snapshots du même patch.

## Limites connues

- EUW uniquement.
- Joueurs Challenger et Grandmaster uniquement.
- Cinq matchs récents maximum par joueur.
- Mise à jour hebdomadaire (pas en temps réel).
- Dépendance à l'API et aux quotas Riot.

## Source

Le projet utilise Python, pandas, l'API Riot, pytest et GitHub Actions.

Le code source et les sorties publiées sont disponibles sur [GitHub](https://github.com/dauczer/lol-meta-tracker).

---

<!-- page:football-scout-agent -->
# Football Scout Agent

**Route :** `/work/football-scout-agent`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2025

## Introduction

Football Scout Agent permet d'interroger en langage naturel près de 2 000 joueurs des cinq grands championnats européens.

Les données couvrent la saison 2024-25 : 96 clubs, des statistiques FBref enrichies avec Transfermarkt et un minimum de 450 minutes par joueur.

## Textes de l’interface interactive

- **Titre :** Tester le Scout Agent
- **Métadonnées :** Saison 2024–25 · 5 championnats · environ 2 000 joueurs
- **Introduction d’exemple :** Par exemple :
- **Question suggérée :** Quels sont les trois meilleurs attaquants de Ligue 1 ?
- **Placeholder :** Trouve des attaquants gauchers de moins de 24 ans avec un bon xG…
- **Bouton :** Interroger le scout
- **Soumission :** Analyse…
- **Question invalide :** Écrivez une question d'au moins trois caractères.
- **Chargement :** Analyse... Le premier réveil peut prendre environ 30 secondes…
- **SQL :** Voir la requête SQL validée
- **Rate limit :** La démo publique est limitée à trois questions par minute. Attendez avant de réessayer.
- **Indisponible :** Le service de scouting gratuit est temporairement indisponible. Réessayez plus tard.
- **Timeout :** La requête a pris trop de temps. Essayez une question plus simple.
- **Réponse invalide :** Le service de scouting a renvoyé une réponse inattendue.
- **Erreur réseau :** Le portfolio n'a pas pu joindre le service de scouting. Il est peut-être encore en cours de réveil.
- **Aucun résultat :** Aucun joueur ne correspond à ces critères.
- **Résumé dynamique :** [nombre] résultat(s) : [noms des joueurs].
- **Colonnes :** Joueur · Club · Championnat · Poste · Âge · Valeur · Score · Buts/90 · Passes/90 · xG/90 · xA/90 · Minutes

## Le problème

Une question de scouting combine souvent des contraintes exactes : championnat, poste, âge, budget ou seuil statistique. Le système doit appliquer chacune d'elles et retourner une réponse vérifiable, sans inventer de joueur ni de mesure.

## Comment cela fonctionne

Les statistiques brutes sont normalisées par 90 minutes, puis converties en z-scores par championnat et groupe de position. Des scores composites pondérés pour GK, DF, MF et FW permettent de comparer les joueurs et de mesurer l'écart d'un club par rapport à la moyenne de son championnat.

À l'exécution, la question passe par openai/gpt-oss-20b sur Groq, qui produit un plan JSON structuré. SQLGlot valide ensuite la requête avant son exécution dans SQLite en lecture seule, puis la réponse JSON est formatée de manière déterministe.

### Exemple vérifié

Question : « Who are the top 3 forwards in Ligue 1? »

```sql
SELECT name, team, composite_score
FROM players
WHERE league = 'Ligue 1'
  AND position = 'FW'
  AND minutes_played >= 450
ORDER BY composite_score DESC
LIMIT 3;
```

Résultat : Ousmane Dembélé, Gonçalo Ramos et Mika Biereth. L'API renvoie également la requête SQL validée utilisée pour produire ce résultat.

## Pourquoi SQL

Le text-to-SQL est un choix adapté à ce projet : on a des données tabulaires et des contraintes exactes. SQL garantit qu'un filtre de poste, de championnat ou de budget est effectivement appliqué. Un système RAG serait plus pertinent pour des rapports de scouting, des commentaires de match ou d'autres textes non structurés. Ici, on a de la donnée quantitative.

## Fiabilité et sécurité

- SQLGlot n'accepte qu'une requête SELECT ou WITH et vérifie les tables et colonnes autorisées.
- SQLite reste immutable et en lecture seule ; les résultats sont limités à 20 lignes et les requêtes à deux secondes.
- L'API limite /scout à trois requêtes par minute et renvoie des erreurs 503 explicites lorsque le modèle est indisponible.

Le diagnostic du besoin d'un club est traité localement après résolution de son nom canonique. Pour FC Nantes, le système identifie l'attaque comme priorité, avec un écart composite de -0,35 et un rang de 14/18 en Ligue 1.

## Le compromis coût zéro

Le plan de requête est généré par openai/gpt-oss-20b sur le free tier de Groq. La majorité des questions utilise un seul appel LLM ; la validation, l'exécution SQL et le formatage du JSON restent déterministes et locaux.

- Les questions répétées sont servies depuis un cache en mémoire.
- Le service peut être temporairement indisponible lorsque le quota gratuit est épuisé, une légère perte de qualité face à un modèle premium est acceptée pour cette démonstration, l'objectif étant de rester entièrement gratuit.

## Limites connues et code source

- Quatre groupes de position seulement : GK, DF, MF et FW.
- Les statistiques spécifiques aux gardiens sont incomplètes.
- Environ 15 % des joueurs n'ont pas d'enrichissement Transfermarkt.
- Les données sont un snapshot statique de la saison 2024-25 et excluent les joueurs sous 450 minutes.

Le code source, le schéma de données et les tests sont disponibles sur [GitHub](https://github.com/dauczer/scout-agent).

---

<!-- page:caf-report-automation -->
# CAF Report Automation

**Route :** `/work/caf-report-automation`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2024

## Introduction

Une automatisation développée à la CAF de la Côte-d'Or pour remplacer un processus manuel de génération de rapports de territoire.

Le workflow automatisé générait environ 50 rapports par an et son gain était estimé à près de 200 heures de travail manuel par an.

## Le problème

La création de rapport initiale reposait sur un document Word de plus de vingt pages, rempli manuellement à partir de plusieurs sources de données (internes et bases de données cloud).

Le travail était répétitif : récupérer les bonnes informations, les mettre au bon format, compléter le document puis produire le rapport final.

Avec plusieurs dizaines de rapports à produire chaque année, cela représentait beaucoup de temps consacré à une tâche largement automatisable.

## Ce que j'ai construit

J'ai développé un notebook en Python dans Databricks qui récupérait directement les informations nécessaires depuis les bases de données internes.

Les données étaient ensuite préparées et injectées dans un template HTML avant que le document final soit rendu automatiquement en PDF avec [WeasyPrint](https://weasyprint.org/).

Les principales technologies utilisées étaient Python, SQL, Databricks et WeasyPrint.

## Comment ça fonctionne

L'interface visible ci-dessous était un prototype séparé et non déployé. Le workflow professionnel de génération restait piloté par le notebook Python dans Databricks.

> **Libellé accessible de la vidéo :** Démonstration de l'interface de visualisation et d'export des rapports CAF
>
> Fichier : `/project-media/caf-report-automation.mp4` · Poster : `/project-images/caf-report-prototype.png`

Ce prototype explorait une prévisualisation du rapport avant export, notamment pour rendre les corrections plus simples qu'après la génération du PDF.

## Ce que j'en retiens

Ce projet représente assez bien le genre de problème que j'aime résoudre : partir d'un processus métier imparfait ou manuel et construire quelque chose de suffisamment simple pour qu'il disparaisse presque complètement du quotidien des utilisateurs.

## Note finale

Projet professionnel — code et données non publics.

---

<!-- page:french-rap-rag -->
# French Rap RAG

**Route :** `/work/french-rap-rag`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2025

## Introduction

Un moteur RAG qui permet d'interroger les paroles de 22 artistes de rap français et d'obtenir une réponse reliée aux morceaux utilisés comme sources.

Le corpus rassemble environ 3 400 chansons, découpées en 15 496 passages indexés.

## Textes de l’interface interactive

- **Titre :** Explorer les paroles
- **Métadonnées :** 3 400 morceaux · 22 artistes
- **Placeholder :** Quels artistes parlent de solitude, et comment ?
- **Bouton :** Interroger
- **Soumission :** Recherche…
- **Question vide :** Saisissez une question avant de l’envoyer.
- **Chargement :** Recherche dans le corpus et génération de la réponse. La première requête peut durer environ 30 secondes.
- **Corpus insuffisant :** Corpus insuffisant
- **Sources :** Morceaux cités
- **Périmètre :** Périmètre
- **Périmètre global :** Les 22 artistes
- **Rate limit :** La démo publique est limitée à trois générations par minute. Attendez avant de réessayer.
- **Fournisseur indisponible :** Un fournisseur de modèle est temporairement indisponible. Réessayez plus tard.
- **Réponse invalide :** L’API a renvoyé une réponse invalide.
- **Erreur réseau :** La démo n’a pas pu joindre l’API. Réessayez plus tard.

## Le problème

Une question sur un thème, une émotion ou un morceau précis ne peut pas être résolue correctement avec les seules connaissances générales d'un modèle. Il faut retrouver les passages pertinents dans les paroles, puis limiter la réponse à ces éléments.

Le projet sépare donc la recherche documentaire de la génération. Les paroles servent de corpus vérifiable et les titres cités dans la réponse restent visibles comme sources.

## Comment le système fonctionne

La collecte initiale utilise Genius. Le corpus et son index sont ensuite reconstruits hors ligne : les paroles sont découpées en fenêtres de 160 mots avec un chevauchement de 30 mots, puis les passages sont encodés localement avec intfloat/multilingual-e5-small.

Le routage est déterministe : un artiste nommé déclenche une recherche ciblée, plusieurs artistes une comparaison, et une question sans artiste interroge les 22 collections. Un seul embedding de requête est produit par Hugging Face puis réutilisé pour toutes les recherches ChromaDB locales.

En mode global, les candidats sont fusionnés par distance, dédupliqués par morceau et limités à deux passages par artiste avant de retenir les huit meilleurs. Une recherche ciblée conserve cinq passages et renforce les résultats associés lorsqu'un titre exact est mentionné.

Les passages récupérés sont transmis à openai/gpt-oss-120b sur Groq. La sortie structurée indique si la réponse est suffisamment étayée, le périmètre détecté et les morceaux effectivement cités.

## Décisions techniques

Calculer les embeddings du corpus localement évite d'envoyer les paroles à un service distant et ne consomme pas de quota d'inférence pendant l'indexation. En production, seule la question du visiteur passe par Hugging Face, la recherche ChromaDB reste locale.

La détection d'artiste n'appelle pas le LLM. Une question utilise donc normalement un appel Hugging Face pour l'embedding et un appel Groq pour la réponse, qu'elle soit ciblée, comparative ou globale.

Les textes des passages sont stockés dans un fichier compressé séparé des vecteurs. Cette reconstruction a réduit l'index complet d'environ 188 Mio à environ 48 Mio tout en conservant les 15 496 passages.

L'API FastAPI est déployée sur Render. Les endpoints de génération sont limités à trois requêtes par minute et par adresse IP afin de rester compatibles avec les quotas des services utilisés.

## Limites connues

- La couverture dépend des paroles et métadonnées disponibles sur Genius.
- Le système analyse les paroles, pas le son, la production ou l'interprétation vocale.
- L'évaluation reste petite et ne mesure pas encore tous les comportements de génération.
- Hugging Face, Groq et Render imposent leurs propres quotas et contraintes de disponibilité.
- Un démarrage à froid de Render peut retarder la première requête d'environ trente secondes.
- Chaque question est indépendante : aucune mémoire conversationnelle n'est conservée.

## Source

Le code source, le pipeline d'indexation, l'API et les cas d'évaluation sont disponibles sur [GitHub](https://github.com/dauczer/music-RAG).

---

<!-- page:ticket-workflow-prototype -->
# Ticket Workflow Prototype

**Route :** `/work/ticket-workflow-prototype`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2026

## Introduction

Une application web locale que j'ai construite pour simplifier le suivi de mon propre flux de tickets d'intégration chez Agicap.

Il s'agit d'un prototype personnel utilisé uniquement par moi, et non d'un produit interne Agicap déployé auprès de l'équipe.

## Le problème

Dans mon quotidien d'integration engineer, je pouvais suivre environ 30 tickets en parallèle. Chacun avançait à un rythme différent, avec des relances, des prochaines actions et des informations à ne pas perdre.

Les outils existants ne correspondaient pas bien à la manière dont je voulais organiser ce suivi. Passer régulièrement d'un sujet client à l'autre augmentait la charge mentale, surtout lorsqu'il fallait se rappeler ce qui bloquait et quand relancer.

## Le prototype

J'ai développé une application web en React et JavaScript qui rassemble une vue d'ensemble des tickets actifs et des prochaines étapes, une vue détaillée par ticket, des checklists, le suivi des relances et un espace de notes.

> **Libellé accessible de la vidéo :** Démonstration de la navigation dans le prototype de suivi des tickets
>
> Fichier : `/project-media/ticket-workflow-prototype.mp4` · Poster : `/project-images/ticket-workflow-dashboard.png`

L'objectif n'était pas de construire une plateforme complexe, mais de réunir les informations utiles dans une interface adaptée à la façon dont je travaille réellement.

## Comment je l'utilise

Le prototype tourne localement et reste construit autour de mon propre workflow. Je suis actuellement son seul utilisateur.

Je m'en sers comme d'un outil personnel pour expérimenter une organisation plus claire de mes sujets en cours. Ce n'est ni un produit Agicap ni une application interne déployée auprès de l'équipe.

Ce projet m'a appris à transformer un problème très concret en logiciel, puis à ajuster l'interface à partir de mon usage réel. Il m'a aussi permis d'aborder un problème plus orienté produit que mes projets centrés sur la donnée.

## Limites

Le prototype reste local et mono-utilisateur. Il n'intègre pas encore Gainsight, Gmail ou Slack et n'a pas été déployé auprès de l'équipe.

## Note finale

Prototype personnel lié à mon travail — utilisé localement, code non disponible.

---

<!-- page:tobit-fraud-targeting -->
# Tobit Fraud Targeting Model

**Route :** `/work/tobit-fraud-targeting`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2024

## Introduction

Un modèle statistique développé et testé à la CAF de la Côte-d'Or pour mieux prioriser les dossiers susceptibles de produire un impact financier.

## Le problème

L'objectif n'était pas seulement d'identifier un risque de fraude. Il fallait surtout aider à sélectionner, parmi les dossiers à contrôler, ceux dont l'impact financier potentiel semblait le plus important.

Le score de référence utilisé en CAF formule ce problème comme une classification binaire autour d'un seuil. Cette sortie était utile pour filtrer des dossiers, mais moins directement adaptée à leur priorisation par montant attendu.

## L'approche

J'ai exploré une régression Tobit afin de modéliser directement l'impact financier attendu tout en tenant compte de la censure présente dans la variable cible.

Le modèle produisait ainsi une valeur continue utilisable pour classer les dossiers. Le travail restait une expérimentation appliquée, construite autour du besoin opérationnel plutôt qu'un système de machine learning industrialisé.

## L'évaluation

Le modèle a été comparé au ciblage existant pendant une période de test de deux mois. Sur cette évaluation, les dossiers qu'il sélectionnait présentaient un impact financier environ 10 % supérieur à celui de la référence.

Ce résultat était prometteur, mais il décrivait une fenêtre courte et un volume de test limité. Il ne constitue pas une mesure de performance garantie en production.

## Les limites

Une évaluation plus longue et plus structurée aurait été nécessaire pour mesurer la stabilité du gain, analyser les biais et suivre le comportement du modèle dans le temps.

Le projet n'a pas atteint le niveau d'un pipeline ML mature : l'industrialisation, le monitoring et la gouvernance du modèle restaient à construire.

## Ce que ce projet représente

Ce travail relie ma formation en mathématiques appliquées à un problème opérationnel concret. Il m'a surtout appris à formuler une cible utile au métier, à évaluer prudemment un modèle et à expliquer ses résultats sans masquer leurs limites.

## Note finale

Projet professionnel — code et données non publics.

---

<!-- page:academic-projects -->
# Academic Projects

**Route :** `/work/academic-projects`  
**Auteur affiché :** Alex Daucourt  
**Date affichée :** 2023

## Introduction

Deux projets réalisés pendant mes études en mathématiques appliquées et data, conservés ici pour leur contexte et leur démarche.

Ils ne représentent pas nécessairement la manière dont je construirais les mêmes analyses aujourd'hui, mais ils documentent mes premiers travaux complets de text mining, de modélisation et d'interprétabilité.

## 01 — French Rap Text Mining

Ce projet partait d'une question simple : peut-on distinguer une chanson de rap français d'une chanson pop uniquement à partir de ses paroles ? L'analyse réunissait environ 50 000 titres de rap et 60 000 titres pop issus de deux jeux de données publics.

J'ai d'abord tokenisé les paroles pour explorer la taille et la diversité du vocabulaire par artiste. Les nuages de mots permettaient ensuite de comparer visuellement les termes fréquents, comme dans cet exemple construit à partir des paroles de Booba.

> **Texte alternatif de l’image :** Nuage de mots construit à partir des paroles de Booba
>
> Fichier : `/project-images/french-rap-wordcloud.png`

Pour la partie prédictive, les paroles ont été vectorisées avec TF-IDF. Une comparaison limitée par les ressources disponibles a porté sur XGBoost et ExtraTrees ; le meilleur modèle atteignait un F1-score de 0,91 et une ROC AUC de 0,97 sur l'échantillon de test.

Les sources provenaient de deux jeux de données Kaggle consacrés au [rap français](https://www.kaggle.com/datasets/quentinlelan/french-rap-lyrics-several-dataset-union) et aux [paroles Genius](https://www.kaggle.com/datasets/carlosgdcj/genius-song-lyrics-with-language-information). Le [rapport académique archivé](/reports/french-songs.pdf) détaille l'analyse originale.

## 02 — Airbnb Price Classification

Ce projet d'examen utilisait plus de 35 000 annonces Airbnb à Rio de Janeiro. La tâche consistait à prédire une catégorie de prix définie à partir des quantiles du jeu de données, plutôt qu'un prix exact.

La préparation ajoutait notamment la distance au stade Maracanã et au Christ Rédempteur aux caractéristiques de l'annonce. J'ai comparé Random Forest, XGBoost et ExtraTrees ; le meilleur résultat provenait d'un modèle XGBoost avec une profondeur maximale de 7.

> **Texte alternatif de l’image :** Importance SHAP des variables du modèle de classification des prix Airbnb
>
> Fichier : `/project-images/rio-airbnb-shap.png`

L'analyse SHAP montrait que la distance au Maracanã et le quartier faisaient partie des variables les plus influentes selon la classe de prix. Le type de logement et sa capacité contribuaient également aux prédictions.

Le [rapport académique archivé](/reports/rio-airbnb.pdf) présente la préparation des données, la comparaison des modèles et l'analyse d'interprétabilité.

---

<!-- page:macos-portfolio -->
# macOS Portfolio

**Type :** entrée externe uniquement  
**URL :** https://playground.alexdaucourt.dev

Aucun autre texte de page n’est stocké dans ce dépôt.
