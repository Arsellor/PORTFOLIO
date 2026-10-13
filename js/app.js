(() => {
  "use strict";

  const canvas = document.getElementById("morphCanvas");
  const section = document.querySelector(".sequence-scroll");
  const sticky = document.querySelector(".sequence-sticky");
  const progressBar = document.getElementById("progressBar");

  const CONFIG = {
    totalFrames: 240,
    framePath: new URL("./assets/animations/projects/", document.baseURI).href,
    framePrefix: "frame_",
    frameExtension: ".webp",
    firstFrame: 1,
    framePadding: 6,
    preloadRadius: 2,
    maxConcurrentLoads: 3,
    smoothing: 0.18
  };

  if (canvas && section && sticky) {
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    const poster = section.querySelector(".sequence-poster");
    const frameCounter = document.getElementById("frameCounterCurrent");
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
    let framePending = false;
    let scrollPending = false;

    function frameURL(index) {
      const number = String(index + CONFIG.firstFrame)
        .padStart(CONFIG.framePadding, "0");
      return `${CONFIG.framePath}${CONFIG.framePrefix}${number}${CONFIG.frameExtension}`;
    }

    function isLoaded(index) {
      const image = images[index];
      return Boolean(image && image.complete && image.naturalWidth > 0);
    }

    function drawFrame(index) {
      if (document.hidden) return;

      const image = isLoaded(index) ? images[index] : null;
      if (!image) return;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight
      ) * 1.06;

      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      ctx.drawImage(
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
          if (index === Math.round(targetFrame)) drawFrame(index);
          pumpFrameQueue();
        };

        image.onerror = () => {
          failed.add(index);
          activeLoads -= 1;
          console.warn("[Arsellia] Frame projet introuvable :", frameURL(index));
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

    function resizeCanvas() {
      if (!animateSequence) return;
      const rect = canvas.getBoundingClientRect();

      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawFrame(Math.round(currentFrame));
    }

    function getProgress() {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(
        1,
        section.offsetHeight - sticky.offsetHeight
      );

      return Math.max(
        0,
        Math.min(1, -rect.top / travel)
      );
    }

    function scheduleRender() {
      if (framePending || document.hidden) return;

      framePending = true;

      requestAnimationFrame(() => {
        framePending = false;

        const delta = targetFrame - currentFrame;

        currentFrame =
          Math.abs(delta) < 0.01
            ? targetFrame
            : currentFrame + delta * CONFIG.smoothing;

        drawFrame(Math.round(currentFrame));

        if (Math.abs(targetFrame - currentFrame) > 0.01) {
          scheduleRender();
        }
      });
    }

    function updateScroll() {
      if (!animateSequence) return;
      const progress = getProgress();

      targetFrame =
        (progress * progress) *
        (CONFIG.totalFrames - 1);

      preloadAround(Math.round(targetFrame));
      if (frameCounter) {
        frameCounter.textContent = String(Math.round(targetFrame) + 1).padStart(2, "0");
      }

      if (progressBar) {
        progressBar.value = progress;
      }

      sticky.classList.toggle(
        "is-complete",
        progress >= 0.995
      );

      scheduleRender();
    }

    function handleScroll() {
      if (scrollPending) return;

      scrollPending = true;

      requestAnimationFrame(() => {
        scrollPending = false;
        updateScroll();
      });
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
      const resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(canvas);

      window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
      );

      let orientationReflowTimer = 0;
      let orientationReflowFrame = 0;

      function reflowAfterOrientationChange() {
        window.cancelAnimationFrame(orientationReflowFrame);
        window.clearTimeout(orientationReflowTimer);

        orientationReflowFrame = window.requestAnimationFrame(() => {
          resizeCanvas();
          updateScroll();
        });

        orientationReflowTimer = window.setTimeout(() => {
          resizeCanvas();
          updateScroll();
        }, 180);
      }

      window.addEventListener(
        "resize",
        () => {
          resizeCanvas();
          updateScroll();
        },
        { passive: true }
      );

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

      document.addEventListener(
        "visibilitychange",
        () => {
          if (!document.hidden) {
            resizeCanvas();
            updateScroll();
          }
        }
      );

      resizeCanvas();
      preloadAround(0);
      updateScroll();
    }
  }

  const skipAnimationButton =
    document.getElementById("skipAnimation");

  if (skipAnimationButton) {
    const projectsSection =
      document.getElementById("mes-projets");

    skipAnimationButton.addEventListener("click", () => {
      projectsSection?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }
})();
