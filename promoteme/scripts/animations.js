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
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('active'));
  }
})();
