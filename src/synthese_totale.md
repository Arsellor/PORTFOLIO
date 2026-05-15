## Fichier : ./app/competences/competences.css
```css
/* Rappel des variables */
:root {
  --accent-color: #e76f51;
  --bg-color: #fdfaf5;
  --text-color: #264653;
}

/* Réinitialisation pour le mode plein écran */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  /* Suppression du fond sombre var(--text-color) pour un fond blanc propre */
  background-color: #ffffff; 
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* Style principal de la section compétences */
#competence {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: var(--bg-color);
  padding: 3rem;
  /* Conservation de l'ombre décalée pour le style "Neumorphism/Brutalist" */
  box-shadow: 20px 20px 0px var(--accent-color); 
  border: 1px solid #ddd;
  animation: fadeIn 1s ease-in;
  position: relative;
}

/* Titre principal façon Article de fond */
.article-title {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  line-height: 0.9;
  margin-bottom: 2rem;
  border-bottom: 8px solid var(--text-color);
  display: inline-block;
  width: fit-content;
  letter-spacing: -1px;
}

/* Sous-titres de catégories */
h3 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--accent-color);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 700;
}

h3::after {
  content: "";
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), transparent);
}

/* Style des paragraphes */
p {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Style de la liste ordonnée (formation) */
ol {
  list-style: none;
  counter-reset: custom-counter;
  padding: 0;
  margin: 1.5rem 0 2rem 0;
}

li {
  font-family: 'Poppins', sans-serif;
  margin-bottom: 15px;
  padding-left: 30px;
  position: relative;
  font-size: 1rem;
  color: var(--text-color);
  line-height: 1.5;
}

/* Style personnalisé pour la liste numérotée */
ol li {
  counter-increment: custom-counter;
  padding-left: 45px;
  margin-bottom: 15px;
}

ol li::before {
  content: counter(custom-counter);
  position: absolute;
  left: 0;
  top: 0;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--accent-color);
  background: transparent;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid var(--accent-color);
}

/* Organisation en colonnes pour les sections */
#competence > section {
  margin-bottom: 2.5rem;
}

/* --- Tableau Style Infographie --- */
.table-wrapper {
  overflow-x: auto;
  margin: 2rem 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px;
  margin-top: 1rem;
}

th {
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent-color);
  padding: 12px 15px;
  border-bottom: 2px solid var(--text-color);
  text-align: left;
}

td {
  background: white;
  padding: 15px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: var(--text-color);
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

td:first-child {
  border-left: 1px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
  font-weight: 600;
  background: linear-gradient(90deg, #fff, #fafafa);
}

td:last-child {
  border-right: 1px solid #e0e0e0;
  border-radius: 0 8px 8px 0;
}

/* Effet hover sur les lignes */
tr:hover td {
  transform: scale(1.01);
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: #fff8f5;
  box-shadow: 0 4px 12px rgba(231, 111, 81, 0.1);
}

/* Badges de niveau */
.level-badge {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* --- Animations --- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

#competence > section {
  animation: slideIn 0.6s ease-out forwards;
  opacity: 0;
}

#competence > section:nth-child(1) { animation-delay: 0.1s; }
#competence > section:nth-child(2) { animation-delay: 0.3s; }

/* --- Responsive Design --- */
@media (max-width: 768px) {
  body {
    padding: 20px 15px;
  }

  #competence {
    padding: 1.5rem;
    box-shadow: 10px 10px 0px var(--accent-color);
  }

  .article-title {
    font-size: 2.2rem;
    border-bottom-width: 5px;
  }

  h3 {
    font-size: 1.5rem;
    margin-top: 1.5rem;
  }

  p { font-size: 0.95rem; }
  li { font-size: 0.9rem; }

  .table-wrapper { overflow-x: visible; }

  table, thead, tbody, th, td, tr { display: block; }
  th { display: none; }

  td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    margin-bottom: 8px;
    border: 1px solid #e0e0e0 !important;
    border-radius: 8px !important;
    background: white;
  }

  td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.7rem;
    color: var(--accent-color);
    letter-spacing: 1px;
  }

  tr {
    margin-bottom: 15px;
    display: block;
  }
}```

