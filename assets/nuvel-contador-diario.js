class NuvelCountdown extends HTMLElement {
  connectedCallback() {
    const deadline = Number(this.dataset.end) * 1000;
    const timer = this.querySelector('[role="timer"]');
    const tick = () => {
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
