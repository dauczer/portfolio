# Editorial Layout Tokens

Référence structurelle inspectée : https://leerob.com/moderation  
Date de l’audit : 26 août 2026  
Viewport desktop mesuré : `1363 × 936px`, DPR `1`.

## Périmètre

Cette spec reprend uniquement la structure éditoriale, le rythme vertical et les comportements de contenu de la page de référence.

- Ne pas reprendre ses couleurs.
- Ne pas reprendre sa famille typographique.
- Appliquer ces règles au design system Soulwire déjà utilisé par le portfolio.
- Les valeurs relatives à la taille du texte partent d’un corps de lecture abstrait égal à `1`.

Le rendu desktop a été mesuré directement. Le navigateur d’audit ne permettant pas de changer de viewport, le mobile est déduit des media queries exactes de la feuille CSS chargée.

## 1. Mesure de lecture et cadre de page

| Token | Valeur | Rôle |
| --- | ---: | --- |
| `editorial.measure` | `600px` | largeur maximale de la colonne de lecture |
| `editorial.width` | `min(100%, 600px)` | comportement de la colonne |
| `page.gutter.fluid` | `clamp(20px, 3.4vw, 52px)` | padding général hors mobile |
| `page.mobile.top` | `40px` | padding supérieur sous `640px` |
| `page.mobile.inline` | `20px` | marge horizontale sous `640px` |
| `page.mobile.bottom` | `20px` | padding inférieur sous `640px` |
| `article.large-screen-offset` | `48px` | marge supérieure additionnelle à partir de `1100px` |

La colonne est centrée par `margin-inline: auto`.

À `1363px`, la page mesurée avait :

- padding global calculé : `46px` ;
- colonne : `600px` ;
- bord gauche de la colonne : `376.5px` ;
- sommet du contenu : `94px`, soit environ `46px + 48px`.

### Comportement par largeur

| Largeur | Placement vertical | Largeur de lecture |
| --- | --- | --- |
| `≥ 1100px` | padding fluide + `48px` | `600px` maximum |
| `640–1099px` | padding fluide uniquement | `min(600px, espace disponible)` |
| `≤ 639px` | `40px` en haut | viewport moins `40px` de marges horizontales |

Contrairement à la landing Soulwire centrée dans le viewport, une page projet doit utiliser un flux documentaire normal et le scroll de la page.

## 2. Échelle éditoriale relative

Définir `body = 1` pour conserver la typographie existante du portfolio.

| Élément | Ratio de taille | Line-height | Poids relatif | Letter-spacing |
| --- | ---: | ---: | --- | ---: |
| Corps de lecture | `1` | `1.6` | normal | normal |
| H1 desktop | `1.765` | `1.1` si suivi de metadata | semi-accentué | `-0.02em` |
| H1 mobile | `1.882` | `1.1` | semi-accentué | `-0.02em` |
| H2 | `1.365` | `1.4` | semi-accentué | `-0.02em` |
| H3 / subheading | `1.271` | `1.4` | normal, distinct du H2 | `-0.02em` |
| Metadata | `0.765` | `1.35` | normal | `-0.005em` sur le groupe de détails |
| Summary de bloc dépliable | `0.765` | `1.6` | normal | normal |
| Code block | `0.765` | `1.4` | normal | `0` |
| Inline code | `0.9em` du contexte | hérité | normal | normal |

Valeurs source observées : corps `17px`, H1 `30px` desktop et `32px` mobile, H2 `23.2px`, H3 défini à `21.6px`, metadata `13px`.

La page inspectée contient des H2 mais aucun H3. Le ratio H3 provient néanmoins de la règle éditoriale chargée par la page.

## 3. En-tête d’article

Ordre structurel :

1. H1 ;
2. metadata ;
3. premier bloc de contenu ou premier H2.

| Token | Valeur source | Valeur relative utile |
| --- | ---: | ---: |
| `title.to-meta` | `12px` | `0.706 × body` |
| `meta.height` | `20px` | dépend du contenu |
| `meta.margin-bottom` | `38.4px` | `2.26 × body` |
| `meta.to-first-h2` rendu | `49.6px` | `2.92 × body` |

Le gap réel metadata → H2 vaut `49.6px`, car la marge supérieure du H2 est plus grande que la marge inférieure de la metadata et les marges verticales adjacentes se collapsent.