## Fichier : ./app/contact/contact.css
```css
/* Utilisation des variables définies précédemment */
:root {
    --accent-color: #e76f51;
    --bg-color: #fdfaf5;
    --text-color: #264653;
}

/* Réinitialisation propre pour le mode plein écran */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: var(--bg-color);
}

#contact {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
}

/* --- Infos contact (Gauche) --- */
.contact-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem;
    background-color: var(--bg-color);
    position: relative;
    animation: fadeInLeft 1s ease-out;
}

.contact-info .article-title {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    font-weight: 900;
    color: var(--accent-color);
    text-transform: uppercase;
    line-height: 0.9;
    margin-bottom: 3rem;
    border-bottom: 8px solid var(--text-color);
    display: inline-block;
    width: fit-content;
}

.contact-info p {
    font-size: 1.3rem;
    margin: 1rem 0;
    color: var(--text-color);
}

/* Style des liens avec animation */
.contact-info a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
    border-bottom: 2px solid transparent;
}

.contact-info a:hover {
    color: var(--accent-color);
    border-bottom: 2px solid var(--accent-color);
}

/* --- Colonne de droite (Map) --- */
.mapbox {
    flex: 1.2; /* Un peu plus large pour l'impact visuel */
    background: var(--accent-color); /* Couleur unie pour le rappel magazine */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: fadeInRight 1s ease-out;
}

.mapbox figure {
    width: 80%;
    height: 70%;
    margin: 0;
    transform: rotate(2deg); /* Petit effet de papier posé */
    transition: transform 0.5s ease;
}

.mapbox figure:hover {
    transform: rotate(0deg) scale(1.02);
}

.mapbox iframe {
    width: 100%;
    height: 100%;
    border-radius: 0; /* Carré pour le style éditorial */
    box-shadow: 20px 20px 0px var(--text-color);
    border: 3px solid var(--text-color);
}

/* --- Animations --- */
@keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
}

/* --- Responsive Mobile --- */
@media screen and (max-width: 768px) {
    #contact {
        flex-direction: column;
        overflow-y: auto;
    }
    
    .contact-info {
        padding: 2rem;
        order: 2; /* Les infos passent après la carte sur mobile si besoin */
    }
    
    .contact-info .article-title {
        font-size: 2.5rem;
    }
    
    .mapbox {
        min-height: 400px;
        order: 1;
    }

    .mapbox figure {
        width: 90%;
        height: 300px;
        transform: rotate(0deg);
    }
}```

## Fichier : ./app/header/header.css
```css
/* Utilisation des variables globales */
:root {
    --accent-color: #e76f51;
    --bg-color: #fdfaf5;
    --text-color: #264653;
}

/* Le bandeau de navigation (Remplace .color) */
.color {
    background: linear-gradient(90deg, #ff3131 0%, #ff9104 100%);
    padding: 15px 40px;
    box-shadow: 0 4px 0px var(--text-color); /* Bordure épaisse façon BD/Magazine */
    position: sticky;
    top: 0;
    z-index: 1000;
}

/* Conteneur flex pour logo + menu */
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

/* Section logo et prénom */
.logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo {
    width: 50px;
    height: 50px;
    border-radius: 50%; /* Pour un effet cercle, enlevez si vous préférez garder le format original */
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.prenom {
    font-family: 'Playfair Display', "Times New Roman", serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    letter-spacing: 2px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: flex-end; /* Aligne le menu à droite */
    gap: 40px;
}

/* Style des liens (Texte) */
a {
    font-family: 'Playfair Display', "Times New Roman", serif; /* Style Serif pour le luxe */ 
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #ffffff;
    text-decoration: none;
    position: relative;
    padding: 5px 10px;
    transition: color 0.3s ease;
}

/* --- L'Animation "Stabilo" Magazine --- */
a::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 0; /* Départ caché */
    height: 100%;
    background-color: var(--text-color); /* On utilise le bleu pétrole pour le contraste */   
    transform: skewX(-15deg); /* L'inclinaison dynamique que vous aimiez */
    transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

a:hover {
    color: var(--bg-color); /* Le texte devient crème sur le bloc sombre */
    text-decoration: none; /* On enlève le soulignement classique pour l'effet bloc */        
}

a:hover::before {
    width: 100%; /* Le bloc se remplit au survol */
}

/* --- Responsive Mobile --- */
@media (max-width: 768px) {
    .color {
        padding: 10px 20px;
    }
    
    .header-container {
        flex-direction: column;
        gap: 15px;
    }
    
    .logo-section {
        gap: 10px;
    }
    
    .logo {
        width: 40px;
        height: 40px;
    }
    
    .prenom {
        font-size: 1.2rem;
    }

    ul {
        justify-content: center; /* Centré sur mobile */
        gap: 15px;
    }

    a {
        font-size: 0.8rem;
        letter-spacing: 1px;
    }
}```

