document.addEventListener("DOMContentLoaded", function () {

    console.log("Morazato : JavaScript chargé correctement !");


    /* =========================
       ANIMATION DE L'IMAGE
    ========================= */

    const projectMedia = document.querySelector(".project-media");

    if (projectMedia) {

        projectMedia.style.opacity = "0";
        projectMedia.style.transform = "translateX(-40px)";
        projectMedia.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(function () {

            projectMedia.style.opacity = "1";
            projectMedia.style.transform = "translateX(0)";

        }, 100);
    }


    /* =========================
       ANIMATION DU CONTENU
    ========================= */

    const projectCopy = document.querySelector(".project-copy");

    if (projectCopy) {

        projectCopy.style.opacity = "0";
        projectCopy.style.transform = "translateX(40px)";
        projectCopy.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(function () {

            projectCopy.style.opacity = "1";
            projectCopy.style.transform = "translateX(0)";

        }, 250);
    }


    /* =========================
       ANIMATION DES BLOCS
    ========================= */

    const facts = document.querySelectorAll(".fact");

    facts.forEach(function (fact, index) {

        fact.style.opacity = "0";
        fact.style.transform = "translateY(20px)";
        fact.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(function () {

            fact.style.opacity = "1";
            fact.style.transform = "translateY(0)";

        }, 400 + index * 150);

    });


    /* =========================
       RÉSEAUX SOCIAUX
    ========================= */

    const socialLinks =
        document.querySelectorAll(".project-socials a");

    socialLinks.forEach(function (link) {

        link.addEventListener("mouseenter", function () {

            link.style.transform =
                "translateY(-8px) scale(1.08)";

        });


        link.addEventListener("mouseleave", function () {

            link.style.transform =
                "translateY(0) scale(1)";

        });


        link.addEventListener("click", function (event) {

            if (link.getAttribute("href") === "#") {
                event.preventDefault();
            }

            link.animate(
                [
                    {
                        transform:
                            "translateY(0) scale(1)"
                    },

                    {
                        transform:
                            "translateY(-4px) scale(0.95)"
                    },

                    {
                        transform:
                            "translateY(-8px) scale(1.08)"
                    }
                ],

                {
                    duration: 300,
                    easing: "ease-out"
                }
            );

        });

    });

});