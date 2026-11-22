const madridDate = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric'});
const madridHour = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', hour: '2-digit', hourCycle: 'h23'});

function nextMadridMidnight(now) {
  const [day, month, year] = madridDate.format(now).split('/').map(Number);
  const midnightUTC = Date.UTC(year, month - 1, day + 1);
  return midnightUTC - Number(madridHour.format(midnightUTC)) * 3600000;
}

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
    const daily = this.hasAttribute('data-daily');
    let deadline = daily ? nextMadridMidnight(Date.now()) : Number(this.dataset.end) * 1000;
    const timer = this.querySelector('[role="timer"]');
    const tick = () => {
      if (daily && deadline <= Date.now()) deadline = nextMadridMidnight(Date.now());
      const seconds = Math.ceil((deadline - Date.now()) / 1000);
      this.hidden = !Number.isFinite(seconds) || seconds <= 0;
      if (this.hidden) return;
      const parts = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0'));
      setCard(cards.h, parts[0]);
      setCard(cards.m, parts[1]);
      setCard(cards.s, parts[2]);
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
