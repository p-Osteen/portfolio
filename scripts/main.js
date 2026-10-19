/* Paul Osteen — portfolio interactions.
   Everything degrades: without GSAP or with reduced motion the page is fully readable. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = hasGsap && !reduced;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Toast + copy-to-clipboard ---------- */
  var toast = $("#toast"), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 1800);
  }
  $$(".cmd").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cmd = btn.getAttribute("data-cmd");
      var done = function () { showToast("Copied — " + cmd); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(done, function () { showToast("Press Ctrl+C to copy"); });
      } else { showToast("Press Ctrl+C to copy"); }
    });
  });

  /* ---------- Nav ---------- */
  var nav = $("#nav"), burger = $("#nav-burger"), links = $("#nav-links");
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-solid", y > 24);
    var menuOpen = links.classList.contains("is-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY + 4 && y > 400);
    if (y < lastY - 4 || y < 400) nav.classList.remove("is-hidden");
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  if ("IntersectionObserver" in window) {
    var navMap = {};
    $$("a", links).forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("a", links).forEach(function (a) { a.classList.remove("is-current"); });
        if (navMap[en.target.id]) navMap[en.target.id].classList.add("is-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Archive ---------- */
  var rowsEl = $("#rows"), filtersEl = $("#filters");
  var activeCat = "all";

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderArchive() {
    if (!window.PROJECTS) return;
    rowsEl.innerHTML = window.PROJECTS.map(function (p, i) {
      return '<li class="row" data-cat="' + p.cat + '">' +
        '<span class="row__n mono">' + pad(i + 1) + '</span>' +
        '<h3 class="row__t">' + esc(p.name) + (p.meta ? '<small>' + esc(p.meta) + '</small>' : '') + '</h3>' +
        '<p class="row__d">' + esc(p.desc) + '<span>' + p.tech.map(esc).join(" · ") + '</span></p>' +
        '<span class="row__c mono">' + esc(window.CATEGORIES[p.cat]) + '</span></li>';
    }).join("");

    var counts = { all: window.PROJECTS.length };
    window.PROJECTS.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    var cats = ["all"].concat(Object.keys(window.CATEGORIES));
    filtersEl.innerHTML = cats.map(function (c) {
      var label = c === "all" ? "All" : window.CATEGORIES[c];
      return '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (c === "all") + '">' + label + '<sup>' + counts[c] + '</sup></button>';
    }).join("");
  }

  function applyFilter(cat) {
    activeCat = cat;
    $$(".chip", filtersEl).forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === cat)); });
    var visible = [];
    $$(".row", rowsEl).forEach(function (r) {
      var show = cat === "all" || r.getAttribute("data-cat") === cat;
      r.hidden = !show;
      if (show) visible.push(r);
    });
    $$(".row__n", rowsEl).forEach(function (n) { n.textContent = ""; });
    visible.forEach(function (r, i) { $(".row__n", r).textContent = pad(i + 1); });
    if (animate) {
      gsap.fromTo(visible, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power3.out", overwrite: true, clearProps: "transform" });
    }
    if (hasGsap) ScrollTrigger.refresh();
  }

  renderArchive();
  if (filtersEl) filtersEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (chip) applyFilter(chip.getAttribute("data-cat"));
  });

  /* ---------- Hero dot grid (cheap canvas, pointer-reactive) ---------- */
  (function heroGrid() {
    var cv = $("#hero-grid"); if (!cv) return;
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, step = 34, mx = -999, my = -999, raf = 0, visible = true;
    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var x = step / 2; x < W; x += step) {
        for (var y = step / 2; y < H; y += step) {
          var dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy);
          var t = Math.max(0, 1 - d / 190);
          var r = 1 + t * 2.6;
          ctx.fillStyle = t > 0.02 ? "rgba(212,255,79," + (0.25 + t * 0.75).toFixed(3) + ")" : "rgba(236,232,223,0.16)";
          ctx.beginPath(); ctx.arc(x - dx * t * 0.06, y - dy * t * 0.06, r, 0, 6.2832); ctx.fill();
        }
      }
    }
    function loop() { draw(); raf = visible ? requestAnimationFrame(loop) : 0; }
    window.addEventListener("resize", size);
    size();
    if (reduced || !finePointer) return;
    var hero = $("#hero");
    hero.addEventListener("pointermove", function (e) {
      var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", function () { mx = my = -999; draw(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(hero);
    }
  })();

  /* ---------- Cursor + magnetic ---------- */
  if (finePointer && animate) {
    var cur = $(".cursor");
    var cx = gsap.quickTo(cur, "x", { duration: 0.25, ease: "power3" });
    var cy = gsap.quickTo(cur, "y", { duration: 0.25, ease: "power3" });
    window.addEventListener("pointermove", function (e) { cx(e.clientX); cy(e.clientY); cur.classList.add("is-on"); });
    document.addEventListener("pointerleave", function () { cur.classList.remove("is-on"); });
    document.addEventListener("pointerover", function (e) {
      cur.classList.toggle("is-active", !!e.target.closest("a, button, .case__media, .row"));
    });

    $$(".magnetic").forEach(function (el) {
      var mxTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      var myTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mxTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        myTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      el.addEventListener("pointerleave", function () { mxTo(0); myTo(0); });
    });
  }

  if (!hasGsap) return;

  /* ---------- Count-up numbers ---------- */
  $$("[data-count]").forEach(function (el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    if (!animate) { el.textContent = end; return; }
    var o = { v: 0 };
    el.textContent = "0";
    gsap.to(o, { v: end, duration: 1.6, delay: 0.9, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  });

  if (!animate) return;

  /* ---------- Hero intro ---------- */
  var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from(".hero__name .line__inner", { yPercent: 115, duration: 1.3, stagger: 0.12 })
    .from(".hero__top > *", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, 0.3)
    .from(".hero__lede", { opacity: 0, y: 24, duration: 0.9 }, 0.7)
    .from(".hero__portrait", { opacity: 0, y: 40, scale: 0.94, duration: 1 }, 0.8)
    .from(".stat", { opacity: 0, y: 24, duration: 0.8, stagger: 0.08 }, 0.9);

  gsap.to(".hero__name", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__portrait", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ---------- About: word-by-word light-up ---------- */
  var st = $("#about-statement");
  if (st) {
    var words = st.textContent.trim().split(/\s+/);
    st.setAttribute("aria-label", words.join(" "));
    st.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + esc(w) + '</span>'; }).join(" ");
    var spans = $$(".w", st);
    ScrollTrigger.create({
      trigger: st, start: "top 80%", end: "bottom 45%", scrub: true,
      onUpdate: function (self) {
        var n = Math.round(self.progress * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle("is-lit", i < n); });
      }
    });
  }

  /* ---------- Generic reveals ---------- */
  var revealSel = ".section .eyebrow, .section h2, .section .lede, .about__note, .facts li, .stack__col, .pkg, .step, .contact > *, .filters";
  gsap.set(revealSel, { opacity: 0, y: 36 });
  ScrollTrigger.batch(revealSel, {
    start: "top 90%", once: true,
    onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", overwrite: true }); }
  });
  ScrollTrigger.batch(".row", {
    start: "top 94%", once: true,
    onEnter: function (batch) { gsap.fromTo(batch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out", clearProps: "transform" }); }
  });

  /* ---------- Work: pinned horizontal scroll (desktop) / stacked reveals (mobile) ---------- */
  var work = $("#work"), track = $("#work-track");
  var mm = gsap.matchMedia();
  mm.add("(min-width: 960px) and (min-height: 640px)", function () {
    work.classList.add("work--h");
    var cur = $("#work-current"), bar = $("#work-progress"), count = $$(".case", track).length;
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: work, start: "top top", end: function () { return "+=" + dist(); },
        pin: $(".work__pin", work), pinSpacing: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (self) {
          bar.style.transform = "scaleX(" + self.progress + ")";
          cur.textContent = pad(Math.min(count, Math.floor(self.progress * count) + 1));
        }
      }
    });
    return function () { work.classList.remove("work--h"); bar.style.transform = ""; };
  });
  mm.add("(max-width: 959px), (max-height: 639px)", function () {
    $$(".case", track).forEach(function (c) {
      gsap.from(c, { opacity: 0, y: 48, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 88%", once: true } });
    });
  });

  /* ---------- Marquee speeds up on scroll ---------- */
  var mq = $(".marquee__track");
  if (mq) {
    var mqTween = gsap.to(mq, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
    mq.style.animation = "none";
    ScrollTrigger.create({ onUpdate: function (s) { gsap.to(mqTween, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 400, 5), duration: 0.3, overwrite: true }); gsap.to(mqTween, { timeScale: 1, delay: 0.3, duration: 1.2 }); } });
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
