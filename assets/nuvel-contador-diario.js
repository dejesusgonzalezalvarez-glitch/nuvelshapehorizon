const madrid = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', hourCycle: 'h23',
});

function nextMadridMidnight(now) {
  const parts = Object.fromEntries(madrid.formatToParts(now).map(({ type, value }) => [type, value]));
  const utcMidnight = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + 1);
  // Madrid changes its clocks after local midnight, so this UTC instant has the same offset.
  const offsetHours = Number(madrid.formatToParts(utcMidnight).find(part => part.type === 'hour').value);
  return utcMidnight - offsetHours * 3600000;
}

class NuvelDailyTimer extends HTMLElement {
  connectedCallback() {
    this.clock = this.querySelector('[role="timer"]');
    if (!this.clock) return;
    this.update();
    this.hidden = false;
    this.interval = window.setInterval(() => this.update(), 1000);
  }

  update() {
    const now = Date.now();
    if (!this.deadline || now >= this.deadline) this.deadline = nextMadridMidnight(now);
    const remaining = Math.ceil((this.deadline - now) / 1000);
    const parts = [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60];
    this.clock.textContent = parts.map(value => String(value).padStart(2, '0')).join(':');
  }

  disconnectedCallback() {
    window.clearInterval(this.interval);
  }
}

if (!customElements.get('nuvel-contador-diario')) {
  customElements.define('nuvel-contador-diario', NuvelDailyTimer);
}
