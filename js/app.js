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
    desktopPreloadRadius: 10,
    mobilePreloadRadius: 6,
    smoothing: 0.18
  };

  if (canvas && section && sticky) {
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    const images = new Array(CONFIG.totalFrames);
    const requested = new Set();

    let currentFrame = 0;
    let targetFrame = 0;
    let width = 1;
    let height = 1;
    let framePending = false;
    let scrollPending = false;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const constrainedNetwork = Boolean(connection?.saveData) ||
      /(^slow-2g|2g)/i.test(connection?.effectiveType || "");

    function getPreloadRadius() {
      const isMobile = window.matchMedia("(max-width: 750px)").matches;
      return constrainedNetwork
        ? 2
        : (isMobile ? CONFIG.mobilePreloadRadius : CONFIG.desktopPreloadRadius);
    }

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

    function loadFrame(index, priority = "low") {
      if (
        index < 0 ||
        index >= CONFIG.totalFrames ||
        images[index] ||
        requested.has(index)
      ) return;

      requested.add(index);

      const image = new Image();
      image.decoding = "async";

      try {
        image.fetchPriority = priority;
      } catch (_) {}

      image.onload = () => {
        images[index] = image;

        // Toujours afficher le premier frame dès qu'il arrive.
        if (index === 0) {
          drawFrame(0);
        }

        if (index === Math.round(targetFrame)) {
          drawFrame(index);
        }
      };

      image.onerror = () => {
        requested.delete(index);
        console.warn("[Arsellia] Frame projet introuvable :", frameURL(index));
      };

      image.src = frameURL(index);
    }

    function preloadAround(index) {
      loadFrame(index, "high");

      const preloadRadius = getPreloadRadius();

      for (let distance = 1; distance <= preloadRadius; distance += 1) {
        loadFrame(index - distance);
        loadFrame(index + distance);
      }
    }

    function resizeCanvas() {
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
      const progress = getProgress();

      targetFrame =
        (progress * progress) *
        (CONFIG.totalFrames - 1);

      preloadAround(Math.round(targetFrame));

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

      // Les navigateurs mobiles peuvent encore modifier la hauteur du viewport
      // quelques dizaines de millisecondes après la rotation.
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

    // Initialisation immédiate : le premier frame est prioritaire.
    resizeCanvas();
    loadFrame(0, "high");
    preloadAround(0);
    updateScroll();
  }

  const skipAnimationButton =
    document.getElementById("skipAnimation");

  if (skipAnimationButton) {
    const projectsSection =
      document.getElementById("mes-projets");

    skipAnimationButton.addEventListener("click", () => {
      projectsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }
})();
