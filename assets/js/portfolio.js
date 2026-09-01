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

  /* ------------------------------------------------------------------ */
  /* 3. Career media rotator (images and/or videos)                     */
  /* ------------------------------------------------------------------ */
  // Each `.career-rotator` holds one or more `.career-rotator-item`s (img/video).
  // Cycle rule: a video advances when it ENDS; a photo advances after
  // `data-photo-interval` ms (default 10s). A lone video just loops like a GIF.
  // Width the frame is allowed to take at its fixed height, expressed as
  // aspect-ratio (w/h) clamps. Landscape ceiling ≈16:9 (matches the old frame);
  // portrait floor keeps very tall photos from becoming skinny slivers — those
  // instead crop a little off the top/bottom (object-fit: cover).
  const CAREER_AR_MIN = 0.72; //  tallest portrait before top/bottom crops
  const CAREER_AR_MAX = 1.78; //  widest landscape before sides crop

  function initCareerRotators() {
    document.querySelectorAll(".career-rotator").forEach(function (rotator) {
      const items = Array.prototype.slice.call(rotator.querySelectorAll(".career-rotator-item"));
      if (items.length === 0) return;

      const photoInterval = parseInt(rotator.getAttribute("data-photo-interval"), 10) || 10000;

      // Natural aspect ratio (w/h) of an item, or null if not measurable yet.
      function aspectOf(item) {
        if (item.tagName === "VIDEO") {
          return item.videoWidth && item.videoHeight ? item.videoWidth / item.videoHeight : null;
        }
        return item.naturalWidth && item.naturalHeight ? item.naturalWidth / item.naturalHeight : null;
      }

      // Resize the (fixed-height) frame's WIDTH to hug this slide's shape.
      let framePrimed = false;
      function fitFrame(item) {
        const ar = aspectOf(item);
        if (!ar) return;
        const h = rotator.clientHeight || 270;
        const clamped = Math.max(CAREER_AR_MIN, Math.min(CAREER_AR_MAX, ar));
        rotator.style.width = Math.round(h * clamped) + "px";
        // Suppress the width transition on the very first sizing (no load jump),
        // then hand animation back to the stylesheet for subsequent slides.
        if (!framePrimed) {
          framePrimed = true;
          window.requestAnimationFrame(function () {
            rotator.style.transition = "";
          });
        }
      }

      // Fit now if the media is measured, otherwise once it loads (if still shown).
      function fitWhenReady(item, isCurrent) {
        if (aspectOf(item)) {
          fitFrame(item);
          return;
        }
        const ev = item.tagName === "VIDEO" ? "loadedmetadata" : "load";
        item.addEventListener(
          ev,
          function () {
            if (isCurrent()) fitFrame(item);
          },
          { once: true }
        );
      }

      // Don't animate the first width set.
      rotator.style.transition = "none";

      // Single item: nothing to rotate — a lone video loops like an animated GIF.
      if (items.length === 1) {
        const only = items[0];
        only.classList.add("is-active");
        fitWhenReady(only, function () {
          return true;
        });
        if (only.tagName === "VIDEO") {
          only.loop = true;
          if (!prefersReducedMotion) only.play().catch(function () {});
        }
        return;
      }

      let current = 0;
      let advanceTimer = null; // used for photo dwell AND video safety net

      function clearTimer() {
        if (advanceTimer) {
          window.clearTimeout(advanceTimer);
          advanceTimer = null;
        }
      }

      function deactivate(item) {
        item.classList.remove("is-active");
        if (item.tagName === "VIDEO") {
          try {
            item.pause();
            item.currentTime = 0;
          } catch (e) {}
        }
      }

      function activate(item) {
        item.classList.add("is-active");
        fitWhenReady(item, function () {
          return items[current] === item;
        });
        if (item.tagName === "VIDEO") {
          try {
            item.currentTime = 0;
          } catch (e) {}
          const play = item.play();
          if (play && play.catch) {
            // Autoplay blocked (e.g. mobile data-saver): don't get stuck —
            // treat this slide like a photo and move on after the interval.
            play.catch(function () {
              clearTimer();
              advanceTimer = window.setTimeout(advance, photoInterval);
            });
          }
          // Safety net: if 'ended' never fires (background tab, decode stall),
          // advance a couple seconds past the clip's duration.
          function armSafety() {
            const secs = isFinite(item.duration) && item.duration > 0 ? item.duration + 2 : 20;
            clearTimer();
            advanceTimer = window.setTimeout(advance, secs * 1000);
          }
          if (isFinite(item.duration) && item.duration > 0) armSafety();
          else item.addEventListener("loadedmetadata", armSafety, { once: true });
        } else {
          // Photo: hold for photoInterval, then advance.
          clearTimer();
          advanceTimer = window.setTimeout(advance, photoInterval);
        }
      }

      function advance() {
        clearTimer();
        deactivate(items[current]);
        current = (current + 1) % items.length;
        activate(items[current]);
      }

      // A video advances the moment it finishes (if it's still the active slide).
      items.forEach(function (item) {
        if (item.tagName === "VIDEO") {
          item.loop = false;
          item.addEventListener("ended", function () {
            if (items[current] === item) advance();
          });
        }
      });

      if (prefersReducedMotion) {
        // Show the first slide statically; no auto-advance, no autoplay.
        items[0].classList.add("is-active");
        return;
      }

      // Pause the cycle while hovered, resume on leave.
      let hovered = false;
      rotator.addEventListener("mouseenter", function () {
        hovered = true;
        clearTimer();
        const cur = items[current];
        if (cur.tagName === "VIDEO") {
          try {
            cur.pause();
          } catch (e) {}
        }
      });
      rotator.addEventListener("mouseleave", function () {
        if (!hovered) return;
        hovered = false;
        const cur = items[current];
        if (cur.tagName === "VIDEO") {
          cur.play().catch(function () {});
        } else {
          advanceTimer = window.setTimeout(advance, photoInterval);
        }
      });

      // Make sure only the first slide is visible, then start.
      items.forEach(function (item, i) {
        if (i !== 0) item.classList.remove("is-active");
      });
      activate(items[current]);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initProfileRotator();
    initTimeline();
    initCareerRotators();
  });
})();