La metadata de la référence est une ligne compacte : petit avatar `20 × 20px`, date, séparateur médian, auteur. Toute la ligne est un lien vers l’accueil.

Il n’existe pas de bouton retour, breadcrumb ou barre de navigation visible sur cette page.

## 4. Rythme des paragraphes

| Token | Valeur source | Ratio |
| --- | ---: | ---: |
| `paragraph.line-height` | `27.2px` | `1.6` |
| `paragraph.margin-bottom` | `23.2px` | `1.365 × body` ou `0.853 ligne` |
| `heading-2.margin-top` | `49.6px` | `2.92 × body` |
| `heading-2.margin-bottom` | `19.2px` | `1.13 × body` |
| `heading-3.margin-top` | `44.8px` | `2.64 × body` |
| `heading-3.margin-bottom` | `16.8px` | `0.99 × body` |

Mesures réelles :

- H2 → premier paragraphe : `19.2px` ;
- paragraphe → paragraphe : `23.2px` ;
- dernier paragraphe → H2 suivant : `49.6px` ;
- metadata → premier H2 : `49.6px`.

Les marges verticales adjacentes se collapsent. Il faut donc utiliser les valeurs ci-dessus comme marges de blocs, sans additionner artificiellement la marge basse du paragraphe et la marge haute du heading.

### Principe de rythme

- Espacement courant : environ `0.85` ligne entre paragraphes.
- Changement de section : environ `1.82` ligne avant le H2.
- Heading → texte : environ `0.70` ligne.
- Le lecteur perçoit une séparation claire sans cartes, fonds ou traits entre les sections.

## 5. Headings

### H1

- Largeur identique à la colonne de lecture.
- Retour à la ligne équilibré (`text-wrap: balance`).
- Line-height serré à `1.1` quand une ligne de metadata suit immédiatement.
- Pas de marge supérieure interne.

### H2

- Occupe toute la largeur de lecture.
- Sert de principal séparateur structurel.
- Aucun trait ou ornement associé.
- Grande marge avant, marge plus courte après.

### H3

- Non utilisé dans l’article inspecté.
- La règle chargée le rend légèrement plus petit que le H2 et moins lourd.
- Conserver une marge avant presque aussi généreuse que celle du H2, pour ne pas tasser la hiérarchie.

## 6. Listes

La liste ordonnée est placée dans un bloc dépliable, mais son comportement interne est standard.

| Token | Ordered list | Unordered list |
| --- | ---: | ---: |
| `list.margin-top` | `16px` | `16px` |
| `list.margin-bottom` | `19.2px` | `19.2px` |
| `list.margin-left` | `32px` | `24px` |
| `list.marker` | decimal, outside | square, outside |
| `list-item.margin-bottom` | `3.2px` | `3.2px` |
| `list-item.line-height` | `1.6` | `1.6` |

Les marqueurs restent à l’extérieur de la boîte de texte. Les éléments longs se réalignent sur le début du texte, pas sur le marqueur.

Ne pas ajouter de pseudo-marqueurs décoratifs : la feuille désactive explicitement les marqueurs custom des `ul`.

## 7. Liens

### Liens dans le corps

- Soulignés en permanence.
- Soulignement discret au repos.
- Au hover, renforcement simultané du texte et du soulignement.
- Transition : `300ms ease-in-out` sur la couleur du texte et celle de la décoration.
- `text-decoration-skip-ink: auto`.
- Épaisseur et offset laissés aux métriques natives du navigateur.

### Lien de metadata

- Aucune underline.
- La ligne complète est cliquable.
- Hover limité à un changement de contraste.

Dans l’adaptation, conserver ces comportements mais utiliser exclusivement les couleurs et états du design system Soulwire.

## 8. Images et médias

La page inspectée ne contient aucune image éditoriale ni figure. La seule image est l’avatar `20 × 20px` de la metadata.

Les règles chargées indiquent néanmoins :

- images et vidéos éditoriales : `max-width: 100%` ;
- hauteur automatique ;
- elles restent donc contenues dans les `600px` de la colonne par défaut ;
- un modificateur explicite `w-screen` désactive cette contrainte et donne `width: 100vw`.

La feuille ne fournit pas, à elle seule, de règle de recentrage pour ce breakout. Ne pas considérer le full-bleed comme le comportement par défaut.

### Tokens médias

