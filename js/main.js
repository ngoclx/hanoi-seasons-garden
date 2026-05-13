// Hanoi Seasons Garden PKD — main JS
(() => {
  // Mobile menu toggle
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
    });
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Amenity tabs
  document.querySelectorAll('.amenity-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.amenity-tab').forEach(t => {
        const active = t.dataset.tab === target;
        t.classList.toggle('bg-sand', active);
        t.classList.toggle('text-hsg-slate-dark', active);
        t.classList.toggle('text-sage', !active);
      });
      document.querySelectorAll('.amenity-panel').forEach(p => {
        const show = p.dataset.panel === target;
        p.classList.toggle('hidden', !show);
        p.classList.toggle('grid', show);
      });
    });
  });

  // Latest posts on index — uses safe DOM methods, no innerHTML
  const latestEl = document.getElementById('latest-posts');
  if (latestEl) {
    fetch('/blog/posts.json')
      .then(r => r.json())
      .then(posts => {
        const top = posts.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
        top.forEach(p => {
          const card = document.createElement('a');
          card.href = `/blog/${p.slug}`;
          card.className = 'bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
          const img = document.createElement('img');
          img.src = `/images/${p.image}`;
          img.alt = p.title;
          img.loading = 'lazy';
          img.className = 'w-full aspect-[16/9] object-cover';
          card.appendChild(img);
          const body = document.createElement('div');
          body.className = 'p-5 flex flex-col flex-1';
          const meta = document.createElement('p');
          meta.className = 'text-xs tracking-[0.3em] uppercase text-sand mb-2';
          meta.textContent = p.category;
          body.appendChild(meta);
          const title = document.createElement('h3');
          title.className = 'font-display text-lg text-hsg-slate mb-2 leading-snug';
          title.textContent = p.title;
          body.appendChild(title);
          const excerpt = document.createElement('p');
          excerpt.className = 'text-sm text-hsg-slate/70 leading-relaxed flex-1';
          excerpt.textContent = p.excerpt;
          body.appendChild(excerpt);
          const cta = document.createElement('span');
          cta.className = 'mt-4 text-xs uppercase tracking-wider text-lum-green font-semibold';
          cta.textContent = 'Đọc tiếp →';
          body.appendChild(cta);
          card.appendChild(body);
          latestEl.appendChild(card);
        });
      })
      .catch(() => { /* posts.json not yet present — silent */ });
  }
})();
