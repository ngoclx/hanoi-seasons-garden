(() => {
  const relatedEl = document.getElementById('related-posts');
  if (!relatedEl) return;
  const currentSlug = relatedEl.dataset.currentSlug;
  fetch('/blog/posts.json')
    .then(r => r.json())
    .then(posts => {
      const others = posts.filter(p => p.slug !== currentSlug);
      const picks = others.sort(() => Math.random() - 0.5).slice(0, 3);
      picks.forEach(p => {
        const card = document.createElement('a');
        card.href = `/blog/${p.slug}`;
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
        const img = document.createElement('img');
        img.src = `/images/${p.image}`;
        img.alt = p.title; img.loading = 'lazy';
        img.className = 'w-full aspect-[16/9] object-cover';
        card.appendChild(img);
        const body = document.createElement('div');
        body.className = 'p-4 flex-1 flex flex-col';
        const cat = document.createElement('p');
        cat.className = 'text-xs tracking-[0.3em] uppercase text-sand-deep mb-2';
        cat.textContent = p.category;
        body.appendChild(cat);
        const title = document.createElement('h3');
        title.className = 'font-display text-base text-hsg-slate leading-snug';
        title.textContent = p.title;
        body.appendChild(title);
        card.appendChild(body);
        relatedEl.appendChild(card);
      });
    });
})();
