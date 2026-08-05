/**
 * Portfolio interactions
 *   1. Rotating profile photo (cross-fade) on the About page
 *   2. Timeline "See more" / "See less" reveal on the About page
 *
 * No dependencies. Safe to load on every page — each feature no-ops when its
 * markup isn't present.
 */
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* 1. Rotating profile photo                                          */
  /* ------------------------------------------------------------------ */
  // Default frame shape (matches the CSS `aspect-ratio: 4 / 5`). Photos NOT marked
  // `data-wide` keep this fixed crop; only wide photos reshape to their true shape.
  const DEFAULT_ASPECT = 4 / 5;
  // Clamp so wide photos never get too extreme (portrait floor / landscape ceiling).
  const ASPECT_MIN = 0.55; // tallest portrait allowed  (w/h)
  const ASPECT_MAX = 1.5; //  widest landscape allowed  (w/h)

  function initProfileRotator() {
    document.querySelectorAll(".profile-rotator").forEach(function (rotator) {
      const images = rotator.querySelectorAll(".profile-rotator-img");
      if (images.length <= 1) return; // nothing to rotate

      const interval = parseInt(rotator.getAttribute("data-interval"), 10) || 4500;
      const canReshape = !rotator.classList.contains("is-circular");
      let current = 0;

      // Fit the frame to a photo: wide photos take their true (clamped) shape,
      // everything else snaps back to the fixed 4:5 crop.
      function fitFrameTo(img) {
        if (!canReshape) return;
        if (!img.hasAttribute("data-wide")) {
          rotator.style.aspectRatio = DEFAULT_ASPECT.toFixed(4);
          return;
        }
        function set() {
          const w = img.naturalWidth,
            h = img.naturalHeight;
          if (!w || !h) return;
          const ar = Math.max(ASPECT_MIN, Math.min(ASPECT_MAX, w / h));
          rotator.style.aspectRatio = ar.toFixed(4);
        }
        if (img.complete && img.naturalWidth) set();
        else img.addEventListener("load", set, { once: true });
      }

      function advance() {
        images[current].classList.remove("is-active");
        current = (current + 1) % images.length;
        images[current].classList.add("is-active");
        fitFrameTo(images[current]);
      }

      // Set the frame to the first photo's shape on load.
      fitFrameTo(images[0]);

      // Respect users who prefer reduced motion: don't auto-rotate,
      // but still let them advance by clicking the photo.
      if (!prefersReducedMotion) {
        let timer = window.setInterval(advance, interval);
        // Pause on hover for readability.
        rotator.addEventListener("mouseenter", function () {
          window.clearInterval(timer);
        });
        rotator.addEventListener("mouseleave", function () {
          timer = window.setInterval(advance, interval);
        });
      }

      rotator.style.cursor = "pointer";
      rotator.addEventListener("click", advance);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. Timeline "See more" / "See less"                                */
  /* ------------------------------------------------------------------ */
  function initTimeline() {
    const timeline = document.querySelector(".timeline");
    const button = document.querySelector(".timeline-more");
    if (!timeline || !button) return;

    const batch = parseInt(timeline.getAttribute("data-batch"), 10) || 5;
    const initial = parseInt(timeline.getAttribute("data-initial"), 10) || 7;
    const items = Array.prototype.slice.call(timeline.querySelectorAll(".timeline-item"));
    const countLabel = button.querySelector(".timeline-more-count");

    function hiddenItems() {
      return items.filter(function (li) {
        return li.classList.contains("is-collapsed");
      });
    }

    function updateButton() {
      const hidden = hiddenItems();
      if (hidden.length === 0) {
        button.textContent = "See less";
        button.classList.add("is-expanded");
      } else {
        button.classList.remove("is-expanded");
        button.textContent = "See more ";
        const span = document.createElement("span");
        span.className = "timeline-more-count";
        span.textContent = "(+" + hidden.length + ")";
        button.appendChild(span);
      }
    }

    button.addEventListener("click", function () {
      if (button.classList.contains("is-expanded")) {
        // Collapse back to the initial set.
        items.forEach(function (li, i) {
          if (i >= initial) li.classList.add("is-collapsed");
        });
        // Scroll the timeline back into view so the collapse isn't jarring.
        const section = timeline.closest(".timeline-section");
        if (section) section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      } else {
        // Reveal the next batch.
        hiddenItems()
          .slice(0, batch)
          .forEach(function (li) {
            li.classList.remove("is-collapsed");
          });
      }
      updateButton();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProfileRotator();
    initTimeline();
  });
})();
