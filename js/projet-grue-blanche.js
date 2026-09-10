<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");

    // Ajoute une classe au header lorsque l'utilisateur scroll
    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 8
        );
    };

    // Vérification au chargement
    updateHeader();

    // Vérification pendant le scroll
    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    // Animation légère sur les boutons des réseaux sociaux
    document
        .querySelectorAll('.project-socials a[href="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {
                event.preventDefault();

                link.classList.add("pulse");

                setTimeout(() => {
                    link.classList.remove("pulse");
                }, 280);
            });

        });
=======
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");

    // Ajoute une classe au header lorsque l'utilisateur scroll
    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 8
        );
    };

    // Vérification au chargement
    updateHeader();

    // Vérification pendant le scroll
    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    // Animation légère sur les boutons des réseaux sociaux
    document
        .querySelectorAll('.project-socials a[href="#"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {
                event.preventDefault();

                link.classList.add("pulse");

                setTimeout(() => {
                    link.classList.remove("pulse");
                }, 280);
            });

        });
>>>>>>> origin/main
});