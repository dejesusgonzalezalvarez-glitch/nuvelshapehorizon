class NuvelPackCompra extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('[data-add-pack]');
    if (!this.button) return;
    this.selects = Array.from(this.querySelectorAll('select'));
    this.money = new Intl.NumberFormat(this.dataset.locale || 'es-ES', {
      style: 'currency', currency: this.dataset.currency || 'EUR',
    });
    this.addEventListener('change', this.updateTotal);
    this.button.addEventListener('click', this.addPack);
    this.button.disabled = false;
    this.updateTotal();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.updateTotal);
    this.button?.removeEventListener('click', this.addPack);
  }

  updateTotal = () => {
    const cents = this.selects.reduce((sum, select) => sum + Number(select.selectedOptions[0].dataset.price), 0);
    this.querySelector('[data-total]').textContent = this.money.format(cents / 100);
  };

  addPack = async () => {
    if (this.button.disabled) return;
    this.button.disabled = true;
    const status = this.querySelector('[role="status"]');
    status.textContent = 'Añadiendo el pack…';
    const quantities = new Map();
    for (const { value } of this.selects) quantities.set(value, (quantities.get(value) || 0) + 1);
    const items = Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
    try {
      const response = await fetch(this.dataset.add, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.description || 'Comprueba las tallas y las unidades disponibles.');
      }
      window.location.assign(this.dataset.cart);
    } catch (error) {
      status.textContent = error instanceof TypeError ? 'Comprueba tu conexión y revisa el carrito antes de repetir.' : error.message;
      this.button.disabled = false;
    }
  };
}

if (!customElements.get('nuvel-pack-compra')) customElements.define('nuvel-pack-compra', NuvelPackCompra);
