# Organisation et maintenance du code

## Architecture actuelle

Le header et la navigation sont partagés entre les pages. Une modification du logo, de la hauteur, des liens ou du responsive doit rester cohérente sur toutes les pages.

Les feuilles de style sont séparées par surface :

```text
css/style.css       # base et tokens partagés
css/header.css      # en-tête et navigation
css/index.css       # accueil
css/projects.css    # projets
css/contact.css     # contact
css/project-detail.css
js/header.js        # navigation
js/contact.js       # animation et formulaire Contact
```

La page Projets affiche directement la ville et ses liens; l'ancienne séquence canvas d'accueil a été retirée car elle n'était pas liée à cette illustration.

## Règle du header/navbar

Utiliser une hauteur unique :

```css
:root {
  --header-height: 72px;
}
```

Le header doit privilégier Flexbox ou Grid plutôt que plusieurs `position: absolute`.

Les icônes doivent avoir un conteneur fixe pour éviter que chaque page ait un alignement différent.

```css
.site-header {
  min-height: var(--header-height);
}

.nav-icon-box {
  width: 40px;
  height: 24px;
  display: grid;
  place-items: center;
}
```

## Règle de nommage

Utiliser `kebab-case` :

- `project-card.css`
- `header-icon.svg`
- `contact-animation.js`

## Avant une modification

1. Modifier le composant partagé.
2. Tester toutes les pages.
3. Tester mobile et desktop.
4. Vérifier la console du navigateur.
5. Faire un commit Git clair.
