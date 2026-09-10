(() => {
    "use strict";

    /* =====================================================
       ARSELLIA — ANIMATION PROJETS
       VERSION ORIGINALE CONSERVÉE
    ===================================================== */

    const scriptURL = document.currentScript
        ? document.currentScript.src
        : document.baseURI;

    const CONFIG = {
        totalFrames: 240,
        framePath: new URL(
            "../assets/animations/projects/",
            scriptURL
        ).href,
        framePrefix: "frame_",
        frameExtension: ".webp",
        firstFrame: 1,
        framePadding: 6,
        preloadRadius: 18,
        smoothing: 0.14
    };


    /* =====================================================
       ELEMENTS ANIMATION
    ===================================================== */

    const canvas = document.getElementById("morphCanvas");
    const section = document.querySelector(".sequence-scroll");
    const sticky = document.querySelector(".sequence-sticky");
    const progressBar = document.getElementById("progressBar");


    /* =====================================================
       ANIMATION CANVAS
    ===================================================== */

    if (canvas && section && sticky) {

        const ctx = canvas.getContext("2d", {
            alpha: false
        });

        const images = new Array(CONFIG.totalFrames);
        const requested = new Set();

        let currentFrame = 0;
        let targetFrame = 0;

        let dpr = 1;
        let width = 1;
        let height = 1;


        /* -------------------------------------------------
           URL D'UNE FRAME
        ------------------------------------------------- */

        function frameURL(index) {

            const number = String(
                index + CONFIG.firstFrame
            ).padStart(
                CONFIG.framePadding,
                "0"
            );

            return (
                CONFIG.framePath +
                CONFIG.framePrefix +
                number +
                CONFIG.frameExtension
            );
        }


        /* -------------------------------------------------
           RESIZE CANVAS
        ------------------------------------------------- */

        function resizeCanvas() {

            const rect =
                canvas.getBoundingClientRect();

            width = Math.max(
                1,
                Math.round(rect.width)
            );

            height = Math.max(
                1,
                Math.round(rect.height)
            );

            dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            canvas.width =
                Math.round(width * dpr);

            canvas.height =
                Math.round(height * dpr);

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

            drawFrame(
                Math.round(currentFrame)
            );
        }


        /* -------------------------------------------------
           CHARGEMENT FRAME
        ------------------------------------------------- */

        function loadFrame(index) {

            if (
                index < 0 ||
                index >= CONFIG.totalFrames
            ) {
                return;
            }

            if (
                images[index] ||
                requested.has(index)
            ) {
                return;
            }

            requested.add(index);

            const image = new Image();

            image.decoding = "async";

            image.onload = () => {

                images[index] = image;

                if (index === 0) {
                    drawFrame(0);
                }
            };

            image.onerror = () => {

                console.warn(
                    "[Arsellia] Frame introuvable :",
                    frameURL(index)
                );
            };

            image.src = frameURL(index);
        }


        /* -------------------------------------------------
           PRECHARGEMENT INTELLIGENT
        ------------------------------------------------- */

        function preloadAround(index) {

            const start =
                Math.max(
                    0,
                    index - CONFIG.preloadRadius
                );

            const end =
                Math.min(
                    CONFIG.totalFrames - 1,
                    index + CONFIG.preloadRadius
                );

            for (
                let i = start;
                i <= end;
                i++
            ) {
                loadFrame(i);
            }
        }


        /* -------------------------------------------------
           FRAME DISPONIBLE
        ------------------------------------------------- */

        function getAvailableFrame(index) {

            if (
                images[index] &&
                images[index].complete &&
                images[index].naturalWidth > 0
            ) {
                return images[index];
            }

            for (
                let distance = 1;
                distance <= CONFIG.preloadRadius;
                distance++
            ) {

                const before =
                    index - distance;

                if (
                    before >= 0 &&
                    images[before] &&
                    images[before].complete &&
                    images[before].naturalWidth > 0
                ) {
                    return images[before];
                }

                const after =
                    index + distance;

                if (
                    after < CONFIG.totalFrames &&
                    images[after] &&
                    images[after].complete &&
                    images[after].naturalWidth > 0
                ) {
                    return images[after];
                }
            }

            return null;
        }


        /* -------------------------------------------------
           DESSIN FRAME
        ------------------------------------------------- */

        function drawFrame(index) {

            const image =
                getAvailableFrame(index);

            if (!image) {
                return;
            }

            ctx.fillStyle = "#000000";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

            const scale =
                Math.max(
                    width / image.naturalWidth,
                    height / image.naturalHeight
                ) * 1.06;

            const drawWidth =
                image.naturalWidth * scale;

            const drawHeight =
                image.naturalHeight * scale;

            const x =
                (width - drawWidth) / 2;

            const y =
                (height - drawHeight) / 2;

            ctx.drawImage(
                image,
                x,
                y,
                drawWidth,
                drawHeight
            );
        }


        /* -------------------------------------------------
           PROGRESSION SCROLL
        ------------------------------------------------- */

        function getProgress() {

            const rect =
                section.getBoundingClientRect();

            const travel =
                Math.max(
                    1,
                    section.offsetHeight -
                    sticky.offsetHeight
                );

            return Math.max(
                0,
                Math.min(
                    1,
                    -rect.top / travel
                )
            );
        }


        /* -------------------------------------------------
           UPDATE SCROLL
        ------------------------------------------------- */

        function updateScroll() {

            const progress =
                getProgress();

            const eased =
                progress * progress;

            targetFrame =
                eased *
                (CONFIG.totalFrames - 1);

            preloadAround(
                Math.round(targetFrame)
            );

            if (progressBar) {

                progressBar.value =
                    progress;
            }

            sticky.classList.toggle(
                "is-complete",
                progress >= 0.995
            );
        }


        /* -------------------------------------------------
           BOUCLE RENDU
        ------------------------------------------------- */

        function render() {

            currentFrame +=
                (
                    targetFrame -
                    currentFrame
                ) * CONFIG.smoothing;

            if (
                Math.abs(
                    targetFrame -
                    currentFrame
                ) < 0.01
            ) {
                currentFrame =
                    targetFrame;
            }

            drawFrame(
                Math.round(currentFrame)
            );

            requestAnimationFrame(render);
        }


        /* -------------------------------------------------
           EVENTS ANIMATION
        ------------------------------------------------- */

        window.addEventListener(
            "resize",
            resizeCanvas,
            {
                passive: true
            }
        );

        window.addEventListener(
            "scroll",
            updateScroll,
            {
                passive: true
            }
        );


        /* -------------------------------------------------
           INITIALISATION
        ------------------------------------------------- */

        resizeCanvas();

        loadFrame(0);

        preloadAround(0);

        updateScroll();

        render();
    }


    const skipAnimationButton =
        document.getElementById("skipAnimation");

    if (skipAnimationButton) {
        skipAnimationButton.addEventListener("click", () => {
            const projectsSection =
                document.getElementById("mes-projets");

            if (!projectsSection) return;

            projectsSection.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    }


    /* =====================================================
       CARROUSEL DES PROJETS
    ===================================================== */

    const carousel =
        document.querySelector(".projects-carousel");

    if (carousel) {

        const track =
            carousel.querySelector(
                ".projects-carousel__track"
            );

        const slides =
            Array.from(
                carousel.querySelectorAll(
                    ".project-panel"
                )
            );

        const previousButton =
            carousel.querySelector(
                ".carousel-button--previous"
            );

        const nextButton =
            carousel.querySelector(
                ".carousel-button--next"
            );

        const indicators =
            Array.from(
                document.querySelectorAll(
                    ".carousel-indicator"
                )
            );


        let currentSlide = 0;


        function getSlidesPerView() {

            if (
                window.innerWidth <= 750
            ) {
                return 1;
            }

            if (
                window.innerWidth <= 1100
            ) {
                return 2;
            }

            return 3;
        }


        function updateIndicators() {

            indicators.forEach(
                (indicator, index) => {

                    indicator.classList.toggle(
                        "is-active",
                        index === currentSlide
                    );
                }
            );
        }


        function updateCarousel() {

            if (!track || slides.length === 0) {
                return;
            }


            /* Mobile : scroll naturel */

            if (
                window.innerWidth <= 750
            ) {
                track.style.transform =
                    "translateX(0)";

                updateIndicators();

                return;
            }


            const slidesPerView =
                getSlidesPerView();

            const slideWidth =
                slides[0].getBoundingClientRect().width;

            const styles =
                window.getComputedStyle(track);

            const gap =
                parseFloat(styles.gap) || 0;


            const maxSlide =
                Math.max(
                    0,
                    slides.length -
                    slidesPerView
                );


            currentSlide =
                Math.max(
                    0,
                    Math.min(
                        currentSlide,
                        maxSlide
                    )
                );


            const translateX =
                currentSlide *
                (slideWidth + gap);


            track.style.transform =
                `translateX(-${translateX}px)`;


            updateIndicators();
        }


        function nextSlide() {

            const maxSlide =
                Math.max(
                    0,
                    slides.length -
                    getSlidesPerView()
                );


            if (
                currentSlide >= maxSlide
            ) {
                currentSlide = 0;

            } else {
                currentSlide++;
            }


            updateCarousel();
        }


        function previousSlide() {

            const maxSlide =
                Math.max(
                    0,
                    slides.length -
                    getSlidesPerView()
                );


            if (
                currentSlide <= 0
            ) {
                currentSlide = maxSlide;

            } else {
                currentSlide--;
            }


            updateCarousel();
        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                nextSlide
            );
        }


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                previousSlide
            );
        }


        indicators.forEach(
            (indicator, index) => {

                indicator.addEventListener(
                    "click",
                    () => {

                        currentSlide = index;

                        updateCarousel();
                    }
                );
            }
        );


        window.addEventListener(
            "resize",
            updateCarousel,
            {
                passive: true
            }
        );


        updateCarousel();
    }

})();