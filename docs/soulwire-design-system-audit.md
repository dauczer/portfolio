# Soulwire — audit du design system

Source inspectée : https://soulwire.co.uk/  
Date de l’audit : 26 août 2026  
Base de mesure desktop : viewport `1363 × 936 px`, DPR `1`.

## Méthode et niveau de confiance

- Le DOM rendu, les rectangles de mise en page, les styles calculés, les pseudo-éléments et les états `:hover` ont été inspectés dans Chrome.
- La feuille chargée par la page (`app-9b5a62.css`) a été lue via CSSOM ; les valeurs ci-dessous ne sont donc pas des estimations visuelles.
- Le rendu desktop a été vérifié visuellement.
- Le navigateur d’audit ne permettait pas de changer son viewport. La comparaison mobile est donc déduite des media queries exactes et de la cascade CSS, pas d’une capture mobile distincte.
- Les contenus, le logo et les expériences WebGL propres à Soulwire ne font pas partie de la spec à reproduire.

## 1. Fondation visuelle

| Token | Valeur exacte | Usage observé |
| --- | --- | --- |
| `color.bg` | `#16191B` / `rgb(22 25 27)` | `html`, `body`, application, panneaux projet |
| `color.text` | `#E2E6E8` / `rgb(226 230 232)` | texte principal et icônes |
| `color.title` | `#FFFFFF` | titres des lignes projet, avec opacité locale |
| `color.underline.rest` | `#262626` | soulignement masqué au repos |
| `color.underline.hover` | `#BFBFBF` | soulignement au survol |
| `opacity.label` | `0.20` | titres de section et indices |
| `opacity.meta` | `0.25` | version et statut bas-gauche |
| `opacity.project-title` | `0.90` | titre de ligne au repos |
| `opacity.social` | `0.66` | liens sociaux au repos |

Il n’y a ni gradient, ni texture, ni ombre dans le shell principal. Le contraste est construit presque uniquement par l’opacité.

## 2. Typographie

Police : **Roboto Mono**, fallback `monospace`. La feuille importe les graisses `100`, `300`, `400`, `500`, mais l’interface principale utilise `300`.

| Rôle | Taille | Line-height | Graisse | Letter-spacing | Détails |
| --- | ---: | ---: | ---: | ---: | --- |
| Salutation | `24px` | `24px` | `300` | normal | seul texte franchement agrandi |
| Texte About | `14px` | `1.7` = `23.8px` | `300` | normal | largeur utile desktop `688px` |
| Lien projet | `13px` | `28px` | `300` | normal | ligne cliquable fixe de `28px` |
| Label de section | `10px` | contextuel | `300` | `0.15em` = `1.5px` | uppercase, un point est ajouté par `::after` |
| Version header | `12px` | `12px` | `300` | normal | opacité `0.25` |
| Footer global | `12px` | `2` = `24px` | `300` | normal | liens sociaux et statut |
| Titre panneau projet | `14px` | `50px` | `300` | normal | barre projet |
| Description projet | `11px` | `1.75` = `19.25px` | `300` | normal | `max-width: 720px` |
| Bouton Home projet | `12px` | `14px` | `300` | `2px` | uppercase |

Le label About hérite du line-height `1.7`, soit `17px` à `10px`. Le label Labs hérite du rythme de base `1`, soit `10px`.

## 3. Architecture et dimensions

### Shell plein écran

- `html` et `body` : `height: 100%`, `overflow: hidden`, fond `#16191B`.
- Application : position absolue, `top/left: 0`, `width/height: 100%`.
- Header : absolu, `height: 60px`, `padding-inline: 16px`, flex horizontal, éléments répartis aux extrémités et centrés verticalement.
- Logo : `32 × 32px`, placé à `x: 16px`, `y: 14px` dans la mesure desktop.
- Footer : absolu en bas, `height: 50px`, `padding-inline: 16px`, flex horizontal `space-between`, centré verticalement.
- Zone centrale : absolue avec `top: 60px`, `bottom: 50px`, flex centré horizontalement et verticalement, `overflow-y: scroll`.

### Colonne de contenu

- Wrapper : `width: 100%`, `max-width: 720px`, `padding: 24px 16px`, `margin: auto`, `box-sizing: border-box`.
- Largeur utile maximale : `720 - 32 = 688px`.
- À `1363px` de viewport : wrapper mesuré à `720px`; contenu utile à `688px`.
- La présence d’un scrollbar classique de `15px` peut décaler le centrage de `7.5px`. C’est une conséquence de `overflow-y: scroll`, pas une animation de texte voulue.