| Token | Valeur |
| --- | --- |
| `media.default-width` | `100%` de la colonne, maximum `600px` |
| `media.height` | `auto` |
| `media.breakout` | opt-in explicite uniquement |
| `media.mobile` | largeur disponible entre les deux gutters de `20px` |

## 9. Code

La page inspectée ne contient ni code block ni inline code.

Le système éditorial chargé prévoit toutefois :

### Code block

- largeur de la colonne ;
- overflow horizontal automatique ;
- padding `16px 32px 16px 16px` ;
- marge basse `21.3px` ;
- line-height `1.4` ;
- texte interne à `0.765 × body` ;
- pas de wrapping forcé.

### Inline code

- taille `0.9em` du contexte ;
- padding horizontal `3.2px` environ ;
- aucun impact sur le rythme vertical du paragraphe.

Ces valeurs sont optionnelles pour les case studies techniques ; elles ne doivent pas introduire une autre direction visuelle.

## 10. Séparateurs et blocs dépliables

Il n’y a aucun séparateur entre les sections principales.

Le seul `hr` se trouve dans le contenu dépliable :

| Token | Valeur |
| --- | ---: |
| `divider.height` | `1px` |
| `divider.width` | `100%` de la colonne |
| `divider.margin-block` | `24px` |

### Details / summary

| Token | Valeur |
| --- | ---: |
| `details.margin-block` | `27.2px` / `1.6em` |
| `summary.size` | `0.765 × body` |
| `summary.line-height` | `1.6` |
| `summary.margin-left` | `4px` |
| `summary.margin-bottom` | `8px` |
| `summary.icon` | triangle `7 × 7px` |
| `summary.icon-transition` | rotation `160ms` |

Le triangle tourne de `90°` à l’ouverture. Le bloc n’anime pas sa hauteur : le contenu apparaît selon le comportement natif de `details`.

## 11. Responsive

Sous `640px` :

- gutters horizontaux fixes de `20px` ;
- padding supérieur `40px` ;
- colonne = largeur du viewport moins `40px` ;
- corps, H2, H3, paragraph gaps et line-heights restent inchangés ;
- seul le H1 passe de `30px` à `32px` dans la source ;
- images et médias restent contenus dans la colonne ;
- les longues lignes et tables/code utilisent un overflow horizontal local si nécessaire.

À partir de `1400px`, le système sait déplacer d’éventuelles notes de marge dans une colonne latérale de `240px`, séparée du texte par `32px`. Cette fonctionnalité n’est pas utilisée par la page inspectée et ne fait pas partie du noyau nécessaire pour les case studies.

## 12. Spec opérationnelle concise

```text
Editorial Layout Tokens

measure.max              = 600px
page.gutter              = clamp(20px, 3.4vw, 52px)
page.mobile              = 40px 20px 20px
article.offset@1100      = 48px

body.size                = 1
body.line-height         = 1.6
h1.size                  = 1.765 desktop / 1.882 mobile
h1.line-height           = 1.1
h2.size                  = 1.365
h2.line-height           = 1.4
h3.size                  = 1.271
h3.line-height           = 1.4
metadata.size            = 0.765

title-to-meta            = 0.706 × body
meta-margin-bottom       = 2.26 × body
h2-margin-top            = 2.92 × body
h2-margin-bottom         = 1.13 × body
h3-margin-top            = 2.64 × body
h3-margin-bottom         = 0.99 × body
paragraph-margin-bottom  = 1.365 × body

list-indent.ordered      = 32px
list-indent.unordered    = 24px
list-item-gap            = 3.2px
divider                  = 1px full measure, 24px block margins
link-transition          = 300ms ease-in-out

media.default            = contained to reading measure
media.breakout           = explicit opt-in only
```

## 13. Ce qui produit la lisibilité

1. Une mesure courte et stable de `600px`.
2. Un interligne généreux de `1.6`.
3. Un espace régulier d’environ `0.85` ligne entre paragraphes.
4. Un saut nettement plus grand avant les H2, sans séparateur graphique.
5. Une metadata compacte, visuellement distincte, suivie d’une vraie pause.
6. Une hiérarchie modérée : H1, H2 et H3 restent proches du corps plutôt que surdimensionnés.
7. Des médias contenus par défaut et des breakouts exceptionnels.
8. Une seule colonne, sans éléments latéraux concurrents dans le parcours de lecture principal.

