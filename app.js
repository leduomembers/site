(() => {
  "use strict";
  const C = window.SITE_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
    del(k) { try { sessionStorage.removeItem(k); } catch {} },
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  $$("[data-site-name]").forEach((el) => (el.textContent = C.siteName));
  document.title = C.siteName;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Données ---------- */
  function ytId(url) {
    if (!url) return "";
    if (/^[\w-]{11}$/.test(url)) return url;
    const m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  const thumb = (id, q = "hqdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const prep = (list, group) => (list || []).map((v, i) => ({ ...v, id: ytId(v.url), group, key: `${group}-${i}` }));

  const home = C.home;
  const HOME = prep([home.featured, ...home.videos], "home");
  const BTS = prep(C.behindTheScenes, "bts");
  const UPCOMING = prep(C.upcoming, "up")
    .map((v) => ({ ...v, when: v.date ? new Date(v.date + "T00:00:00") : null }))
    .sort((a, b) => (a.when || 0) - (b.when || 0));
  // Séries : chaque série est une playlist, chaque épisode connaît sa série et sa position
  // showSeries: false → la page Séries est entièrement masquée (le code et les données restent prêts)
  const SERIES_ON = C.showSeries === true;
  if (!SERIES_ON) {
    $$('[data-go="series"], [data-page="series"]').forEach((el) => el.remove());
  }
  const SERIES = (SERIES_ON ? C.series || [] : []).map((s, si) => ({
    ...s, si,
    episodes: (s.episodes || []).map((e, ei) => ({
      ...e, id: ytId(e.url), group: "sr", key: `sr-${si}-${ei}`, si, ei,
      tag: `Ép. ${ei + 1}`, category: s.title,
    })),
  })).filter((s) => s.episodes.length);
  const EPISODES = SERIES.flatMap((s) => s.episodes);
  const ALL = [...HOME, ...BTS, ...EPISODES, ...UPCOMING];
  const byKey = (k) => ALL.find((v) => v.key === k);
  const countLabel = (n) => `${n} vidéo${n > 1 ? "s" : ""}`;

  const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const fmtDate = (d) => d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
  const isOut = (v) => v.when && v.when <= new Date();

  // Image d'un élément : miniature YouTube, sinon "image", sinon visuel généré
  function mediaImg(v, q = "hqdefault", cls = "") {
    if (v.id) {
      // maxresdefault n'existe pas toujours : YouTube renvoie alors une erreur ou une image grise de 120 px
      const fb = q !== "hqdefault"
        ? ` onerror="this.onerror=null;this.src='${thumb(v.id)}'" onload="if(this.naturalWidth<=120&&!this.dataset.fb){this.dataset.fb=1;this.src='${thumb(v.id)}'}"`
        : "";
      return `<img class="${cls}" src="${thumb(v.id, q)}"${fb} alt="" loading="lazy" />`;
    }
    if (v.image) return `<img class="${cls}" src="${esc(v.image)}" alt="" loading="lazy" />`;
    return `<span class="ph ${cls}" aria-hidden="true"><span>${esc(v.title)}</span></span>`;
  }

  const metaLine = (v) => {
    const parts = [v.tag && `<span class="badge">${esc(v.tag)}</span>`];
    if (v.group === "up") parts.push(isOut(v) ? "Disponible" : `Sortie le ${fmtDate(v.when)}`);
    else if (v.group === "srs") parts.push(countLabel(v.count));
    else parts.push(v.category && esc(v.category), v.year && esc(v.year), v.duration && esc(v.duration), `<span class="hd">HD</span>`);
    return parts.filter(Boolean).join(`<i class="dot"></i>`);
  };

  const ICON = {
    play: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5Z"/></svg>`,
    info: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M11 10.5h2V17h-2zM11 7h2v2h-2z"/></svg>`,
    chev: `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/></svg>`,
    down: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>`,
    list: `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M4 6h11M4 12h11M4 18h7M17 15v6l4-3z"/></svg>`,
    next: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M5 4.8v14.4a.8.8 0 0 0 1.2.7L16 13.6V19a1 1 0 0 0 2 0V5a1 1 0 0 0-2 0v5.4L6.2 4.1A.8.8 0 0 0 5 4.8Z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a2 2 0 0 0 3.4 0"/></svg>`,
  };

  /* ---------- Gabarits ---------- */
  function countdownHTML(v, big = false) {
    if (!v.when) return "";
    if (isOut(v)) return `<p class="cd-out">Disponible maintenant</p>`;
    const cell = (u, l) => `<span><b data-u="${u}">00</b><small>${l}</small></span>`;
    return `<div class="countdown${big ? " countdown-big" : ""}" data-countdown="${v.when.toISOString()}">
      ${cell("d", "jours")}${cell("h", "heures")}${cell("m", "min")}${big ? cell("s", "sec") : ""}</div>`;
  }
  function actionsHTML(v, { info = true } = {}) {
    const a = [];
    if (v.id) a.push(`<button class="btn btn-light" data-play="${v.key}">${ICON.play}<span>${v.group === "up" ? "Bande-annonce" : "Lecture"}</span></button>`);
    if (v.group === "up" && !isOut(v)) a.push(`<button class="btn btn-ghost" data-remind="${v.key}">${ICON.bell}<span>Me le rappeler</span></button>`);
    if (info) a.push(`<button class="btn btn-ghost" data-info="${v.key}">${ICON.info}<span>Plus d'infos</span></button>`);
    return a.join("");
  }
  function heroHTML(v, label) {
    if (!v) return "";
    return `
    <div class="hero" data-hero="${v.id}">
      <div class="hero-media">${mediaImg(v, "maxresdefault", "hero-poster")}<div class="hero-video"></div></div>
      <div class="hero-shade"></div>
      <div class="hero-content">
        ${label ? `<p class="kicker">${esc(label)}</p>` : ""}
        <h1 class="hero-title">${esc(v.title)}</h1>
        <p class="meta">${metaLine(v)}</p>
        ${v.group === "up" ? countdownHTML(v, true) : ""}
        ${v.description ? `<p class="hero-desc">${esc(v.description)}</p>` : ""}
        <div class="hero-actions">${actionsHTML(v, { info: v.group !== "up" })}</div>
      </div>
    </div>`;
  }
  function cardHTML(v, i) {
    const tag = v.group === "up" ? (v.when ? `${v.when.getDate()} ${MONTHS[v.when.getMonth()]}` : v.tag) : v.tag || v.category;
    const sub = v.group === "up" ? [v.tag] : [v.category && v.tag ? v.category : null, v.year, v.duration];
    return `
    <article class="card" style="--i:${i}" data-cat="${esc(v.category || "")}">
      <button class="card-media" data-info="${v.key}" aria-label="${esc(v.title)} — plus d'infos">
        ${mediaImg(v)}
        ${tag ? `<span class="card-tag">${esc(tag)}</span>` : ""}
        <span class="card-title-over">${esc(v.title)}</span>
      </button>
      <div class="card-info">
        <div class="card-actions">
          ${v.id ? `<button class="round round-light" data-play="${v.key}" aria-label="Lire ${esc(v.title)}">${ICON.play}</button>` : ""}
          ${v.group === "up" && !isOut(v) ? `<button class="round" data-remind="${v.key}" aria-label="Me le rappeler">${ICON.bell}</button>` : ""}
          <button class="round" data-info="${v.key}" aria-label="Plus d'infos">${ICON.down}</button>
        </div>
        <p class="card-name">${esc(v.title)}</p>
        <p class="meta meta-sm">${sub.filter(Boolean).map(esc).join(`<i class="dot"></i>`)}</p>
      </div>
    </article>`;
  }
  function rowHTML(title, items, opts = {}) {
    if (!items.length) return "";
    const link = opts.link ? `<a class="row-link" href="#${opts.link}" data-go="${opts.link}">Tout voir ${ICON.chev}</a>` : "";
    return `
    <section class="row${opts.grid ? " row-grid" : ""}${opts.overlap ? " row-overlap" : ""}">
      <div class="row-head"><h2>${esc(title)}</h2>${link}${opts.extra || ""}</div>
      <div class="rail-wrap">
        ${opts.grid ? "" : `<button class="rail-arrow prev" aria-label="Précédent">${ICON.chev}</button>`}
        <div class="rail"${opts.railId ? ` id="${opts.railId}"` : ""}>${items.map(cardHTML).join("")}</div>
        ${opts.grid ? "" : `<button class="rail-arrow next" aria-label="Suivant">${ICON.chev}</button>`}
      </div>
    </section>`;
  }

  function upcomingItemHTML(v, i) {
    const d = v.when;
    return `
    <article class="up-item" style="--i:${i}">
      <div class="up-date" aria-hidden="true">
        ${d ? `<b>${d.getDate()}</b><span>${MONTHS[d.getMonth()]}</span><small>${d.getFullYear()}</small>` : "<b>?</b>"}
      </div>
      <div class="up-card">
        <button class="up-media" data-${v.id ? "play" : "info"}="${v.key}" aria-label="${esc(v.title)}">
          ${mediaImg(v, "maxresdefault")}
          ${v.id ? `<span class="up-play">${ICON.play}</span>` : ""}
        </button>
        <div class="up-body">
          <p class="meta">${metaLine(v)}</p>
          <h3>${esc(v.title)}</h3>
          ${v.description ? `<p class="up-desc">${esc(v.description)}</p>` : ""}
          ${countdownHTML(v)}
          <div class="up-actions">${actionsHTML(v, { info: false })}</div>
        </div>
      </div>
    </article>`;
  }

  function seriesTileHTML(s, i) {
    const eps = s.episodes;
    const layers = [eps[2], eps[1], eps[0]].filter(Boolean);
    return `
    <button class="series-tile" data-series="${s.si}" style="--i:${i}" aria-label="${esc(s.title)}, ${countLabel(eps.length)}">
      <span class="st-stack">
        ${layers.map((e, li) => `<span class="st-layer st-l${layers.length - 1 - li}">${mediaImg(e)}</span>`).join("")}
        <span class="st-count">${ICON.list}${countLabel(eps.length)}</span>
        <span class="st-play">${ICON.play}</span>
      </span>
      <span class="st-body"><b>${esc(s.title)}</b>${s.description ? `<small>${esc(s.description)}</small>` : ""}</span>
    </button>`;
  }

  function buildPages() {
    // Accueil
    $('[data-page="home"]').innerHTML =
      heroHTML(HOME[0], "À l'affiche") +
      `<div class="rows">` +
      rowHTML(home.rowTitle || "À la une", HOME.slice(1), { overlap: true, grid: true }) +
      rowHTML("Dans les coulisses", BTS, { link: "coulisses" }) +
      (SERIES.length ? `<section class="row"><div class="row-head"><h2>Nos séries</h2><a class="row-link" href="#series" data-go="series">Tout voir ${ICON.chev}</a></div>
        <div class="series-grid">${SERIES.map(seriesTileHTML).join("")}</div></section>` : "") +
      rowHTML("Prochainement", UPCOMING.filter((v) => !isOut(v)), { link: "a-venir" }) +
      `</div>`;

    // Coulisses
    const cats = [...new Set(BTS.map((v) => v.category).filter(Boolean))];
    const chips = cats.length > 1
      ? `<div class="chips" role="tablist" aria-label="Filtrer par catégorie">${["Tout", ...cats].map((c, i) =>
          `<button class="chip-f${i ? "" : " on"}" role="tab" aria-selected="${!i}" data-filter="${i ? esc(c) : ""}">${esc(c)}</button>`).join("")}</div>`
      : "";
    $('[data-page="coulisses"]').innerHTML =
      heroHTML(BTS[0], "Coulisses") +
      `<div class="rows">` +
      rowHTML("Toutes les coulisses", BTS, { grid: true, overlap: true, extra: chips, railId: "btsGrid" }) +
      `</div>`;

    // Séries
    const lead = SERIES[0];
    if (SERIES_ON) $('[data-page="series"]').innerHTML = !lead ? `<p class="empty page-empty">Aucune série pour le moment.</p>` :
      heroHTML({ ...lead.episodes[0], title: lead.title, description: lead.description, group: "srs", tag: "Série", count: lead.episodes.length }, "Série à la une") +
      `<div class="rows">
        <section class="row row-overlap">
          <div class="row-head"><h2>Toutes les séries</h2></div>
          <div class="series-grid">${SERIES.map(seriesTileHTML).join("")}</div>
        </section>` +
      SERIES.map((s) => rowHTML(s.title, s.episodes, {
        extra: `<button class="row-link" data-series="${s.si}">Voir la série · ${countLabel(s.episodes.length)} ${ICON.chev}</button>`,
      })).join("") +
      `</div>`;

    // À venir
    const next = UPCOMING.find((v) => !isOut(v)) || UPCOMING[0];
    $('[data-page="a-venir"]').innerHTML =
      heroHTML(next, "Prochaine sortie") +
      `<div class="rows"><section class="row up-section">
        <div class="row-head"><h2>Calendrier des sorties</h2></div>
        <div class="up-list">${UPCOMING.map(upcomingItemHTML).join("") || `<p class="empty">Aucune sortie annoncée pour le moment.</p>`}</div>
      </section></div>`;

    $$(".rail-wrap").forEach(initRail);
    tickCountdowns();
  }

  // Filtres des coulisses
  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filter]");
    if (!f) return;
    const val = f.dataset.filter;
    $$("[data-filter]").forEach((b) => { b.classList.toggle("on", b === f); b.setAttribute("aria-selected", String(b === f)); });
    $$("#btsGrid .card").forEach((c) => { c.hidden = !!val && c.dataset.cat !== val; });
  });

  function initRail(wrap) {
    const rail = $(".rail", wrap), prev = $(".prev", wrap), next = $(".next", wrap);
    if (!prev) return;
    const update = () => {
      prev.classList.toggle("hide", rail.scrollLeft < 8);
      next.classList.toggle("hide", rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
    };
    prev.onclick = () => rail.scrollBy({ left: -rail.clientWidth * 0.85, behavior: "smooth" });
    next.onclick = () => rail.scrollBy({ left: rail.clientWidth * 0.85, behavior: "smooth" });
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Comptes à rebours ---------- */
  function tickCountdowns() {
    const now = Date.now();
    $$("[data-countdown]").forEach((el) => {
      let s = Math.max(0, Math.floor((new Date(el.dataset.countdown) - now) / 1000));
      const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
      $$("[data-u]", el).forEach((b) => (b.textContent = String(v[b.dataset.u]).padStart(2, "0")));
    });
  }
  setInterval(tickCountdowns, 1000);

  /* ---------- Rappel (.ics pour l'agenda) ---------- */
  function remind(v) {
    if (!v || !v.when) return;
    const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const end = new Date(v.when); end.setDate(end.getDate() + 1);
    const clean = (s) => String(s || "").replace(/[\\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${C.siteName}//FR`, "BEGIN:VEVENT",
      `UID:${v.key}-${ymd(v.when)}@${C.siteName.toLowerCase()}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;VALUE=DATE:${ymd(v.when)}`, `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${clean(`Sortie : ${v.title} (${C.siteName})`)}`, `DESCRIPTION:${clean(v.description)}`,
      "BEGIN:VALARM", "TRIGGER:-PT0M", "ACTION:DISPLAY", `DESCRIPTION:${clean(v.title)} sort aujourd'hui`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${v.title.replace(/[^\w\- ]+/g, "").trim() || "sortie"}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(`Rappel ajouté : « ${v.title} » le ${fmtDate(v.when)}`);
  }
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 3200);
  }

  /* ---------- Vidéo d'arrière-plan (hero) ---------- */
  const ytReady = new Promise((resolve) => {
    if (window.YT && YT.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev && prev(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  let heroPlayer = null, heroToken = 0, heroWatch = null;
  // Au démarrage, YouTube affiche quelques secondes ses boutons (précédent / pause / suivant)
  // même avec controls=0. On garde donc l'affiche par-dessus tant que la vidéo n'a pas joué
  // HERO_REVEAL secondes, puis on fait apparaître la vidéo en fondu une fois l'interface disparue.
  const HERO_REVEAL = 3.5;
  function stopHero() {
    heroToken++;
    clearInterval(heroWatch);
    if (heroPlayer) { try { heroPlayer.destroy(); } catch {} heroPlayer = null; }
    $$(".hero-video").forEach((el) => { el.innerHTML = ""; el.classList.remove("on"); });
  }
  function startHero(page) {
    stopHero();
    const hero = $(`.page[data-page="${page}"] .hero`);
    if (!hero || !hero.dataset.hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = hero.dataset.hero, box = $(".hero-video", hero), token = heroToken;
    ytReady.then(() => {
      if (token !== heroToken) return;
      box.innerHTML = "<div></div>";
      heroPlayer = new YT.Player(box.firstChild, {
        host: "https://www.youtube-nocookie.com",
        videoId: id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (e) => {
            const p = e.target;
            p.mute(); p.playVideo();
            let played = 0, last = 0;
            heroWatch = setInterval(() => {
              if (token !== heroToken) return clearInterval(heroWatch);
              const st = p.getPlayerState && p.getPlayerState();
              const t = p.getCurrentTime ? p.getCurrentTime() : 0;
              const d = p.getDuration ? p.getDuration() : 0;
              if (st !== YT.PlayerState.PLAYING) { box.classList.remove("on"); played = 0; last = t; return; }
              if (t >= last) played += t - last;
              last = t;
              if (played >= HERO_REVEAL) box.classList.add("on");
              if (d && t > d - 1.2) { box.classList.remove("on"); played = 0; last = 0; p.seekTo(0, true); }
            }, 250);
          },
        },
      });
      const f = heroPlayer.getIframe && heroPlayer.getIframe();
      if (f) { f.tabIndex = -1; f.title = ""; }
    });
  }

  /* ---------- Écran d'accès ---------- */
  const CODE = String(C.accessCode);
  const input = $("#codeInput"), boxes = $("#pinBoxes"), status = $("#gateStatus");
  input.maxLength = CODE.length;
  boxes.innerHTML = [...CODE].map(() => `<span></span>`).join("");
  $("#gateBg").innerHTML = ALL.filter((v) => v.id).slice(0, 18).map((v) => `<img src="${thumb(v.id)}" alt="">`).join("");
  let busy = false, fails = 0;

  function renderPin() {
    const n = input.value.length;
    $$("span", boxes).forEach((b, i) => {
      b.classList.toggle("filled", i < n);
      b.classList.toggle("cur", i === n && document.activeElement === input);
    });
  }
  input.addEventListener("input", () => {
    if (busy) { input.value = ""; return; }
    input.value = input.value.replace(/\D/g, "").slice(0, CODE.length);
    renderPin();
    if (input.value.length === CODE.length) setTimeout(checkCode, 150);
  });
  input.addEventListener("focus", renderPin);
  input.addEventListener("blur", renderPin);
  $("#gate").addEventListener("click", () => input.focus());

  function checkCode() {
    busy = true;
    const gate = $("#gate");
    if (input.value === CODE) {
      gate.classList.add("ok");
      status.textContent = "Bienvenue.";
      store.set("nx-auth", "1");
      setTimeout(openApp, 650);
    } else {
      fails++;
      gate.classList.add("err");
      status.textContent = fails >= 3 ? `Code incorrect. Patiente ${fails} secondes.` : "Code incorrect. Réessaie.";
      setTimeout(() => {
        gate.classList.remove("err");
        input.value = ""; renderPin(); busy = false; input.focus();
        if (fails < 3) status.textContent = "Saisis ton code pour accéder au catalogue.";
      }, fails >= 3 ? fails * 1000 : 650);
    }
  }

  /* ---------- Application ---------- */
  const PAGES = ["home", "coulisses", ...(SERIES_ON ? ["series"] : []), "a-venir"];
  let current = null, built = false;

  function openApp() {
    $("#gate").hidden = true;
    $("#app").hidden = false;
    if (!built) { buildPages(); built = true; }
    current = null;
    go(location.hash.slice(1) || "home");
  }
  function lock() {
    store.del("nx-auth");
    closeAll();
    stopHero();
    current = null;
    $("#app").hidden = true;
    const g = $("#gate"); g.hidden = false; g.classList.remove("ok");
    input.value = ""; busy = false; fails = 0; renderPin();
    status.textContent = "Session verrouillée. Saisis ton code pour revenir.";
    setTimeout(() => input.focus(), 50);
  }
  $("#lockBtn").addEventListener("click", lock);

  function go(page) {
    if (!PAGES.includes(page)) page = "home";
    closeMenu();
    if (page === current) return window.scrollTo({ top: 0, behavior: "smooth" });
    current = page;
    $$(".page").forEach((p) => p.classList.toggle("active", p.dataset.page === page));
    $$(".nav-links [data-go]").forEach((a) => a.classList.toggle("active", a.dataset.go === page));
    if (location.hash.slice(1) !== page) history.replaceState(null, "", "#" + page);
    window.scrollTo(0, 0);
    onScroll();
    startHero(page);
  }
  window.addEventListener("hashchange", () => !$("#app").hidden && go(location.hash.slice(1)));

  /* ---------- Délégation des clics ---------- */
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) { e.preventDefault(); closeAll(); go(g.dataset.go); return; }
    const p = e.target.closest("[data-play]");
    if (p) { e.preventDefault(); play(byKey(p.dataset.play)); return; }
    const sr = e.target.closest("[data-series]");
    if (sr) { e.preventDefault(); openSeries(+sr.dataset.series); return; }
    const r = e.target.closest("[data-remind]");
    if (r) { e.preventDefault(); remind(byKey(r.dataset.remind)); return; }
    const i = e.target.closest("[data-info]");
    if (i) { e.preventDefault(); openModal(byKey(i.dataset.info)); return; }
  });

  /* ---------- Barre de navigation ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });

  const menu = $("#profileMenu"), profileBtn = $("#profileBtn");
  function closeMenu() { menu.hidden = true; profileBtn.setAttribute("aria-expanded", "false"); }
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    profileBtn.setAttribute("aria-expanded", String(!menu.hidden));
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".profile")) closeMenu(); });

  /* ---------- Fiche vidéo ---------- */
  const modal = $("#modal");
  const GROUP = { home: HOME, bts: BTS, up: UPCOMING };
  const MORE = { home: "Plus de vidéos", bts: "Autres coulisses", up: "Autres sorties à venir" };
  function showModal() {
    tickCountdowns();
    modal.hidden = false;
    modal.scrollTop = 0;
    document.body.classList.add("noscroll");
    $("#modalClose").focus({ preventScroll: true });
  }
  // Fiche d'une série : liste des épisodes façon playlist
  function openSeries(si) {
    const s = SERIES.find((x) => x.si === si);
    if (!s) return;
    const first = s.episodes[0];
    $("#modalMedia").innerHTML = `
      ${mediaImg(first, "maxresdefault")}
      <div class="modal-media-shade"></div>
      <div class="modal-media-content">
        <p class="kicker">Série</p>
        <h2 class="modal-hero-title">${esc(s.title)}</h2>
        <div class="hero-actions"><button class="btn btn-light" data-play="${first.key}">${ICON.play}<span>Lire l'épisode 1</span></button></div>
      </div>`;
    $("#modalTitle").textContent = s.title;
    $("#modalMeta").innerHTML = [`<span class="badge">Série</span>`, countLabel(s.episodes.length)].join(`<i class="dot"></i>`);
    $("#modalDesc").textContent = s.description || "";
    $("#modalMore").textContent = "Épisodes";
    const list = $("#modalList");
    list.classList.add("eps");
    list.innerHTML = s.episodes.map((e) => `
      <button class="ep" data-play="${e.key}">
        <span class="ep-n">${e.ei + 1}</span>
        <span class="ep-img">${mediaImg(e)}<span class="mini-play">${ICON.play}</span></span>
        <span class="ep-txt"><span class="ep-head"><b>${esc(e.title)}</b>${e.duration ? `<small>${esc(e.duration)}</small>` : ""}</span>
        ${e.description ? `<em>${esc(e.description)}</em>` : ""}</span>
      </button>`).join("");
    $(".modal-more").hidden = false;
    showModal();
  }
  function openModal(v) {
    if (!v) return;
    if (v.group === "sr") return openSeries(v.si);
    $("#modalList").classList.remove("eps");
    const list = GROUP[v.group].filter((x) => x !== v);
    $("#modalMedia").innerHTML = `
      ${mediaImg(v, "maxresdefault")}
      <div class="modal-media-shade"></div>
      <div class="modal-media-content">
        <h2 class="modal-hero-title">${esc(v.title)}</h2>
        <div class="hero-actions">${actionsHTML(v, { info: false })}</div>
      </div>`;
    $("#modalTitle").textContent = v.title;
    $("#modalMeta").innerHTML = metaLine(v) + (v.group === "up" ? countdownHTML(v) : "");
    $("#modalDesc").textContent = v.description || "";
    $("#modalMore").textContent = MORE[v.group];
    $("#modalList").innerHTML = list.map((x) => `
      <button class="mini" data-info="${x.key}">
        <span class="mini-img">${mediaImg(x)}${x.id ? `<span class="mini-play">${ICON.play}</span>` : ""}</span>
        <span class="mini-txt"><b>${esc(x.title)}</b>
        <small>${esc(x.group === "up" ? (x.when ? fmtDate(x.when) : "") : [x.category, x.year, x.duration].filter(Boolean).join(" · "))}</small>
        ${x.description ? `<em>${esc(x.description)}</em>` : ""}</span>
      </button>`).join("");
    $(".modal-more").hidden = !list.length;
    showModal();
  }
  function closeModal() { modal.hidden = true; if ($("#playerFull").hidden && $("#search").hidden) document.body.classList.remove("noscroll"); }
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Lecteur plein écran ---------- */
  function play(v) {
    if (!v || !v.id) return;
    $("#playerFrame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    $("#playerTitle").textContent = v.group === "sr" ? `${SERIES.find((x) => x.si === v.si).title} · Ép. ${v.ei + 1} — ${v.title}` : v.title;
    // Épisode suivant (lecture en mode playlist)
    const nextEp = v.group === "sr" ? SERIES.find((x) => x.si === v.si).episodes[v.ei + 1] : null;
    const nb = $("#playerNext");
    nb.hidden = !nextEp;
    if (nextEp) { nb.dataset.play = nextEp.key; $("#playerNextTitle").textContent = nextEp.title; }
    $("#playerFull").hidden = false;
    document.body.classList.add("noscroll");
    stopHero();
  }
  function closePlayer() {
    if ($("#playerFull").hidden) return;
    $("#playerFull").hidden = true; $("#playerFrame").innerHTML = "";
    if (modal.hidden) document.body.classList.remove("noscroll");
    startHero(current);
  }
  $("#playerBack").addEventListener("click", closePlayer);

  /* ---------- Recherche ---------- */
  const search = $("#search"), sInput = $("#searchInput");
  const PAGES_IDX = [{ label: "Accueil", go: "home" }, { label: "Coulisses", go: "coulisses" }, ...(SERIES_ON ? [{ label: "Séries", go: "series" }] : []), { label: "À venir", go: "a-venir" }];
  function openSearch() {
    search.hidden = false; sInput.value = ""; renderSearch();
    document.body.classList.add("noscroll");
    setTimeout(() => sInput.focus(), 20);
  }
  function closeSearch() { search.hidden = true; if (modal.hidden && $("#playerFull").hidden) document.body.classList.remove("noscroll"); }
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function renderSearch() {
    const q = norm(sInput.value.trim());
    const vids = ALL.filter((v) => !q || norm([v.title, v.tag, v.category, v.description, v.year].join(" ")).includes(q));
    const pages = PAGES_IDX.filter((p) => q && norm(p.label).includes(q));
    const raw = esc(sInput.value.trim());
    $("#searchResults").innerHTML =
      (pages.length ? `<div class="s-pages">${pages.map((p) => `<a href="#${p.go}" data-go="${p.go}" class="chip">${esc(p.label)} ${ICON.chev}</a>`).join("")}</div>` : "") +
      `<h3>${q ? (vids.length ? `Résultats pour « ${raw} »` : `Aucun résultat pour « ${raw} »`) : "Tout le catalogue"}</h3>` +
      `<div class="s-grid">${vids.map(cardHTML).join("")}</div>`;
  }
  sInput.addEventListener("input", renderSearch);
  $("#openSearch").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", closeSearch);

  function closeAll() { closeSearch(); closeModal(); closePlayer(); closeMenu(); }

  /* ---------- Clavier ---------- */
  document.addEventListener("keydown", (e) => {
    if ($("#app").hidden) return;
    if (e.key === "Escape") {
      if (!$("#playerFull").hidden) return closePlayer();
      if (!modal.hidden) return closeModal();
      if (!search.hidden) return closeSearch();
      return closeMenu();
    }
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault(); openSearch();
    }
  });

  /* ---------- Démarrage ---------- */
  renderPin();
  if (store.get("nx-auth") === "1") openApp();
  else setTimeout(() => input.focus(), 100);
})();