### Rythme vertical desktop

Dans la mesure finale :

| Bloc | Position / dimension |
| --- | --- |
| Wrapper | hauteur `458.984px`, padding haut/bas `24px` |
| Salutation | hauteur `24px` |
| Espace salutation → About | `40px` via `margin-top` du About |
| About | `5` lignes × `23.8px` = `118.984px` mesurés |
| Espace About → Labs | `32px` via `margin-bottom` |
| Grille Labs | `7` lignes × `28px` = `196px` |

### Labels latéraux desktop

À partir de `870px` :

- Labels en `position: absolute`.
- `left: -16px` puis `transform: translateX(-100%)`.
- About : `top: 4px`.
- Labs : `top: 10px`.
- Ils se placent donc entièrement à gauche de la colonne, séparés de son bord par `16px`.

### Grille de lignes

- Liste en multi-colonnes CSS, pas en grid.
- Desktop : `columns: 3`, `column-gap: 24px`.
- Largeur mesurée de chaque colonne : environ `213.33px`.
- Remplissage vertical par colonne : avec 21 entrées, `7 / 7 / 7`.
- Chaque ligne : bloc de `28px`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.
- Index : largeur intrinsèque, `margin-right: 8px`, opacité `0.20`.
- Titre : inline, `position: relative`, `overflow: hidden`, couleur blanche, opacité `0.90`.

## 4. Responsive exact

| Largeur CSS | Labels | Colonnes projets | Conséquence |
| --- | --- | ---: | --- |
| `≥ 870px` | latéraux, absolus | `3` | composition desktop caractéristique |
| `720–869px` | dans le flux, `margin-bottom: 16px` | `3` | même densité, labels au-dessus |
| `451–719px` | dans le flux | `2` | environ `11 + 10` lignes pour 21 items |
| `≤ 450px` | dans le flux | `1` | liste verticale de `21 × 28 = 588px` |

Ce qui ne change pas sur mobile :

- tailles de texte ;
- line-heights ;
- header `60px` et footer `50px` ;
- padding horizontal `16px` ;
- espacements About `40px / 32px` ;
- opacités et palette ;
- hauteur de ligne projet `28px`.

Sur un petit écran, le wrapper occupe la largeur disponible, moins ses `16px` de padding de chaque côté. Le contenu devient plus haut que la zone centrale et défile **à l’intérieur** de la zone comprise entre header et footer ; la page elle-même reste verrouillée.

Il n’existe aucune règle mobile spécifique pour les hovers : sur un appareil tactile sans hover, les lignes restent simplement dans leur état de repos.

## 5. Micro-interactions

### Survol d’une ligne projet

État de repos :

- index `opacity: 0.20` ;
- titre `opacity: 0.90` ;
- pseudo-élément sous le titre : `height: 1px`, `bottom: -2px`, `width: 24px`, fond `#262626`, translation `calc(-100% - 8px)` ; il est masqué par l’overflow du titre.

Entrée du hover :

- index vers `0.40` en `300ms`, easing `cubic-bezier(0.23, 1, 0.32, 1)` ;
- titre vers `1` en `300ms`, même easing ;
- underline vers `width: 100%`, `transform: none`, fond `#BFBFBF` en `275ms`, même easing.

Sortie du hover :

- underline revient en `500ms` avec `cubic-bezier(0.175, 0.885, 0.32, 1.275)` ; le léger dépassement de cet easing donne le caractère élastique.

Le texte lui-même ne translate pas et ne change pas de taille. L’impression de mouvement vient de la ligne qui entre depuis la gauche et du changement d’opacité.

### Footer

- Statut bas-gauche : `opacity 0.25 → 0.75`, `660ms`, `cubic-bezier(0.23, 1, 0.32, 1)`.
- Liens sociaux : `opacity 0.66 → 1`, `300ms`, même easing.
- Espacement entre liens sociaux : `margin-left: 16px` sur chaque lien.

### Entrée de page

- La salutation est révélée par un typewriter JavaScript après un court temps vide ; la langue varie entre les chargements.
- Curseur texte : caractère `_` via `::before`, pulse infini `1s ease` avec opacité `0.1 → 1 → 0.1`.
- Quand la frappe est terminée : le conteneur reçoit `.done`, puis le curseur passe à `opacity: 0` avec une transition de `500ms ease`.
- Les blocs About et Labs apparaissent ensuite par étapes ; ce séquençage relève du JavaScript, pas de transitions CSS continues.
- Logo : tracé principal `1.75s`, easing `cubic-bezier(0.23, 1, 0.32, 1)`, délai `100ms`; deux carrés apparaissent en `500ms` avec délais `900ms` et `1100ms`.

