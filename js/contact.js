(() => {
    "use strict";

    const scriptURL = document.currentScript
        ? document.currentScript.src
        : document.baseURI;

    /* =========================================================
       ARSELLIA — SCROLL-DRIVEN CONTACT ANIMATION
       Le code d'origine est conservé et amélioré pour cohabiter
       avec la page Contact placée juste après l'animation.
    ========================================================= */

    const CONFIG = {
        totalFrames: 640,
        framePath: new URL(
            "../assets/animations/contact/frames/",
            scriptURL
        ).href,
        framePrefix: "frame_",
        frameExtension: ".webp",
        firstFrame: 1,
        preloadRadius: 18,
        smoothing: 0.14
    };

    const canvas = document.getElementById("contactCanvas");
    const section = document.querySelector(".contact-sequence");
    const sticky = document.querySelector(".contact-sequence__sticky");
    const progressBar = document.getElementById("progressBar");

    if (canvas && section && sticky) {
        const ctx = canvas.getContext("2d", { alpha: false });
        const images = new Array(CONFIG.totalFrames);
        const requested = new Set();

        let currentFrame = 0;
        let targetFrame = 0;
        let width = 1;
        let height = 1;
        let dpr = 1;

        function frameURL(index) {
            const number = String(index + CONFIG.firstFrame).padStart(6, "0");
            return `${CONFIG.framePath}${CONFIG.framePrefix}${number}${CONFIG.frameExtension}`;
        }

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            drawFrame(Math.round(currentFrame));
        }

        function loadFrame(index) {
            if (index < 0 || index >= CONFIG.totalFrames) return;
            if (images[index] || requested.has(index)) return;

            requested.add(index);

            const image = new Image();
            image.decoding = "async";

            image.onload = () => {
                images[index] = image;
                if (index === 0) drawFrame(0);
            };

            image.onerror = () => {
                console.warn("[Arsellia] Frame introuvable :", frameURL(index));
            };

            image.src = frameURL(index);
        }

        function preloadAround(index) {
            const start = Math.max(0, index - CONFIG.preloadRadius);
            const end = Math.min(CONFIG.totalFrames - 1, index + CONFIG.preloadRadius);

            for (let i = start; i <= end; i++) loadFrame(i);
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

            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, width, height);

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
            const progress = getProgress();

            // Début plus cinématique : accélération progressive.
            const eased = progress * progress;

            targetFrame = eased * (CONFIG.totalFrames - 1);
            preloadAround(Math.round(targetFrame));

            if (progressBar) progressBar.value = progress;

            sticky.classList.toggle("is-complete", progress >= 0.995);
        }

        function render() {
            currentFrame += (targetFrame - currentFrame) * CONFIG.smoothing;

            if (Math.abs(targetFrame - currentFrame) < 0.01) {
                currentFrame = targetFrame;
            }

            drawFrame(Math.round(currentFrame));
            requestAnimationFrame(render);
        }

        window.addEventListener("resize", resizeCanvas, { passive: true });
        window.addEventListener("scroll", updateScroll, { passive: true });

        resizeCanvas();
        loadFrame(0);
        preloadAround(0);
        updateScroll();
        render();
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
                `✅ Merci ${name} ! Votre message est prêt à être envoyé.`;

            status.className = "form-status is-success";

            const mailSubject = encodeURIComponent(subject);
            const mailBody = encodeURIComponent(
                `Nom : ${name}\nAdresse e-mail : ${email}\n\n${message}`
            );

            window.location.href =
                `mailto:tcharsellia2020@gmail.com?subject=${mailSubject}&body=${mailBody}`;
        });
    }

})();
