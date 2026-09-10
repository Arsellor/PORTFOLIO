(() => {
    "use strict";

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeader = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 40);
        };

        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    }

    document.querySelectorAll(".site-navigation__link").forEach((link) => {
        const icon = link.querySelector(".nav-icon");
        if (!icon) return;

        const orangeSource = icon.dataset.orange ||
            icon.src.replace("_noir", "_orange");
        const blackSource = icon.dataset.black ||
            icon.src.replace("_orange", "_noir");

        const syncIcon = (isHighlighted) => {
            icon.src = isHighlighted
                ? orangeSource
                : blackSource;
        };

        link.addEventListener("mouseenter", () => syncIcon(true));
        link.addEventListener("mouseleave", () => {
            syncIcon(link.classList.contains("is-active"));
        });

        syncIcon(link.classList.contains("is-active"));
    });

    const scrollToTopButton = document.querySelector(".scroll-to-top");

    if (scrollToTopButton) {
        const updateScrollToTopButton = () => {
            scrollToTopButton.classList.toggle(
                "is-visible",
                window.scrollY > 400
            );
        };

        window.addEventListener("scroll", updateScrollToTopButton, {
            passive: true
        });

        scrollToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });

        updateScrollToTopButton();
    }
})();
