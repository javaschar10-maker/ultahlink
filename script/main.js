/**
 * Engine — reads CONFIG + ?nama= profile, loads components, renders & animates.
 * Customization via config.js only.
 */

// ── Theme ────────────────────────────────────────────────────────
let currentMode = (CONFIG.defaultMode || "dark");

function applyTheme(mode) {
  currentMode = mode;
  const root = document.documentElement;
  const c = CONFIG.colors;

  root.style.setProperty("--primary", c.primary || "#ff69b4");
  root.style.setProperty("--accent", c.accent || "#15a1ed");

  const theme = c[mode] || c.dark || {};
  root.style.setProperty("--bg", theme.background || "#1a1a2e");
  root.style.setProperty("--text", theme.text || "#ffffff");

  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = mode === "dark" ? "☀️" : "🌙";
}

function createThemeToggle() {
  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.title = "Toggle dark/light mode";
  btn.textContent = currentMode === "dark" ? "☀️" : "🌙";
  btn.addEventListener("click", () => {
    applyTheme(currentMode === "dark" ? "light" : "dark");
  });
  document.body.appendChild(btn);
}

// ── Music toggle ─────────────────────────────────────────────────
// Exposed as window.UltahLink.music so components (e.g. cake mic mode)
// can pause music during mic use and restore it afterwards.
function createMusicToggle(audio) {
  const btn = document.createElement("button");
  btn.id = "music-toggle";
  btn.title = "Putar / hentikan musik";
  btn.textContent = "🎵";

  window.UltahLink = window.UltahLink || {};
  window.UltahLink.music = {
    wasPlaying: false,
    pause() {
      this.wasPlaying = !audio.paused;
      if (this.wasPlaying) {
        audio.pause();
        btn.textContent = "🎵";
      }
    },
    resume() {
      if (this.wasPlaying && audio.paused) {
        audio.play().then(() => { btn.textContent = "🔊"; }).catch(() => { });
      }
    },
  };

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => { btn.textContent = "🔊"; }).catch(() => { });
    } else {
      audio.pause();
      btn.textContent = "🎵";
    }
  });
  document.body.appendChild(btn);
}

// ── Profile from URL ─────────────────────────────────────────────
function getProfile() {
  const q = new URLSearchParams(location.search).get("nama");
  const username = (q || "").trim().toUpperCase();
  const profiles = CONFIG.profiles || [];
  return profiles.find((p) => p.username === username) || profiles[0] || null;
}

// ── Script Loader ────────────────────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Component not found: " + src));
    document.head.appendChild(s);
  });
}

// ── Main ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const profile = getProfile();
  const container = document.querySelector(".container");
  if (!profile) {
    container.innerHTML = "<p style='padding:2rem;font-weight:300;'>Belum ada profil. Tambahkan di config.js 🎂</p>";
    container.style.visibility = "visible";
    return;
  }

  // Effective config: defaults + profile overrides (name, photo, music, sections)
  const cfg = { ...CONFIG, ...profile };

  applyTheme(currentMode);
  createThemeToggle();
  document.title = `HBD, ${cfg.name}! 🎂`;

  // Music — falls back to the default song if the profile's own file
  // is missing or unplayable (e.g. MPEG video renamed to .mp3).
  const audio = document.querySelector(".song");
  if (audio && cfg.music) {
    const src = audio.querySelector("source");
    src.src = cfg.music;
    let triedFallback = false;
    audio.addEventListener("error", () => {
      if (!triedFallback && CONFIG.music) {
        triedFallback = true;
        src.src = CONFIG.music;
        audio.load();
      }
    });
    audio.load();
    createMusicToggle(audio);
  }

  // Load component scripts (unique types only)
  const types = [...new Set(cfg.sections.map((s) => s.type))];
  for (const type of types) {
    try {
      await loadScript(`./script/components/${type}.js`);
    } catch (e) {
      console.warn(e.message);
    }
  }

  // Render all sections
  const rendered = [];
  cfg.sections.forEach((section) => {
    const comp = window.Components && window.Components[section.type];
    if (!comp) {
      console.warn(`Component "${section.type}" not found, skipping.`);
      return;
    }
    const el = comp.render(container, section, cfg);
    rendered.push({ el, comp, section });
  });

  buildTimeline(rendered);
});

// ── Timeline Builder ─────────────────────────────────────────────
function buildTimeline(rendered) {
  const tl = gsap.timeline();

  tl.to(".container", { duration: 0.6, visibility: "visible" });

  // Track deferred exits for overlay components
  let deferredExits = [];

  rendered.forEach(({ el, comp, section }, i) => {
    const isOverlay = comp.overlay === true;

    // Flush deferred exits before non-overlay sections
    if (!isOverlay && deferredExits.length > 0) {
      deferredExits.forEach((fn) => fn());
      deferredExits = [];
    }

    // Animate
    comp.animate(tl, el, CONFIG);

    // Handle exit lifecycle
    if (comp.exit) {
      const next = rendered[i + 1];
      const nextIsOverlay = next && next.comp.overlay === true;

      if (nextIsOverlay) {
        deferredExits.push(() => comp.exit(tl, el));
      } else if (!isOverlay) {
        comp.exit(tl, el);
      }
    }
  });

  // Flush remaining
  deferredExits.forEach((fn) => fn());

  // Setup replay
  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => tl.restart());
  }
}
