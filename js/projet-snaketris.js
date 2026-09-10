/* =========================
   PROJET SNAKETRIS — SCRIPT
========================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       1. LECTURE AUTOMATIQUE DE LA VIDÉO
    ========================== */
    const video = document.querySelector('.project-video');

    if (video) {
        // Pause la vidéo si l'utilisateur quitte l'onglet
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !video.paused) {
                video.pause();
            }
        });

        // Gestion d'erreur de chargement de la vidéo
        video.addEventListener('error', () => {
            console.warn('⚠ La vidéo Snaketris n\'a pas pu être chargée. Vérifie le chemin ../assets/videos/snaketris.webm');
        });
    }


    /* =========================
       2. ANIMATION D'APPARITION AU SCROLL
    ========================= */
    const animatedElements = document.querySelectorAll(
        '.project-media, .project-copy, .section-card, .project-socials'
    );

    if ('IntersectionObserver' in window && animatedElements.length > 0) {

        // État initial : invisible + décalé vers le bas
        animatedElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach((el) => observer.observe(el));
    }


    /* =========================
       3. COPIE DU LIEN GITHUB (optionnel)
    ========================= */
    const githubLink = document.querySelector('.project-socials a[href*="github"]');

    if (githubLink) {
        githubLink.addEventListener('click', () => {
            // Petit log pour vérifier le clic (peut être retiré)
            console.log('→ Ouverture du dépôt GitHub Snaketris');
        });
    }

});