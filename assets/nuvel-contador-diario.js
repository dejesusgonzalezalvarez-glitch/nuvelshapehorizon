const madridDate = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', day: '2-digit', month: '2-digit', year: 'numeric'});
const madridHour = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/Madrid', hour: '2-digit', hourCycle: 'h23'});

function nextMadridMidnight(now) {
  const [day, month, year] = madridDate.format(now).split('/').map(Number);
  const midnightUTC = Date.UTC(year, month - 1, day + 1);
  return midnightUTC - Number(madridHour.format(midnightUTC)) * 3600000;
}

class NuvelCountdown extends HTMLElement {
  connectedCallback() {
    const daily = this.hasAttribute('data-daily');
    let deadline = daily ? nextMadridMidnight(Date.now()) : Number(this.dataset.end) * 1000;
    const timer = this.querySelector('[role="timer"]');
    const tick = () => {
      if (daily && deadline <= Date.now()) deadline = nextMadridMidnight(Date.now());
      const seconds = Math.ceil((deadline - Date.now()) / 1000);
      this.hidden = !Number.isFinite(seconds) || seconds <= 0;
      if (this.hidden) return;
      const days = Math.floor(seconds / 86400);
      const clock = [Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
      timer.textContent = (days ? days + ' d ' : '') + clock.map(n => String(n).padStart(2, '0')).join(':');
      this.timeout = setTimeout(tick, 1000);
    };
    tick();
  }

  disconnectedCallback() {
    clearTimeout(this.timeout);
  }
}

if (!customElements.get('nuvel-contador-diario')) customElements.define('nuvel-contador-diario', NuvelCountdown);
