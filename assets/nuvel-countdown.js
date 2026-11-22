// Cuenta atrás Black Friday Nuvel.
// Se calcula SIEMPRE contra la fecha fija de <html data-nuvel-bf-end>: no se reinicia por visita, cookie ni almacenamiento.
// Fases: p1 (> 48 h), p2 (24-48 h), p3 (< 24 h), p4 (< 1 h). Al llegar a cero: data-nuvel-bf="off" y todo se oculta.
(() => {
  const root = document.documentElement;
  const raw = root.dataset.nuvelBfEnd || '';
  const end = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
  const hasCountdown = Number.isFinite(end);
  if (!hasCountdown) root.dataset.nuvelBf = 'off';

  const pad = (n) => String(n).padStart(2, '0');
  let timer = null;

  function phaseFor(seconds) {
    if (seconds < 3600) return 'p4';
    if (seconds < 86400) return 'p3';
    if (seconds < 172800) return 'p2';
    return 'p1';
  }

  function render(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor(seconds / 3600) % 24;
    const m = Math.floor(seconds / 60) % 60;
    const s = seconds % 60;
    const totalHours = Math.floor(seconds / 3600);
    const phase = phaseFor(seconds);
    const compact = phase === 'p4' ? `${pad(m)}:${pad(s)}` : `${d > 0 ? d + 'd ' : ''}${pad(h)}h ${pad(m)}m ${pad(s)}s`;

    if (root.dataset.nuvelPhase !== phase) root.dataset.nuvelPhase = phase;

    document.querySelectorAll('nuvel-countdown').forEach((el) => {
      const version = el.dataset.version;
      if (version === 'grande') {
        const title = el.querySelector('[data-nbf-title]');
        const text = el.dataset['f' + phase.slice(1)] || '';
        if (title && title.textContent !== text) title.textContent = text;
        const set = (u, v) => {
          const node = el.querySelector(`[data-u="${u}"]`);
          if (node && node.textContent !== v) node.textContent = v;
        };
        set('d', pad(d));
        set('h', pad(h));
        set('m', pad(m));
        set('s', pad(s));
        const live = el.querySelector('[data-nbf-timer]');
        if (live) live.textContent = phase === 'p4' ? `${pad(m)}:${pad(s)}` : `${d}:${pad(h)}:${pad(m)}:${pad(s)}`;
      } else {
        const compactNode = el.querySelector('[data-nbf-compact]');
        if (compactNode) compactNode.textContent = compact;
        const clock = el.querySelector('[data-nbf-clock]');
        if (clock) clock.textContent = phase === 'p4' ? `${pad(m)}:${pad(s)}` : `${pad(totalHours)}:${pad(m)}:${pad(s)}`;
      }
    });
  }

  function finish() {
    clearInterval(timer);
    timer = null;
    root.dataset.nuvelBf = 'off';
    delete root.dataset.nuvelPhase;
    document.dispatchEvent(new CustomEvent('nuvel-bf:end'));
  }

  function tick() {
    const seconds = Math.ceil((end - Date.now()) / 1000);
    if (seconds <= 0) return finish();
    if (root.dataset.nuvelBf !== 'on') root.dataset.nuvelBf = 'on';
    render(seconds);
  }

  function start() {
    if (timer || root.dataset.nuvelBf === 'off' && end <= Date.now()) return;
    tick();
    if (root.dataset.nuvelBf === 'on') timer = setInterval(tick, 1000);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  if (hasCountdown) {
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  }

  // Selector 1 faja / 2 fajas: la cantidad elegida se aplica al formulario de compra justo antes de enviarlo.
  const offerQuantity = (form) => {
    if (root.dataset.nuvelBf !== 'on') return null;
    const offer = document.querySelector(`[data-nbf-offer][data-form="${form.id}"]`);
    const choice = offer && offer.querySelector('input[type="radio"]:checked');
    return choice ? Number(choice.value) : null;
  };
  const syncQuantity = (form, qty) => {
    const input = form && form.querySelector('input[name="quantity"]');
    if (!input || !qty) return;
    input.value = String(qty);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Lista única de la faja: la oferta (1 o 2 fajas) y los packs comparten un solo botón de compra.
  const packChoice = (stack) => stack && stack.querySelector('nuvel-pack-action input[type="radio"]:checked');

  // Con un pack marcado, el botón principal compra el pack (cada prenda con su talla) y no la faja suelta.
  // Se intercepta en window y en fase de captura para adelantarse a los manejadores de Horizon.
  const buyPack = (event, form) => {
    const stack = form && form.closest('[data-nbf-stack]');
    const pack = form && form.matches('[data-type="add-to-cart-form"]') && packChoice(stack);
    if (!pack) return false;
    event.preventDefault();
    event.stopImmediatePropagation();
    pack.form?.requestSubmit();
    return true;
  };

  window.addEventListener(
    'click',
    (event) => {
      const button = event.target instanceof Element && event.target.closest('button[type="submit"], button:not([type])');
      if (button && button.form) buyPack(event, button.form);
    },
    true
  );

  window.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.id) return;
      if (buyPack(event, form)) return;
      const qty = offerQuantity(form);
      if (qty) syncQuantity(form, qty);
    },
    true
  );

  const markStack = (stack) => stack && stack.classList.toggle('is-pack', Boolean(packChoice(stack)));

  document.addEventListener('change', (event) => {
    const radio = event.target;
    if (!(radio instanceof HTMLInputElement) || radio.type !== 'radio') return;
    const stack = radio.closest('[data-nbf-stack]');
    const offer = radio.closest('[data-nbf-offer]');
    if (stack && radio.checked) {
      // Solo una opción marcada en toda la lista.
      const others = offer
        ? stack.querySelectorAll('nuvel-pack-action input[type="radio"]')
        : stack.querySelectorAll('[data-nbf-offer] input[type="radio"]');
      others.forEach((other) => (other.checked = false));
      markStack(stack);
    }
    if (offer) syncQuantity(document.getElementById(offer.dataset.form), Number(radio.value));
    else if (stack && radio.closest('nuvel-pack-action')) syncQuantity(stack.querySelector('form[data-type="add-to-cart-form"]'), 1);
  });
  document.querySelectorAll('[data-nbf-stack]').forEach(markStack);

  const initOffers = () =>
    document.querySelectorAll('[data-nbf-offer]').forEach((offer) => {
      if (offer.dataset.ready) return;
      offer.dataset.ready = '1';
      const checked = offer.querySelector('input[type="radio"]:checked');
      if (root.dataset.nuvelBf === 'on' && checked) syncQuantity(document.getElementById(offer.dataset.form), Number(checked.value));
    });
  initOffers();

  document.addEventListener('nuvel-bf:end', () =>
    document.querySelectorAll('[data-nbf-offer]').forEach((offer) => syncQuantity(document.getElementById(offer.dataset.form), 1))
  );

  // Barra fija en móvil: aparece cuando el botón principal de compra sale de pantalla por arriba.
  document.querySelectorAll('[data-nbf-sticky]').forEach((bar) => {
    const form = document.getElementById(bar.dataset.form);
    const button = form && form.querySelector('[type="submit"]');
    if (!button || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([entry]) => {
      bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }).observe(button);
    bar.querySelector('[data-nbf-buy]')?.addEventListener('click', () => {
      const offer = document.querySelector(`[data-nbf-offer][data-form="${form.id}"]`);
      const two = offer && offer.querySelector('input[value="2"]');
      if (two) {
        two.checked = true;
        two.dispatchEvent(new Event('change', { bubbles: true }));
      }
      button.click();
    });
  });
})();
