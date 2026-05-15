// Tower page — floorplan tabs + image lightbox
(() => {
  document.querySelectorAll('.fp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.fp;
      document.querySelectorAll('.fp-tab').forEach(t => {
        const active = t.dataset.fp === target;
        t.classList.toggle('bg-lum-green', active);
        t.classList.toggle('text-ivory', active);
        t.classList.toggle('bg-warm-gray', !active);
        t.classList.toggle('text-hsg-slate', !active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      document.querySelectorAll('.fp-panel').forEach(p => {
        p.classList.toggle('hidden', p.dataset.fpPanel !== target);
      });
    });
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  if (lb && lbImg && lbClose) {
    document.querySelectorAll('[data-lightbox] img').forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.remove('hidden');
        lb.classList.add('flex');
      });
    });
    const close = () => { lb.classList.add('hidden'); lb.classList.remove('flex'); lbImg.src = ''; };
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }
})();
