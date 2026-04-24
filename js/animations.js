(function(){
  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typewriter(el, speed){
    const text = el.textContent;
    el.textContent = '';
    el.classList.add('typewriter');
    let i = 0;
    const step = () => {
      if (i <= text.length){
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else {
        el.classList.add('done');
        setTimeout(() => el.classList.add('finished'), 1400);
      }
    };
    step();
  }

  const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const revealTargets = document.querySelectorAll(revealSelectors.join(','));

  if (prefersReduced){
    revealTargets.forEach(el => el.classList.add('in'));
    document.querySelectorAll('[data-typewriter]').forEach(el => {
      el.classList.remove('typewriter');
    });
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');

      const tw = el.querySelector('[data-typewriter]');
      if (tw && !tw.dataset.typed){
        tw.dataset.typed = '1';
        const base = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) || 0;
        const speed = parseInt(tw.dataset.speed || '45', 10);
        setTimeout(() => typewriter(tw, speed), base + 120);
      }

      observer.unobserve(el);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  });

  revealTargets.forEach(el => io.observe(el));

  document.querySelectorAll('[data-typewriter]').forEach(el => {
    if (!el.closest(revealSelectors.join(','))){
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight){
        if (!el.dataset.typed){
          el.dataset.typed = '1';
          typewriter(el, parseInt(el.dataset.speed || '45', 10));
        }
      } else {
        const io2 = new IntersectionObserver((entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting && !el.dataset.typed){
              el.dataset.typed = '1';
              typewriter(el, parseInt(el.dataset.speed || '45', 10));
              obs.unobserve(el);
            }
          });
        }, { threshold: 0.4 });
        io2.observe(el);
      }
    }
  });
})();
