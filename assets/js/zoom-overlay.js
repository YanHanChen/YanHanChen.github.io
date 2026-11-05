// Copied from al-img-tools PR #17 (commit c2b22d0), not yet in a release:
// https://github.com/al-org-dev/al-img-tools/pull/17
// Remove this file, _includes/plugins/al_img_tools_scripts.liquid, and restore
// enable_medium_zoom: true once an al_img_tools release includes the fix.
//
// Click-to-zoom for [data-zoomable] images.
//
// Why not medium-zoom's transform scaling: medium-zoom enlarges the thumbnail
// <img> with `transform: scale()` on a composited layer (translate3d +
// will-change). WebKit/Safari rasterizes a composited layer at its *layout*
// size (e.g. 125px) and GPU-stretches that bitmap to the zoomed size (~1440px),
// so the zoom is blurry no matter how high-res the source file is. (Chrome
// re-rasters the scaled layer, which is why it looked fine there.)
//
// Instead we render the full-resolution image at real size in a fixed overlay
// (object-fit: contain, width/height driven by layout, no transform scaling),
// so every browser decodes and paints it at full resolution => sharp.
document.addEventListener("DOMContentLoaded", () => {
  const zoomables = document.querySelectorAll("[data-zoomable]");
  if (!zoomables.length) {
    return;
  }

  // Append alpha to the theme background color to keep content visible under zoom.
  const bg = `${getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim()}f2`;

  let overlay = null;

  const onKey = (e) => {
    if (e.key === "Escape") {
      close();
    }
  };

  const close = () => {
    if (!overlay) {
      return;
    }
    const el = overlay;
    overlay = null;
    document.removeEventListener("keyup", onKey);
    el.style.opacity = "0";
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    // Safety net if transitionend doesn't fire.
    setTimeout(() => el.remove(), 400);
  };

  const open = (src, alt) => {
    close();
    overlay = document.createElement("div");
    overlay.className = "al-zoom-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg,
      cursor: "zoom-out",
      padding: "2.5vmin",
      opacity: "0",
      transition: "opacity .2s ease",
    });

    const big = document.createElement("img");
    big.src = src;
    big.alt = alt || "";
    Object.assign(big.style, {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "auto",
      height: "auto",
      objectFit: "contain",
      cursor: "zoom-out",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.35)",
    });

    overlay.appendChild(big);
    overlay.addEventListener("click", close);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      if (overlay) {
        overlay.style.opacity = "1";
      }
    });
    document.addEventListener("keyup", onKey);
  };

  zoomables.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      e.preventDefault();
      // Prefer an explicit high-res source if provided, else the displayed one.
      open(img.getAttribute("data-zoom-src") || img.currentSrc || img.src, img.alt);
    });
  });
});
