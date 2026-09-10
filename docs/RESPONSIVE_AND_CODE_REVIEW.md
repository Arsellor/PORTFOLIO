# Responsive & Code Review

## Header

Le header est désormais basé sur **CSS Grid**, sans positionnement `absolute` pour le logo ou la navigation.

- Desktop : hauteur 68px
- Tablette : hauteur 64px
- Téléphone : hauteur 60px
- Zones tactiles : minimum 44x44px
- Icônes : dimensions uniformes
- Navigation mobile : icônes uniquement, avec `aria-label`

## Balises sémantiques

Le projet utilise les landmarks HTML suivants :

- `<header>` : en-tête global
- `<nav>` : navigation principale et navigations contextuelles
- `<main>` : contenu principal unique
- `<section>` : sections thématiques
- `<footer>` : pied de page
- `<button>` : actions JavaScript
- `<a>` : navigation réelle

Un lien « Aller au contenu principal » est ajouté pour les utilisateurs du clavier.

## Tests recommandés avant publication

Tester avec les largeurs suivantes :

- 320px
- 375px
- 390px
- 430px
- 768px
- 820px
- 1024px
- 1280px
- 1440px
- 1920px

## Recommandation senior

Avant chaque modification, éviter de copier/coller le CSS du header dans une page. `css/header.css` doit rester la source de vérité du composant global.
