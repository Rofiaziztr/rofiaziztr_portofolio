const smoothScrollLinks = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", targetId);
    });
  });
};

const setActiveNavLink = () => {
  const navLinks = document.querySelectorAll(".nav a");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(
          `.nav a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add("active");
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
};

const setYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

// moved to initAll() below

// Consolidated init function to improve startup order & avoid duplicate listeners
const initAll = async () => {
  smoothScrollLinks();
  setActiveNavLink();
  setYear();
  initRevealOnScroll();
  initProgressBar();
  initButtonRipples();

  await resolveBrokenAssets();
};

// Single DOMContentLoaded handler
document.addEventListener("DOMContentLoaded", () => {
  initAll();
});

// Reveal elements on scroll with IntersectionObserver
const initRevealOnScroll = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // WeakMap to store per-grid reveal queues
  const revealQueues = new WeakMap();
  // Configure timing for sequential reveal
  const REVEAL_PAUSE_MS = 150; // pause after each transition before showing next
  const REVEAL_FALLBACK_MS = 700; // fallback to ensure queue progresses if transitionend does not fire

  const processQueue = (grid) => {
    const state = revealQueues.get(grid);
    if (!state) return;
    if (state.processing) return;
    const next = state.queue.shift();
    if (!next) {
      state.processing = false;
      return;
    }
    state.processing = true;
    next.classList.add("is-visible");

    const onDone = () => {
      next.removeEventListener("transitionend", onDone);
      state.processing = false;
      // small pause between reveals to keep the effect visible
      setTimeout(() => processQueue(grid), REVEAL_PAUSE_MS);
    };

    // Listen for transition end on the element, or fall back after 700ms.
    next.addEventListener("transitionend", onDone, { once: true });
    setTimeout(onDone, REVEAL_FALLBACK_MS);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Respect reduced motion: immediately show visible elements
        if (reducedMotion) {
          el.classList.add("is-visible");
          return;
        }
        // For project cards, queue them per container to reveal sequentially
        if (el.classList.contains("project-card")) {
          const grid = el.closest('.projects__grid') || document;
          let state = revealQueues.get(grid);
          if (!state) {
            state = { queue: [], processing: false };
            revealQueues.set(grid, state);
          }
          // Avoid duplicates
          if (state.queue.indexOf(el) === -1 && !el.classList.contains('is-visible')) {
            state.queue.push(el);
            // sort queue to ensure DOM visual order (left-to-right/top-to-bottom)
            const cards = Array.from(grid.querySelectorAll('.project-card'));
            state.queue.sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
          }
          processQueue(grid);
          return;
        }
        // Non-project items reveal immediately as before
        el.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );

  // Observe relevant elements, deduplicating results
  const nodes = Array.from(document.querySelectorAll('.reveal, .skill-card, .project-card'));
  const unique = Array.from(new Set(nodes));
  unique.forEach((el) => observer.observe(el));
};

// Progress bar
const initProgressBar = () => {
  const progress = document.getElementById("progress");
  const update = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = `${percent}%`;
  };
  window.addEventListener(
    "scroll",
    () => {
      window.requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
};

// Button ripple
const initButtonRipples = () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
    });
  });
};

// moved to initAll() below

// moved to initAll() below

// System-level reduced motion is respected (no manual toggle in the UI)

// moved to initAll() below

// Resolve image assets across different server roots by trying potential paths
const resolveBrokenAssets = async () => {
  const imgs = Array.from(document.querySelectorAll("img[data-filename]"));
  const links = Array.from(
    document.querySelectorAll("a.project-card__media-link[data-filename]")
  );

  const tryLoad = (url, timeout = 3000) => {
    return new Promise((resolve) => {
      const img = new Image();
      let isResolved = false;
      const done = (val) => {
        if (isResolved) return;
        isResolved = true;
        resolve(val);
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = url;
      setTimeout(() => done(false), timeout);
    });
  };

  const candidates = (filename) => {
    const encoded = encodeURI(filename);
    const hyphenated = filename.replace(/\s+/g, "-");
    const underscored = filename.replace(/\s+/g, "_");
    const encodedHyphen = encodeURI(hyphenated);
    const encodedUnderscore = encodeURI(underscored);
    return [
      // Referencing the public folder from possible roots
      `../public/assets/${filename}`,
      `../public/assets/${encoded}`,
      `../public/assets/${hyphenated}`,
      `../public/assets/${underscored}`,
      `/public/assets/${filename}`,
      `/public/assets/${encoded}`,
      `/public/assets/${hyphenated}`,
      `/public/assets/${underscored}`,
      `/assets/${filename}`,
      `/assets/${encoded}`,
      `/assets/${hyphenated}`,
      `/assets/${underscored}`,
      `assets/${filename}`,
      `assets/${encoded}`,
      `assets/${hyphenated}`,
      `assets/${underscored}`,
      `src/assets/${filename}`,
      `src/assets/${encoded}`,
      `src/assets/${hyphenated}`,
      `src/assets/${underscored}`,
      `./assets/${filename}`,
      `./assets/${encoded}`,
      `./public/assets/${encodedHyphen}`,
      `./public/assets/${encodedUnderscore}`,
      `/public/assets/${encodedHyphen}`,
      `/public/assets/${encodedUnderscore}`,
      `/assets/${encodedHyphen}`,
      `/assets/${encodedUnderscore}`,
      `assets/${encodedHyphen}`,
      `assets/${encodedUnderscore}`,
      `src/assets/${encodedHyphen}`,
      `src/assets/${encodedUnderscore}`,
      `./assets/${encodedHyphen}`,
      `./assets/${encodedUnderscore}`,
    ];
  };

  // Run all image checks in parallel (non-blocking) to speed up the resolution process
  await Promise.all(
    imgs.map(async (el) => {
      const filename = el.getAttribute("data-filename");
      const original = el.getAttribute("src");
      const list = (original ? [original] : []).concat(
        candidates(filename).filter(Boolean)
      );
      console.info(
        "resolveBrokenAssets: checking",
        filename,
        "candidates count:",
        list.length
      );
      for (const c of list) {
        // skip if same as current src
        if (!c || c === el.src) continue;
        const ok = await tryLoad(c);
        if (ok) {
          // attach load handler to fade in image
          el.onload = () => {
            el.classList.add("is-loaded");
            el.classList.remove("is-fallback");
          };
          // if the image is already cached and complete, call handler
          el.src = c;
          console.info("resolveBrokenAssets: using", c, "for", filename);
          if (el.complete) {
            el.onload();
          }
          break;
        }
      }
      // If no path was found, mark fallback to visually indicate
      if (!el.classList.contains("is-loaded")) {
        el.classList.add("is-fallback");
        console.warn(
          "resolveBrokenAssets: no valid path found for",
          filename,
          "- current src:",
          el.src
        );
      }
    })
  );

  // Resolve anchors similarly
  await Promise.all(
    links.map(async (a) => {
      const filename = a.getAttribute("data-filename");
      const originalHref = a.getAttribute("href");
      const list = (originalHref ? [originalHref] : []).concat(
        candidates(filename).filter(Boolean)
      );
      console.info(
        "resolveBrokenAssets: link checking",
        filename,
        "candidates count:",
        list.length
      );
      for (const c of list) {
        if (!c) continue;
        const ok = await tryLoad(c);
        if (ok) {
          a.setAttribute("href", c);
          console.info("resolveBrokenAssets: link set to", c, "for", filename);
          break;
        }
      }
      // If link still doesn't exist, console warn for troubleshooting
      const href = a.getAttribute("href");
      if (!href || href.indexOf(filename) === -1) {
        console.warn(
          "resolveBrokenAssets: link may not resolve for",
          filename,
          "- href now:",
          href
        );
      }
    })
  );
};

// moved to initAll() below

// moved to initAll() below
