document.addEventListener("DOMContentLoaded", function () {

    console.log("Pinterest Clone : JavaScript chargé correctement !");

    /* =========================
       ANIMATION DES RÉSEAUX
    ========================= */

    const socialLinks = document.querySelectorAll(".project-socials a");

    socialLinks.forEach(function (link) {

        link.addEventListener("mouseenter", function () {
            link.style.transform = "translateY(-8px) scale(1.08)";
        });

        link.addEventListener("mouseleave", function () {
            link.style.transform = "translateY(0) scale(1)";
        });

        link.addEventListener("click", function (event) {

            // Empêche uniquement le lien # de remonter en haut
            if (link.getAttribute("href") === "#") {
                event.preventDefault();
            }

            link.animate(
                [
                    {
                        transform: "translateY(0) scale(1)"
                    },
                    {
                        transform: "translateY(-5px) scale(0.95)"
                    },
                    {
                        transform: "translateY(-8px) scale(1.08)"
                    }
                ],
                {
                    duration: 300,
                    easing: "ease-out"
                }
            );
        });

    });


    /* =========================
       ANIMATION D'APPARITION
       DU CONTENU
    ========================= */

    const projectMedia = document.querySelector(".project-media");
    const projectCopy = document.querySelector(".project-copy");

    if (projectMedia) {
        projectMedia.style.opacity = "0";
        projectMedia.style.transform = "translateX(-30px)";
        projectMedia.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        setTimeout(function () {
            projectMedia.style.opacity = "1";
            projectMedia.style.transform = "translateX(0)";
        }, 100);
    }

    if (projectCopy) {
        projectCopy.style.opacity = "0";
        projectCopy.style.transform = "translateX(30px)";
        projectCopy.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        setTimeout(function () {
            projectCopy.style.opacity = "1";
            projectCopy.style.transform = "translateX(0)";
        }, 250);
    }

});