(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ── PAGE LOADER ──
  const loader = document.getElementById("page-loader");
  if (loader) {
    const removeLoader = () => {
      if (prefersReduced) {
        loader.remove();
      } else {
        loader.classList.add("page-loading-hidden");
        setTimeout(() => loader.remove(), 350);
      }
    };
    if (document.readyState === "complete") removeLoader();
    else window.addEventListener("load", removeLoader);
  }

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("active"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("active"));
  }

  // ── HERO PARALLAX DECORATIONS ──
  const hero = document.querySelector(".hero");
  if (hero && !prefersReduced) {
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const dist = rect.top - window.innerHeight / 2;
      hero.style.setProperty(
        "--hero-before-ty",
        Math.round(dist * 0.03) + "px",
      );
      hero.style.setProperty(
        "--hero-after-ty",
        Math.round(dist * -0.02) + "px",
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  // ── TECH STACK MARQUEE LOOP ──
  (function initSkillsMarquee() {
    const container = document.querySelector(".skills-row");
    const track = container?.querySelector(".skills-track");
    if (!container || !track || prefersReduced) return;

    const clone = track.cloneNode(true);
    clone.classList.add("skills-track-clone");
    container.appendChild(clone);

    let trackWidth = track.offsetWidth;
    container.style.position = "relative";
    container.style.height = track.offsetHeight + "px";
    track.style.position = clone.style.position = "absolute";
    track.style.left = "0";
    clone.style.left = trackWidth + "px";

    let pos = 0,
      rafId = null,
      last = null;
    const pxPerMs = 0.06;

    function step(now) {
      if (!last) last = now;
      pos += pxPerMs * (now - last);
      last = now;
      if (pos >= trackWidth) pos -= trackWidth;
      track.style.transform = clone.style.transform = `translateX(-${pos}px)`;
      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (!rafId) {
        last = null;
        rafId = requestAnimationFrame(step);
      }
    }
    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
    container.addEventListener("touchstart", stop, { passive: true });
    container.addEventListener("touchend", start);

    window.addEventListener("resize", () => {
      trackWidth = track.offsetWidth;
      container.style.height = track.offsetHeight + "px";
      clone.style.left = trackWidth + "px";
    });

    start();
  })();

  // ── BACK TO TOP & BUBBLE HEADER SHRINK CONTROL ──
  const backToTopBtn = document.getElementById("back-to-top");
  const floatingHeader = document.querySelector(".floating-header");

  if (backToTopBtn || floatingHeader) {
    window.addEventListener(
      "scroll",
      () => {
        const currentScrollY = window.scrollY;

        if (backToTopBtn) {
          if (currentScrollY > 400) {
            backToTopBtn.classList.add("show");
          } else {
            backToTopBtn.classList.remove("show");
          }
        }

        if (floatingHeader && !prefersReduced) {
          if (currentScrollY > 75) {
            floatingHeader.classList.add("shrink");
          } else {
            floatingHeader.classList.remove("shrink");
          }
        }
      },
      { passive: true },
    );

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReduced ? "auto" : "smooth",
        });
      });
    }
  }
  // ── DYNAMIC COPYRIGHT YEAR ──
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();
