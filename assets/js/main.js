/*=============== BASIC HELPERS ===============*/
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/*=============== NAV MENU (MOBILE) ===============*/
(() => {
  const navMenu = $("#nav-menu");
  const navToggle = $("#nav-toggle");
  const navClose = $("#nav-close");
  const navLinks = $$(".nav__link");

  if (!navMenu) return;

  const openMenu = () => navMenu.classList.add("show-menu");
  const closeMenu = () => navMenu.classList.remove("show-menu");

  navToggle?.addEventListener("click", openMenu);
  navClose?.addEventListener("click", closeMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
})();

/*=============== HEADER SHADOW ON SCROLL ===============*/
(() => {
  const header = $("#header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/*=============== HOME SPLIT TEXT (ANIME) ===============*/
(() => {
  const title = $("[data-split]");
  if (!title) return;

  if (typeof anime !== "function") return;

  const plain = title.innerText.replace(/\s+/g, " ").trim();
  if (!plain) return;

  title.setAttribute("aria-label", plain);

  const chars = plain.split("");
  title.innerHTML = chars
    .map((ch) =>
      ch === " "
        ? `<span class="char" aria-hidden="true">&nbsp;</span>`
        : `<span class="char" aria-hidden="true">${ch.replace(/</g, "&lt;")}</span>`
    )
    .join("");

  anime({
    targets: ".home__title .char",
    translateY: [18, 0],
    opacity: [0, 1],
    delay: anime.stagger(18),
    duration: 700,
    easing: "easeOutCubic",
  });
})();

/*=============== SWIPER PROJECTS ===============*/
(() => {
  const swiperEl = $(".projects__swiper");
  if (!swiperEl) return;
  if (typeof Swiper === "undefined") return;

  // eslint-disable-next-line no-new
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 16,
    grabCursor: true,
    loop: true,
    pagination: {
      el: ".projects__pagination",
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 18 },
      1150: { slidesPerView: 3, spaceBetween: 22 },
    },
  });
})();

/*=============== WORK TABS ===============*/
(() => {
  const tabs = $$(".work__tab");
  const panels = $$(".work__panel");
  if (!tabs.length || !panels.length) return;

  const activate = (tab) => {
    const target = tab.getAttribute("data-target");
    if (!target) return;

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach((p) => p.classList.toggle("is-active", `#${p.id}` === target));
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => activate(tab)));
})();

/*=============== SERVICES ACCORDION ===============*/
(() => {
  const items = $$(".services__item");
  if (!items.length) return;

  items.forEach((item) => {
    const header = $(".services__header", item);
    const body = $(".services__body", item);
    if (!header || !body) return;

    header.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((i) => {
        i.classList.remove("is-open");
        const h = $(".services__header", i);
        const b = $(".services__body", i);
        if (h) h.setAttribute("aria-expanded", "false");
        if (b) b.hidden = true;
      });

      item.classList.toggle("is-open", willOpen);
      header.setAttribute("aria-expanded", willOpen ? "true" : "false");
      body.hidden = !willOpen;
    });
  });
})();

/*=============== TESTIMONIALS DUPLICATE CARDS (MARQUEE) ===============*/
(() => {
  const track = $("#testimonialsTrack");
  if (!track) return;

  if (track.dataset.duplicated === "true") return;
  track.dataset.duplicated = "true";

  const children = Array.from(track.children);
  children.forEach((child) => track.appendChild(child.cloneNode(true)));
})();

/*=============== COPY EMAIL IN CONTACT ===============*/
(() => {
  const btn = $("#copyEmail");
  const emailEl = $("#contactEmail");
  const hint = $("#copyHint");
  if (!btn || !emailEl) return;

  const setHint = (msg) => {
    if (!hint) return;
    hint.textContent = msg;
    window.clearTimeout(setHint._t);
    setHint._t = window.setTimeout(() => (hint.textContent = ""), 1500);
  };

  btn.addEventListener("click", async () => {
    const email = (emailEl.textContent ?? "").trim();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      setHint("Copied!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setHint("Copied!");
    }
  });
})();

/*=============== CURRENT YEAR OF THE FOOTER ===============*/
(() => {
  const year = $("#year");
  if (!year) return;
  year.textContent = String(new Date().getFullYear());
})();

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
(() => {
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");
  if (!sections.length || !navLinks.length) return;

  const byHref = new Map(navLinks.map((a) => [a.getAttribute("href"), a]));

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const height = section.offsetHeight;
      const top = section.offsetTop - 90;
      const id = section.getAttribute("id");
      if (!id) return;

      const link = byHref.get(`#${id}`);
      if (!link) return;

      const active = scrollY >= top && scrollY < top + height;
      link.classList.toggle("active-link", active);
    });
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/*=============== CUSTOM CURSOR ===============*/
(() => {
  const cursor = $("#cursor");
  const dot = $("#cursorDot");
  if (!cursor || !dot) return;
  if (window.matchMedia("(hover: none)").matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;

  const render = () => {
    cx += (x - cx) * 0.14;
    cy += (y - cy) * 0.14;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };

  const show = () => {
    cursor.style.opacity = "1";
    dot.style.opacity = "1";
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      show();
    },
    { passive: true }
  );

  render();
})();

/*=============== SCROLL REVEAL ANIMATION ===============*/
(() => {
  if (typeof ScrollReveal !== "function") return;

  const sr = ScrollReveal({
    distance: "18px",
    duration: 900,
    easing: "cubic-bezier(.2,.7,.2,1)",
    origin: "bottom",
    interval: 80,
    reset: false,
  });

  sr.reveal(".section__title, .home__subtitle, .home__description, .home__buttons, .home__social");
  sr.reveal(".about__content, .about__card", { interval: 120 });
  sr.reveal(".projects__card", { interval: 120 });
  sr.reveal(".work__container, .services__item, .testimonials__container, .contact__container", { interval: 120 });
})();