### Ouverture d’un projet

- L’expérience projet occupe tout l’écran ; le viewport de la démo laisse une réserve basse de `50px`.
- Barre basse visible : translation verticale jusqu’à `-50px` en `300ms`, easing `cubic-bezier(0.23, 1, 0.32, 1)`, délai `200ms`.
- Ouverture complète de l’info : translation à `-100%` en `300ms`, même easing, sans délai.
- Menu de navigation interne : entrée en `300ms`, easing `cubic-bezier(0.86, 0, 0.07, 1)`, délai `50ms`.
- Icône menu : sortie avec translation `100%`, `scaleX(3)` et fondu à `0`, `300ms`, même easing serré.
- Flèches précédent/suivant : icône `scale(1.25)` au hover, `200ms`.
- Liens de description : bordure basse translucide vers opaque, `200ms`.

Les effets de curseur lumineux observables dans certaines démos WebGL sont propres à ces projets. Le shell global n’a pas de curseur custom : `auto` pour le contenu, `pointer` pour les liens.

## 6. Courbes de mouvement à conserver

| Token | Valeur | Caractère |
| --- | --- | --- |
| `ease.swift` | `cubic-bezier(0.23, 1, 0.32, 1)` | sortie rapide, fin douce ; interaction principale |
| `ease.snap` | `cubic-bezier(0.86, 0, 0.07, 1)` | panneau/menu très tendu |
| `ease.back` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | retour élastique de l’underline |
| `ease.default` | `ease` | curseur de frappe |

Durées structurantes : `200ms`, `275ms`, `300ms`, `500ms`, `660ms`, `1s`, `1.75s`.

## 7. Spec concise à donner à Codex

### Design tokens

| Catégorie | Tokens |
| --- | --- |
| Couleurs | fond `#16191B`; texte `#E2E6E8`; titres de ligne `#FFF`; underline repos `#262626`; underline hover `#BFBFBF` |
| Typo | `Roboto Mono`, poids principal `300`; tailles `24 / 14 / 13 / 12 / 10px` |
| Largeur | wrapper `100%`, max `720px`; padding wrapper `24px 16px`; contenu utile max `688px` |
| Shell | header `60px`; footer `50px`; zone centrale entre les deux, scroll interne |
| Espacement | base horizontale `16px`; About `margin: 40px 0 32px`; gap colonnes `24px`; index→titre `8px`; ligne projet `28px` |
| Breakpoints | labels latéraux à `870px`; `2` colonnes à `719px`; `1` colonne à `450px` |
| Opacités | label/index `.20`; meta `.25`; social `.66`; titre `.90`; hover titre/social `1`; hover index `.40`; hover statut `.75` |

### Règles d’interaction

1. Une ligne projet ne déplace jamais son texte : elle augmente légèrement les opacités et fait entrer un underline de gauche à droite.
2. Entrée hover : `275–300ms` avec `ease.swift`; sortie underline : `500ms` avec `ease.back`.
3. Garder les labels de section minuscules, uppercase, très atténués, terminés par un point et latéraux uniquement à partir de `870px`.
4. Conserver les mêmes tailles typographiques sur mobile ; la responsivité vient du flux, du nombre de colonnes et du scroll interne, pas d’une réduction globale.
5. Garder la page silencieuse visuellement : aucun dégradé, aucune card, aucune ombre, aucun rayon, aucun fond secondaire.
6. Si l’animation d’entrée est reprise, elle doit rester typographique et brève ; ne pas en faire une condition d’accès au contenu.

## 8. Ce qu’il faut absolument préserver pour retrouver le feeling

1. Le couple `#16191B` / `#E2E6E8` et la hiérarchie par opacité.
2. Roboto Mono en graisse `300`, avec des tailles petites et des line-heights généreux uniquement pour le texte narratif.
3. Le wrapper étroit de `720px`, centré dans un shell plein écran avec header/footer fixes.
4. Les labels latéraux à gauche du contenu sur desktop, puis replacés dans le flux sous `870px`.
5. Les lignes de `28px`, les indices à trois chiffres et la grille multi-colonnes remplie verticalement.
6. L’underline de hover entrant depuis la gauche et son retour plus lent, légèrement élastique.
7. L’absence d’ornement : le rythme, les opacités et la précision des transitions font tout le travail.

