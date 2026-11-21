class NuvelCountdown extends HTMLElement {
  connectedCallback() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = {};
    this.querySelectorAll('.flip').forEach(el => {
      el.innerHTML =
        '<div class="flip__half flip__top"><span></span></div>' +
        '<div class="flip__half flip__bot"><span></span></div>' +
        '<div class="flip__leaf flip__leaf--top"><span></span></div>' +
        '<div class="flip__leaf flip__leaf--bot"><span></span></div>';
      const s = el.querySelectorAll('span');
      cards[el.dataset.u] = { el, top: s[0], bot: s[1], lTop: s[2], lBot: s[3], val: null, timer: null };
    });

    function setCard(c, v) {
      if (c.val === v) return;
      const old = c.val; c.val = v;
      if (old === null || reduce) { c.top.textContent = c.bot.textContent = c.lTop.textContent = c.lBot.textContent = v; return; }
      clearTimeout(c.timer);
      c.lTop.textContent = old;  // hoja que cae: valor anterior
      c.lBot.textContent = v;    // hoja que sube: valor nuevo
      c.top.textContent = v;     // mitad superior ya muestra el nuevo
      c.el.classList.remove('is-flipping'); void c.el.offsetWidth; c.el.classList.add('is-flipping');
      c.timer = setTimeout(() => { c.bot.textContent = v; c.el.classList.remove('is-flipping'); }, 460);
    }

    this.cards = cards;
    // Fecha fija: la misma para todas las visitas, sin reinicios por visita ni por cookie.
    const raw = this.dataset.endIso || '';
    const deadline = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
    const timer = this.querySelector('[role="timer"]');
    const tick = () => {
      const seconds = Math.ceil((deadline - Date.now()) / 1000);
      this.hidden = !Number.isFinite(seconds) || seconds <= 0;
      if (this.hidden) return;
      const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0'));
      setCard(cards.d, parts[0]);
      setCard(cards.h, parts[1]);
      setCard(cards.m, parts[2]);
      setCard(cards.s, parts[3]);
      timer.textContent = parts.join(':');
      this.timeout = setTimeout(tick, 1000);
    };
    tick();
  }

  disconnectedCallback() {
    clearTimeout(this.timeout);
    Object.values(this.cards || {}).forEach(card => clearTimeout(card.timer));
  }
}

if (!customElements.get('nuvel-contador-diario')) customElements.define('nuvel-contador-diario', NuvelCountdown);
