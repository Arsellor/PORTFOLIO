# Organisation et maintenance du code

## Problème principal à éviter : duplication

Le header et la navbar doivent devenir un composant unique. Une modification du logo, de la hauteur, des liens ou du responsive ne doit pas nécessiter de modifier plusieurs pages.

## Architecture cible

```text
css/
├── base/
│   ├── reset.css
│   ├── variables.css
│   └── typography.css
├── components/
│   ├── header.css
│   ├── footer.css
│   └── buttons.css
└── pages/
    ├── home.css
    ├── projects.css
    └── contact.css

js/
├── components/
│   └── header.js
└── pages/
    ├── home.js
    ├── projects.js
    └── contact.js
```

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
