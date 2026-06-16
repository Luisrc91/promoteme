(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Page loader: hide when window finishes loading
  const loader = document.getElementById('page-loader');
  if (loader) {
    if (document.readyState === 'complete') {
      if (prefersReduced) loader.remove();
      else {
        loader.classList.add('page-loading-hidden');
        setTimeout(()=> loader.remove(), 350);
      }
    } else {
      window.addEventListener('load', ()=>{
        if (prefersReduced) loader.remove();
        else {
          loader.classList.add('page-loading-hidden');
          setTimeout(()=> loader.remove(), 350);
        }
      });
    }
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('active'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // activate the revealed section
          entry.target.classList.add('active');

          // stagger children inside the revealed section for a nicer effect
          const staggerables = entry.target.querySelectorAll('.proj-card, .srv-card, .skill-chip, .badge, .contact-link');
          staggerables.forEach((el, i) => {
            el.classList.add('stagger');
            // set transition if not present
            if (!el.style.transition) el.style.transition = 'opacity 520ms cubic-bezier(.2,.9,.2,1), transform 520ms cubic-bezier(.2,.9,.2,1)';
            el.style.transitionDelay = (i * 70) + 'ms';
            setTimeout(() => el.classList.add('stagger-active'), i * 70 + 20);
          });

          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('active'));
  }

  // Parallax effect for hero decorations
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const centerY = window.innerHeight / 2;
      const dist = rect.top - centerY; // negative when above center
      // small offsets
      const beforeTy = Math.round(dist * 0.03);
      const afterTy = Math.round(dist * -0.02);
      hero.style.setProperty('--hero-before-ty', beforeTy + 'px');
      hero.style.setProperty('--hero-after-ty', afterTy + 'px');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  // Auto-scrolling marquee for tech stack (.skills-row)
  (function initSkillsMarquee(){
    const container = document.querySelector('.skills-row');
    if (!container) return;
    if (prefersReduced) return; // don't animate if reduced motion

    let track = container.querySelector('.skills-track');
    if (!track) return;

    // Clone the track to create a seamless loop
    const clone = track.cloneNode(true);
    clone.classList.add('skills-track-clone');
    container.appendChild(clone);

    let trackWidth = track.offsetWidth;
    // ensure container height matches track and use absolute positioning for smooth loop
    container.style.position = 'relative';
    container.style.height = track.offsetHeight + 'px';
    track.style.position = 'absolute';
    track.style.left = '0';
    let pos = 0;
    let rafId = null;
    let last = null;
    const pxPerMs = 0.06; // 60px/s

    // position clone absolutely to the right of the original track
    clone.style.position = 'absolute';
    clone.style.left = trackWidth + 'px';

    function step(now){
      if (!last) last = now;
      const dt = now - last;
      last = now;
      pos += pxPerMs * dt;
      if (pos >= trackWidth) pos = pos - trackWidth;
      // move both left; clone starts offset to the right by trackWidth
      track.style.transform = `translateX(-${pos}px)`;
      clone.style.transform = `translateX(-${pos}px)`;
      rafId = requestAnimationFrame(step);
    }

    function start(){ if (!rafId) { last = null; rafId = requestAnimationFrame(step); } }
    function stop(){ if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    // Pause on hover / touch
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('touchstart', stop, {passive:true});
    container.addEventListener('touchend', start);

    // Recalculate widths on resize
    window.addEventListener('resize', () => {
      trackWidth = track.offsetWidth;
      container.style.height = track.offsetHeight + 'px';
      clone.style.left = trackWidth + 'px';
    });

    // Start auto-scroll
    start();
  })();
})();
