# Changelog

## GitHub-ready cleanup - 2026-09-07

- Removed `_archive/` from the public project package.
- Added `.gitignore`.
- Added professional README.
- Added maintenance and publication checklists.
- Added a base CSS tokens file for progressive refactoring.
- Preserved the existing functional project structure to avoid breaking asset paths.

## Responsive Header Refactor
- Header compacté à 68px desktop, 64px tablette et 60px mobile.
- Suppression du positionnement absolu du logo et de la navigation.
- Passage à CSS Grid pour un alignement stable entre les pages.
- Uniformisation des dimensions des icônes.
- Zones tactiles accessibles de 44px minimum.
- Ajout d'un skip link et d'un identifiant de contenu principal.
- Respect de `prefers-reduced-motion`.