## Fichier : ./app/home/home.css
```css
/* Importation d'une police élégante */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Poppins:wght@300;400;600&display=swap');

:root {
    --accent-color: #e76f51;
    --bg-color: #ffffff;     /* Fond blanc */
    --text-color: #264653;
}

#profil {
    font-family: 'Poppins', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    max-width: 1000px;
    margin: 20px auto;
    padding: 40px;
    line-height: 1.6;
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 30px;
    box-shadow: 10px 10px 0px var(--accent-color);
}

/* --- Header style Magazine --- */
#profil header {
    grid-column: 1 / -1;
    border-bottom: 4px solid var(--text-color);
    padding-bottom: 20px;
    margin-bottom: 20px;
    animation: fadeInDown 1s ease-out;
}

#profil h2 {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    text-transform: uppercase;
    margin: 0;
    line-height: 1;
    color: var(--accent-color);
}

#profil header p {
    font-size: 1.5rem;
    font-weight: 300;
    font-style: italic;
    margin-top: 10px;
}

/* --- Sections --- */
h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    border-left: 5px solid var(--accent-color);
    padding-left: 15px;
    margin-bottom: 20px;
}

section {
    animation: fadeInUp 1s ease-out backwards;
}

/* Délai d'animation pour chaque section */
#soft-skills { animation-delay: 0.3s; }
#langues { animation-delay: 0.5s; }
#loisirs { 
    animation-delay: 0.7s; 
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

/* --- Listes et Détails --- */
ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px dashed #ccc;
}

.loisir {
    background: #fff;
    padding: 20px;
    transition: transform 0.3s ease;
}

.loisir:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* --- Animations --- */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    #profil {
        grid-template-columns: 1fr;
        margin: 10px;
        padding: 20px;
    }

    #profil h2 {
        font-size: 2.5rem;
    }

    #loisirs {
        grid-template-columns: 1fr;
    }
}```

## Fichier : ./app/projets/projets.css
```css
/* Utilisation des variables globales */
:root {
    --accent-color: #e76f51;
    --bg-color: #ffffff;
    --text-color: #264653;
}

section {
    position: relative;
    background-color: var(--bg-color);
    padding: 80px 0;
    overflow: hidden;
}

/* Le fond décoratif façon "ruban de couleur" magazine */
section::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    height: 350px; /* Augmenté légèrement pour l'équilibre visuel */
    background: var(--text-color);
    z-index: 0;
}

ol {
    position: relative;
    z-index: 1;
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 60px; /* Espace augmenté pour laisser respirer les titres */
    margin: 0 auto;
    padding: 0 20px;
    flex-wrap: wrap;
    max-width: 1200px;
}

/* Chaque projet (li) */
li {
    flex: 1;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 0.8s ease-out backwards;
}

li:nth-child(2) { animation-delay: 0.2s; }
li:nth-child(3) { animation-delay: 0.4s; }

/* Titres de projets style Titre de Presse */
li h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 900;
    color: var(--accent-color);
    margin: 0;
    line-height: 0.8;
    z-index: 10; /* Priorité maximale pour le chevauchement */
    transform: translateY(35px); /* Positionnement précis sur l'image */
    pointer-events: none; /* L'utilisateur clique à travers le titre sur l'image */
}

li h4 {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--text-color);
    margin-bottom: 0;
    z-index: 2;
}

/* Style de la photo (figure) */
figure {
    margin: 0;
    background: #fff;
    padding: 12px; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
    width: 100%;
    max-width: 340px; /* Taille fixée pour l'harmonie */
}

figure img {
    width: 100%;
    height: 400px; /* Hauteur fixe pour uniformiser les projets */
    object-fit: cover; /* Recadrage propre peu importe le format d'origine */
    display: block;
    filter: grayscale(30%);
    transition: filter 0.3s;
}

li:hover figure {
    transform: translateY(-10px) rotate(1deg);
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
}

li:hover figure img {
    filter: grayscale(0%);
}

/* Légende sous la photo */
figcaption {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.2rem;
    color: #ffffff;
    margin-top: 25px;
    text-align: center;
    z-index: 2;
}

/* Lien source */
li a[alt="Code source"] {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--accent-color);
    text-decoration: none;
    letter-spacing: 1px;
    margin-top: 15px;
    padding: 6px 12px;
    border: 1px solid transparent;
    transition: all 0.3s;
    z-index: 2;
}

li a[alt="Code source"]:hover {
    border-color: var(--accent-color);
    background: rgba(231, 111, 81, 0.1);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* --- Responsive --- */
@media (max-width: 768px) {
    section::after {
        height: 100%;
    }
    
    li h1 {
        font-size: 2.8rem;
        transform: translateY(25px);
    }
    
    figure img {
        height: 300px; /* Plus petit sur mobile */
    }

    ol {
        gap: 60px;
    }
}```

## Fichier : ./app/tree/tree.css
```css
```

## Fichier : ./styles.css
```css
/* You can add global styles to this file, and also import other style files */
```

