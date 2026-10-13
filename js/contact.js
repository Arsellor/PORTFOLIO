(() => {
    "use strict";

    /* =========================================================
       ARSELLIA — SCROLL-DRIVEN CONTACT ANIMATION
       Le code d'origine est conservé et amélioré pour cohabiter
       avec la page Contact placée juste après l'animation.
    ========================================================= */

    const CONFIG = {
        totalFrames: 640,
        framePath: new URL("./assets/animations/contact/frames/", document.baseURI).href,
        framePrefix: "frame_",
        frameExtension: ".webp",
        firstFrame: 1,
        preloadRadius: 2,
        maxConcurrentLoads: 3,
        smoothing: 0.14
    };

    const canvas = document.getElementById("contactCanvas");
    const section = document.querySelector(".contact-sequence");
    const sticky = document.querySelector(".contact-sequence__sticky");
    const progressBar = document.getElementById("progressBar");

    if (canvas && section && sticky) {
        const ctx = canvas.getContext("2d", { alpha: true });
        const poster = section.querySelector(".sequence-poster");
        const connection = navigator.connection;
        const animateSequence = Boolean(
            ctx &&
            window.matchMedia(
                "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
            ).matches &&
            !connection?.saveData
        );
        const images = new Array(CONFIG.totalFrames);
        const requested = new Set();
        const failed = new Set();
        let pendingFrames = [];
        let activeLoads = 0;

        let currentFrame = 0;
        let targetFrame = 0;
        let width = 1;
        let height = 1;
        let dpr = 1;
        let renderPending = false;

        function frameURL(index) {
            const number = String(index + CONFIG.firstFrame).padStart(6, "0");
            return `${CONFIG.framePath}${CONFIG.framePrefix}${number}${CONFIG.frameExtension}`;
        }

        function resizeCanvas() {
            if (!animateSequence) return;
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            drawFrame(Math.round(currentFrame));
        }

        function pumpFrameQueue() {
            if (document.hidden) return;
            while (
                activeLoads < CONFIG.maxConcurrentLoads &&
                pendingFrames.length > 0
            ) {
                const index = pendingFrames.shift();
                if (images[index] || requested.has(index) || failed.has(index)) continue;

                requested.add(index);
                activeLoads += 1;
                const image = new Image();
                image.decoding = "async";

                image.onload = () => {
                    images[index] = image;
                    activeLoads -= 1;
                    if (index === Math.round(targetFrame)) drawFrame(index);
                    pumpFrameQueue();
                };

                image.onerror = () => {
                    failed.add(index);
                    activeLoads -= 1;
                    console.warn("[Arsellia] Frame introuvable :", frameURL(index));
                    pumpFrameQueue();
                };

                image.src = frameURL(index);
            }
        }

        function preloadAround(index) {
            if (!animateSequence) return;

            pendingFrames = [];
            for (let distance = 0; distance <= CONFIG.preloadRadius; distance += 1) {
                const ahead = index + distance;
                const behind = index - distance;
                if (ahead < CONFIG.totalFrames) pendingFrames.push(ahead);
                if (distance > 0 && behind >= 0) pendingFrames.push(behind);
            }
            pumpFrameQueue();
        }

        function getAvailableFrame(index) {
            if (
                images[index] &&
                images[index].complete &&
                images[index].naturalWidth > 0
            ) return images[index];

            for (let distance = 1; distance <= CONFIG.preloadRadius; distance++) {
                const before = index - distance;
                const after = index + distance;

                if (
                    before >= 0 &&
                    images[before] &&
                    images[before].complete &&
                    images[before].naturalWidth > 0
                ) return images[before];

                if (
                    after < CONFIG.totalFrames &&
                    images[after] &&
                    images[after].complete &&
                    images[after].naturalWidth > 0
                ) return images[after];
            }

            return null;
        }

        function drawFrame(index) {
            const image = getAvailableFrame(index);
            if (!image) return;

            ctx.clearRect(0, 0, width, height);

            const scale = Math.max(
                width / image.naturalWidth,
                height / image.naturalHeight
            );

            const drawWidth = image.naturalWidth * scale;
            const drawHeight = image.naturalHeight * scale;
            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;

            ctx.drawImage(image, x, y, drawWidth, drawHeight);
        }

        function getProgress() {
            const rect = section.getBoundingClientRect();
            const travel = Math.max(
                1,
                section.offsetHeight - sticky.offsetHeight
            );

            return Math.max(0, Math.min(1, -rect.top / travel));
        }

        function updateScroll() {
            if (!animateSequence) return;
            const progress = getProgress();

            // Début plus cinématique : accélération progressive.
            const eased = progress * progress;

            targetFrame = eased * (CONFIG.totalFrames - 1);
            preloadAround(Math.round(targetFrame));

            if (progressBar) progressBar.value = progress;

            sticky.classList.toggle("is-complete", progress >= 0.995);
            scheduleRender();
        }

        function scheduleRender() {
            if (renderPending || document.hidden) return;
            renderPending = true;
            requestAnimationFrame(() => {
                renderPending = false;
                const delta = targetFrame - currentFrame;
                currentFrame = Math.abs(delta) < 0.01
                    ? targetFrame
                    : currentFrame + delta * CONFIG.smoothing;
                drawFrame(Math.round(currentFrame));
                if (Math.abs(targetFrame - currentFrame) >= 0.01) {
                    scheduleRender();
                }
            });
        }

        let orientationReflowTimer = 0;
        let orientationReflowFrame = 0;

        function reflowAfterOrientationChange() {
            window.cancelAnimationFrame(orientationReflowFrame);
            window.clearTimeout(orientationReflowTimer);

            orientationReflowFrame = window.requestAnimationFrame(() => {
                resizeCanvas();
                updateScroll();
            });

            // Sur mobile, la hauteur du viewport peut se stabiliser après la rotation.
            orientationReflowTimer = window.setTimeout(() => {
                resizeCanvas();
                updateScroll();
            }, 180);
        }

        if (poster?.complete && poster.naturalWidth > 0) {
            images[0] = poster;
        } else if (poster) {
            poster.addEventListener("load", () => {
                images[0] = poster;
                if (animateSequence) drawFrame(Math.round(currentFrame));
            }, { once: true });
        }

        if (animateSequence) {
            window.addEventListener("resize", () => {
                resizeCanvas();
                updateScroll();
            }, { passive: true });

            window.addEventListener(
                "orientationchange",
                reflowAfterOrientationChange,
                { passive: true }
            );

            if (window.visualViewport) {
                window.visualViewport.addEventListener(
                    "resize",
                    reflowAfterOrientationChange,
                    { passive: true }
                );
            }

            window.addEventListener("scroll", updateScroll, { passive: true });

            resizeCanvas();
            preloadAround(0);
            updateScroll();

            document.addEventListener("visibilitychange", () => {
                if (!document.hidden) {
                    resizeCanvas();
                    updateScroll();
                }
            });
        }
    }

    const skipAnimationButton =
        document.getElementById("skipAnimation");

    if (skipAnimationButton && section) {
        skipAnimationButton.addEventListener("click", () => {
            const contactSection =
                document.getElementById("contact");

            if (!contactSection) return;

            contactSection.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    }

     /* =========================================================
         FORMULAIRE CONTACT
         Ouvre le client mail avec un message prérempli.
     ========================================================= */

    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    if (form && status) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const subject = String(formData.get("subject") || "").trim();
            const message = String(formData.get("message") || "").trim();

            if (!name || !email || !subject || !message) {
                status.textContent = "⚠️ Merci de remplir tous les champs.";
                status.className = "form-status is-error";
                return;
            }

            status.textContent =
                "Votre logiciel de messagerie devrait s’ouvrir. Le message ne sera pas envoyé automatiquement : vérifiez-le puis cliquez sur Envoyer.";

            status.className = "form-status is-success";

            const mailSubject = encodeURIComponent(subject);
            const mailBody = encodeURIComponent(
                `Nom : ${name}\nAdresse e-mail : ${email}\n\n${message}`
            );

            try {
                window.location.href =
                    `mailto:tcharsellia2020@gmail.com?subject=${mailSubject}&body=${mailBody}`;
            } catch (error) {
                status.textContent =
                    "Impossible d’ouvrir votre logiciel de messagerie. Écrivez directement à tcharsellia2020@gmail.com.";
                status.className = "form-status is-error";
                console.error("[Arsellia] Impossible d’ouvrir le lien e-mail.", error);
            }
        });
    }

})();
