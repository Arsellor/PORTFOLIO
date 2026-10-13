(() => {
    "use strict";

    const CONFIG = {
        totalFrames: 240,
        framePath: new URL("./assets/animations/projects/", document.baseURI).href,
        preloadRadius: 2,
        maxConcurrentLoads: 3,
        smoothing: 0.18
    };

    const canvas = document.getElementById("projectsCanvas");
    const section = document.querySelector(".projects-sequence");
    const sticky = document.querySelector(".projects-sequence__sticky");
    const progress = document.getElementById("projectsProgress");

    if (!canvas || !section || !sticky) return;

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    const poster = section.querySelector(".projects-sequence__poster");
    const connection = navigator.connection;
    const canAnimate = Boolean(
        context &&
        window.matchMedia(
            "(min-width: 901px) and (prefers-reduced-motion: no-preference)"
        ).matches &&
        !connection?.saveData
    );

    if (!canAnimate) return;

    section.classList.remove("is-static");
    section.classList.add("is-animating");

    const images = new Array(CONFIG.totalFrames);
    const requested = new Set();
    const failed = new Set();
    let pendingFrames = [];
    let activeLoads = 0;
    let currentFrame = 0;
    let targetFrame = 0;
    let width = 1;
    let height = 1;
    let framePending = false;
    let scrollPending = false;

    function frameUrl(index) {
        const number = String(index + 1).padStart(6, "0");
        return `${CONFIG.framePath}frame_${number}.webp`;
    }

    function getAvailableFrame(index) {
        for (let distance = 0; distance <= CONFIG.preloadRadius; distance += 1) {
            for (const candidate of [index - distance, index + distance]) {
                const image = images[candidate];
                if (
                    candidate >= 0 &&
                    candidate < CONFIG.totalFrames &&
                    image?.complete &&
                    image.naturalWidth > 0
                ) return image;
            }
        }

        return null;
    }

    function drawFrame(index) {
        const image = getAvailableFrame(index);
        if (!image || document.hidden) return;

        context.clearRect(0, 0, width, height);

        const scale = Math.min(
            width / image.naturalWidth,
            height / image.naturalHeight
        );
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;

        context.drawImage(
            image,
            (width - drawWidth) / 2,
            (height - drawHeight) / 2,
            drawWidth,
            drawHeight
        );
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
                if (index === Math.round(targetFrame)) {
                    drawFrame(index);
                } else {
                    drawFrame(Math.round(targetFrame));
                }
                pumpFrameQueue();
            };
            image.onerror = () => {
                failed.add(index);
                activeLoads -= 1;
                console.warn("[Arsellia] Frame projet introuvable :", frameUrl(index));
                pumpFrameQueue();
            };
            image.src = frameUrl(index);
        }
    }

    function preloadAround(index) {
        pendingFrames = [];

        for (let distance = 0; distance <= CONFIG.preloadRadius; distance += 1) {
            const ahead = index + distance;
            const behind = index - distance;
            if (ahead < CONFIG.totalFrames) pendingFrames.push(ahead);
            if (distance > 0 && behind >= 0) pendingFrames.push(behind);
        }

        pumpFrameQueue();
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(1, Math.round(rect.width));
        height = Math.max(1, Math.round(rect.height));

        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawFrame(Math.round(currentFrame));
    }

    function updateScroll() {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(1, section.offsetHeight - sticky.offsetHeight);
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / travel));

        targetFrame = scrollProgress * scrollProgress * (CONFIG.totalFrames - 1);
        preloadAround(Math.round(targetFrame));
        if (progress) progress.value = scrollProgress;
        scheduleRender();
    }

    function scheduleRender() {
        if (framePending || document.hidden) return;

        framePending = true;
        requestAnimationFrame(() => {
            framePending = false;
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

    function handleScroll() {
        if (scrollPending) return;

        scrollPending = true;
        requestAnimationFrame(() => {
            scrollPending = false;
            updateScroll();
        });
    }

    function handleVisibilityChange() {
        if (document.hidden) return;
        resizeCanvas();
        updateScroll();
    }

    if (poster?.complete && poster.naturalWidth > 0) {
        images[0] = poster;
    } else if (poster) {
        poster.addEventListener("load", () => {
            images[0] = poster;
            drawFrame(Math.round(currentFrame));
        }, { once: true });
    }

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resizeCanvas();
    preloadAround(0);
    updateScroll();
})();
