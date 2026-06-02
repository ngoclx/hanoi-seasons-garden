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
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      document.querySelectorAll('.amenity-panel').forEach(p => {
        const show = p.dataset.panel === target;
        p.classList.toggle('hidden', !show);
        p.classList.toggle('grid', show);
      });
    });
  });

  // Policy cards — clicking a card swaps the payment-schedule panel below
  document.querySelectorAll('.policy-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.pay;

      document.querySelectorAll('.policy-card').forEach(c => {
        const active = c.dataset.pay === target;
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
        c.classList.toggle('is-active', active);
        // Swap the card body palette so the active one becomes green, inactive ones revert to white
        c.classList.toggle('bg-lum-green', active);
        c.classList.toggle('text-ivory', active);
        c.classList.toggle('border-transparent', active);
        c.classList.toggle('bg-white', !active);
        c.classList.toggle('text-hsg-slate', !active);
        c.classList.toggle('border-warm-gray', !active);

        const title = c.querySelector('.policy-title');
        if (title) {
          title.classList.toggle('text-hsg-slate', !active);
        }
        const hero = c.querySelector('.policy-hero');
        if (hero) {
          hero.classList.toggle('text-lum-green', !active);
          // The small "label" span inside the hero number switches its tone
          const sub = hero.querySelector('span');
          if (sub) {
            sub.classList.toggle('text-sage-light', active);
            sub.classList.toggle('text-hsg-slate/80', !active);
          }
        }
        const list = c.querySelector('.policy-list');
        if (list) {
          list.classList.toggle('text-sage-light', active);
          list.classList.toggle('text-hsg-slate/80', !active);
        }
        const eyebrow = c.querySelector('.policy-eyebrow');
        if (eyebrow) {
          eyebrow.classList.toggle('text-sage-light', active);
          eyebrow.classList.toggle('text-sand-deep', !active);
        }
        const badge = c.querySelector('.policy-badge');
        if (badge) badge.classList.toggle('hidden', !active);
      });

      document.querySelectorAll('.payment-panel').forEach(p => {
        p.classList.toggle('hidden', p.dataset.panel !== target);
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
          meta.className = 'text-xs tracking-[0.3em] uppercase text-sand-deep mb-2';
          meta.textContent = p.category;
          body.appendChild(meta);
          const title = document.createElement('h3');
          title.className = 'font-display text-lg text-hsg-slate mb-2 leading-snug';
          title.textContent = p.title;
          body.appendChild(title);
          const excerpt = document.createElement('p');
          excerpt.className = 'text-sm text-hsg-slate/80 leading-relaxed flex-1';
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

  // Lead form — uses safe DOM, no innerHTML
  // --- Lead-capture popup ---------------------------------------------------
  // Injected on every page (main.js is loaded everywhere). Shows at most once
  // per hour and never again once any lead form on any page is submitted.
  const LEAD_DONE_KEY = 'hsg_lead_submitted';
  const POPUP_SHOWN_KEY = 'hsg_popup_last_shown';
  const POPUP_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
  const POPUP_DELAY_MS = 3000;              // appear 3s after page load

  const lsGet = (k) => { try { return window.localStorage.getItem(k); } catch (_) { return null; } };
  const lsSet = (k, v) => { try { window.localStorage.setItem(k, v); } catch (_) { /* private mode */ } };

  function buildLeadPopup() {
    const root = document.createElement('div');
    root.className = 'lead-popup hidden fixed inset-0 z-[70] bg-hsg-slate-dark/70 backdrop-blur-sm flex items-center justify-center p-4';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'lead-popup-title');

    const card = document.createElement('div');
    card.className = 'relative bg-white rounded-3xl w-full max-w-lg p-6 lg:p-10 shadow-2xl';

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-lum-green text-white text-2xl leading-none hover:bg-lum-green-dark transition-colors';
    close.setAttribute('aria-label', 'Đóng');
    close.textContent = '×';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'text-xs tracking-[0.3em] uppercase text-lum-green text-center mb-3';
    eyebrow.textContent = 'Cập nhật mới nhất từ chủ đầu tư';

    const title = document.createElement('h2');
    title.id = 'lead-popup-title';
    title.className = 'font-display text-2xl lg:text-3xl text-hsg-slate text-center mb-4';
    title.textContent = 'LUMIÈRE Hanoi Seasons Garden';

    const divider = document.createElement('div');
    divider.className = 'w-14 h-px bg-sand mx-auto mb-6';

    const panel = document.createElement('div');
    panel.className = 'bg-ivory rounded-2xl p-5 lg:p-6';

    const heading = document.createElement('h3');
    heading.className = 'font-semibold text-center tracking-wide text-hsg-slate uppercase text-sm mb-2';
    heading.textContent = 'Đăng ký nhận tài liệu & bảng giá';

    const sub = document.createElement('p');
    sub.className = 'text-sm text-hsg-slate/70 text-center italic mb-5';
    sub.textContent = 'Quý khách vui lòng để lại thông tin, trọn bộ tài liệu chi tiết sẽ được gửi tới sau ít phút.';

    const form = document.createElement('form');
    form.className = 'lead-form space-y-3';
    form.setAttribute('novalidate', '');

    const honey = document.createElement('input');
    honey.type = 'text'; honey.name = '_gotcha'; honey.tabIndex = -1; honey.autocomplete = 'off';
    honey.setAttribute('aria-hidden', 'true'); honey.setAttribute('aria-label', 'Do not fill');
    honey.style.cssText = 'position:absolute;left:-9999px';

    const inputCls = 'w-full bg-white border border-warm-gray rounded-lg px-4 py-3 text-hsg-slate placeholder-hsg-slate/40 focus:outline-none focus:border-sand';
    const nameInput = document.createElement('input');
    nameInput.id = 'lp-name'; nameInput.name = 'name'; nameInput.type = 'text';
    nameInput.required = true; nameInput.minLength = 2; nameInput.className = inputCls;
    nameInput.placeholder = 'Họ tên';

    const phoneInput = document.createElement('input');
    phoneInput.id = 'lp-phone'; phoneInput.name = 'phone'; phoneInput.type = 'tel';
    phoneInput.required = true; phoneInput.pattern = '0[0-9]{9}'; phoneInput.className = inputCls;
    phoneInput.placeholder = 'Số điện thoại';

    const source = document.createElement('input');
    source.type = 'hidden'; source.name = 'source'; source.value = 'popup';

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'w-full inline-flex items-center justify-center px-8 py-4 bg-sand text-hsg-slate-dark text-xs font-semibold tracking-[0.18em] uppercase rounded-sm hover:bg-sand-dark transition-colors';
    submit.textContent = 'Đăng ký tư vấn';

    const status = document.createElement('p');
    status.className = 'lf-status text-sm text-center hidden';

    const nameWrap = document.createElement('div'); nameWrap.appendChild(nameInput);
    const phoneWrap = document.createElement('div'); phoneWrap.appendChild(phoneInput);
    form.append(honey, nameWrap, phoneWrap, source, submit, status);
    panel.append(heading, sub, form);
    card.append(close, eyebrow, title, divider, panel);
    root.appendChild(card);

    const hide = () => root.classList.add('hidden');
    close.addEventListener('click', hide);
    root.addEventListener('click', (e) => { if (e.target === root) hide(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !root.classList.contains('hidden')) hide();
    });

    return { root, hide, nameInput };
  }

  const leadPopup = buildLeadPopup();
  document.body.appendChild(leadPopup.root);

  function showLeadPopup() {
    if (lsGet(LEAD_DONE_KEY) === '1') return;
    leadPopup.root.classList.remove('hidden');
    lsSet(POPUP_SHOWN_KEY, String(Date.now()));
    try { leadPopup.nameInput.focus(); } catch (_) { /* noop */ }
  }

  // Schedule one appearance if not suppressed and outside the 1h cooldown.
  if (lsGet(LEAD_DONE_KEY) !== '1') {
    const last = parseInt(lsGet(POPUP_SHOWN_KEY) || '0', 10);
    if (Date.now() - last >= POPUP_COOLDOWN_MS) {
      window.setTimeout(showLeadPopup, POPUP_DELAY_MS);
    }
  }

  const PHONE_RE = /^0\d{9}$/;
  // Matches both the class-hook forms on the homepage (two instances), the
  // injected popup form, and the single id="lead-form" on blog/faq/tower pages.
  document.querySelectorAll('form.lead-form, form#lead-form').forEach((leadForm) => {
    const status = leadForm.querySelector('.lf-status, #lf-status');
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.classList.remove('hidden', 'text-sand', 'text-red-300');
      const data = new FormData(leadForm);
      if (data.get('_gotcha')) return;
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      if (name.length < 2) {
        status.classList.add('text-red-300');
        status.textContent = 'Vui lòng nhập tên anh/chị (ít nhất 2 ký tự).';
        status.classList.remove('hidden');
        return;
      }
      if (!PHONE_RE.test(phone)) {
        status.classList.add('text-red-300');
        status.textContent = 'Số điện thoại không hợp lệ. Định dạng: 0XXXXXXXXX';
        status.classList.remove('hidden');
        return;
      }
      try {
        const params = new URLSearchParams();
        for (const [k, v] of data.entries()) params.append(k, v.toString());
        const resp = await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: params,
        });
        if (!resp.ok) throw new Error('submit_failed');
        status.classList.add('text-sand');
        status.textContent = 'Cảm ơn — Phòng Kinh Doanh sẽ liên hệ trong thời gian sớm nhất.';
        status.classList.remove('hidden');
        leadForm.reset();
        // Any successful submission suppresses the popup permanently.
        lsSet(LEAD_DONE_KEY, '1');
        leadPopup.hide();
      } catch (err) {
        status.classList.add('text-red-300');
        status.textContent = 'Có lỗi khi gửi. Vui lòng gọi 0564.928.999.';
        status.classList.remove('hidden');
      }
    });
  });

  // Amenity lightbox — open any tiện ích figure in full-screen, navigate prev/next within the active tab
  const aLb = document.getElementById('amenity-lightbox');
  if (aLb) {
    const aImg = document.getElementById('amenity-lb-img');
    const aCap = document.getElementById('amenity-lb-caption');
    const aCounter = document.getElementById('amenity-lb-counter');
    const aClose = document.getElementById('amenity-lb-close');
    const aPrev = document.getElementById('amenity-lb-prev');
    const aNext = document.getElementById('amenity-lb-next');

    let panelImages = [];
    let currentIdx = 0;

    function loadCurrent() {
      if (!panelImages.length) return;
      const img = panelImages[currentIdx];
      aImg.src = img.src;
      aImg.alt = img.alt;
      const cap = img.parentElement.querySelector('figcaption');
      aCap.textContent = cap ? cap.textContent : img.alt;
      aCounter.textContent = (currentIdx + 1) + ' / ' + panelImages.length;
    }

    function openAt(panelEl, startImg) {
      panelImages = Array.from(panelEl.querySelectorAll('figure img'));
      currentIdx = panelImages.indexOf(startImg);
      if (currentIdx < 0) currentIdx = 0;
      loadCurrent();
      aLb.classList.remove('hidden');
      aLb.classList.add('flex');
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      aLb.classList.add('hidden');
      aLb.classList.remove('flex');
      aImg.src = '';
      panelImages = [];
      document.body.style.overflow = '';
    }

    function nextImg() {
      if (!panelImages.length) return;
      currentIdx = (currentIdx + 1) % panelImages.length;
      loadCurrent();
    }

    function prevImg() {
      if (!panelImages.length) return;
      currentIdx = (currentIdx - 1 + panelImages.length) % panelImages.length;
      loadCurrent();
    }

    document.querySelectorAll('.amenity-panel figure').forEach(fig => {
      fig.classList.add('cursor-zoom-in');
      fig.addEventListener('click', () => {
        const panel = fig.closest('.amenity-panel');
        const img = fig.querySelector('img');
        if (!panel || !img) return;
        openAt(panel, img);
      });
    });

    aClose.addEventListener('click', closeLb);
    aPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImg(); });
    aNext.addEventListener('click', (e) => { e.stopPropagation(); nextImg(); });
    aLb.addEventListener('click', (e) => { if (e.target === aLb) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (aLb.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') nextImg();
      else if (e.key === 'ArrowLeft') prevImg();
    });
  }
})();
