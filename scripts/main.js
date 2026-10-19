/* Paul Osteen — portfolio interactions. No animation library: entrance motion is CSS,
   the project rail is native scroll-snap plus a velocity-aware mouse drag.
   Everything degrades: without JS the page is fully readable. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var scrollBehavior = function () { return reducedMotion.matches ? "auto" : "smooth"; };

  /* ---------- Scroll reveals (IntersectionObserver, CSS does the motion) ---------- */
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        revealIO.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    $$(".reveal").forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- Nav ---------- */
  var nav = $("#nav"), burger = $("#nav-burger"), links = $("#nav-links");
  var scrolled = false;
  function onScroll() {
    var s = window.scrollY > 8;
    if (s !== scrolled) { scrolled = s; nav.classList.toggle("is-scrolled", s); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("pointerdown", function (e) {
    if (links.classList.contains("is-open") && !e.target.closest("#nav")) setMenu(false);
  });

  if ("IntersectionObserver" in window) {
    var navMap = {};
    $$("a", links).forEach(function (a) { navMap[a.getAttribute("href").slice(1)] = a; });
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("a", links).forEach(function (a) { a.classList.remove("is-current"); });
        if (navMap[en.target.id]) navMap[en.target.id].classList.add("is-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(navMap).forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ---------- Copy to clipboard: feedback lives on the control ---------- */
  var toast = $("#toast"), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 1600);
  }
  $$(".cmd").forEach(function (btn) {
    var label = $("em", btn), timer;
    btn.addEventListener("click", function () {
      var cmd = btn.getAttribute("data-cmd");
      var done = function () {
        btn.classList.add("is-copied"); label.textContent = "Copied";
        clearTimeout(timer);
        timer = setTimeout(function () { btn.classList.remove("is-copied"); label.textContent = "Copy"; }, 1600);
        showToast("Copied: " + cmd);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(done, function () { showToast("Press Ctrl+C to copy"); });
      } else { showToast("Press Ctrl+C to copy"); }
    });
  });

  /* ---------- Archive ---------- */
  var rowsEl = $("#rows"), filtersEl = $("#filters");

  function renderArchive() {
    if (!window.PROJECTS) return;
    rowsEl.innerHTML = window.PROJECTS.map(function (p) {
      return '<li class="row" data-cat="' + p.cat + '">' +
        '<h3 class="row__t">' + esc(p.name) + (p.meta ? '<small>' + esc(p.meta) + '</small>' : '') + '</h3>' +
        '<p class="row__d">' + esc(p.desc) + '<span>' + p.tech.map(esc).join(" · ") + '</span></p>' +
        '<span class="row__c">' + esc(window.CATEGORIES[p.cat]) + '</span></li>';
    }).join("");

    var counts = { all: window.PROJECTS.length };
    window.PROJECTS.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    filtersEl.innerHTML = ["all"].concat(Object.keys(window.CATEGORIES)).map(function (c) {
      var label = c === "all" ? "All" : window.CATEGORIES[c];
      return '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (c === "all") + '">' + label + '<sup>' + counts[c] + '</sup></button>';
    }).join("");
  }

  function applyFilter(cat) {
    $$(".chip", filtersEl).forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === cat)); });
    var n = 0;
    $$(".row", rowsEl).forEach(function (r) {
      var show = cat === "all" || r.getAttribute("data-cat") === cat;
      r.hidden = !show;
      r.classList.remove("is-entering");
      if (show) {
        r.style.setProperty("--i", Math.min(n++, 10));
        void r.offsetWidth; // restart the entrance animation
        r.classList.add("is-entering");
      }
    });
  }

  renderArchive();
  filtersEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (chip) applyFilter(chip.getAttribute("data-cat"));
  });

  /* ---------- Project rail ---------- */
  var rail = $("#rail"), cases = $$(".case", rail);
  var prevBtn = $("#rail-prev"), nextBtn = $("#rail-next"), dots = $$("#rail-dots i");
  var rafId = 0;

  // scrollLeft at which each card sits flush with the snap padding
  function offsets() {
    var padL = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    return cases.map(function (c) { return c.offsetLeft - padL; });
  }
  function nearest(x, offs) {
    var best = 0;
    offs.forEach(function (o, i) { if (Math.abs(o - x) < Math.abs(offs[best] - x)) best = i; });
    return best;
  }
  function updateRail() {
    rafId = 0;
    var offs = offsets(), max = rail.scrollWidth - rail.clientWidth;
    var idx = nearest(rail.scrollLeft, offs);
    dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
    prevBtn.disabled = rail.scrollLeft <= 2;
    nextBtn.disabled = rail.scrollLeft >= max - 2;
  }
  function queueUpdate() { if (!rafId) rafId = requestAnimationFrame(updateRail); }
  function go(i) {
    var offs = offsets();
    i = Math.max(0, Math.min(offs.length - 1, i));
    rail.scrollTo({ left: offs[i], behavior: scrollBehavior() });
  }
  // buttons re-read the live position each press, so they work mid-scroll
  prevBtn.addEventListener("click", function () { go(nearest(rail.scrollLeft, offsets()) - 1); });
  nextBtn.addEventListener("click", function () { go(nearest(rail.scrollLeft, offsets()) + 1); });
  rail.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    go(nearest(rail.scrollLeft, offsets()) + (e.key === "ArrowRight" ? 1 : -1));
  });
  rail.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate);
  updateRail();

  // Mouse drag: 1:1 tracking after a small threshold, then project momentum and snap to the nearest card.
  // Touch and trackpad use native scrolling, which already does all of this.
  var drag = null;
  function project(v /* px/s */) { var d = 0.998; return (v / 1000) * d / (1 - d); }

  rail.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0 || e.target.closest("button, a")) return;
    drag = { id: e.pointerId, x: e.clientX, left: rail.scrollLeft, moved: false, hist: [{ t: e.timeStamp, x: e.clientX }] };
  });
  rail.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return; // hysteresis before committing to a drag
      drag.moved = true;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(e.pointerId);
    }
    rail.scrollLeft = drag.left - dx; // glued to the pointer, offset from where it was grabbed
    drag.hist.push({ t: e.timeStamp, x: e.clientX });
    while (drag.hist.length > 2 && e.timeStamp - drag.hist[0].t > 100) drag.hist.shift();
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    if (!d.moved) return;
    var first = d.hist[0], last = d.hist[d.hist.length - 1];
    var v = last.t > first.t ? -((last.x - first.x) / (last.t - first.t)) * 1000 : 0; // scroll velocity, px/s
    var offs = offsets(), target = offs[nearest(rail.scrollLeft + project(v), offs)];
    rail.classList.remove("is-dragging");
    rail.scrollTo({ left: target, behavior: scrollBehavior() });
  }
  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);
})();
