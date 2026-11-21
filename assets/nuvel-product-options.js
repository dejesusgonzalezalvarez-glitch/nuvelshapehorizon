const palette = [
  ['Negro', '#1d1d1f', /\b(black|negro)\b/i],
  ['Beige', '#d9c7b0', /\b(skin(?:tone)?|beige|nude)\b/i],
  ['Marrón', '#7a5a43', /\b(brown|marrón)\b/i],
  ['Rosa', '#e8b4bc', /\b(pink|rosa)\b/i],
  ['Gris', '#9a9a9a', /\b(gr[ae]y|gris)\b/i],
];
const sizeOrder = ['XXS','XS','S','M','L','XL','XXL','2XL','XXXL','3XL','4XL','5XL','6XL'];

class NuvelProductOptions extends HTMLElement {
  static serial = 0;
  instance = ++NuvelProductOptions.serial;
  connectedCallback() {
    this.observer = new MutationObserver(records => {
      if (records.some(r => !this.querySelector('[data-options-ui]')?.contains(r.target))) this.draw();
    });
    this.observer.observe(this, {subtree:true, childList:true, attributes:true, attributeFilter:['selected','disabled']});
    this.draw();
  }
  disconnectedCallback() { this.observer.disconnect(); }

  draw() {
    const select = this.querySelector('select');
    const ui = this.querySelector('[data-options-ui]');
    if (!select || !ui) return;
    const items = Array.from(select.options, option => {
      const raw = option.dataset.raw;
      const color = palette.find(entry => entry[2].test(raw));
      const lot = raw.match(/\b(\d+)\s*(?:sujetador(?:es)?|pcs?)\b/i);
      return {option, color:color?.[0] || raw, hex:color?.[1], size:option.dataset.size, lot:option.dataset.lot || lot?.[1] || '1'};
    });
    const current = items.find(item => item.option.selected) || items[0];
    if (!current) return;
    const focusKey = ui.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    ui.replaceChildren();
    this.querySelector('[data-fallback]').hidden = true;
    const group = (label, values, selected, match, colorGroup=false) => {
      const box = document.createElement('div');
      box.className = 'nv-group';
      box.setAttribute('role','radiogroup');
      box.setAttribute('aria-label',label);
      const heading = document.createElement('div');
      heading.className = 'nv-heading';
      heading.textContent = label;
      if ((label === 'Talla' && current.color && !this.hasAttribute('data-hide-color')) || colorGroup) {
        const color = document.createElement('span');
        color.textContent = colorGroup ? current.color : 'Color: ' + current.color;
        heading.append(color);
      }
      box.append(heading);
      for (const value of values) {
        const candidates = items.filter(item => match(item,value) && !item.option.disabled);
        const next = candidates.find(item => item.size === current.size && item.color === current.color)
          || candidates.find(item => item.size === current.size) || candidates[0];
        const wrap = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'nuvel-' + this.instance + '-' + label;
        input.checked = value === selected;
        input.disabled = !next;
        input.dataset.key = label + '/' + value;
        input.setAttribute('aria-label',value);
        const face = document.createElement('span');
        face.className = 'nv-chip';
        const hex = colorGroup && items.find(item => item.color === value)?.hex;
        if (hex) { face.className = 'nv-swatch'; face.style.backgroundColor = hex; }
        else face.textContent = value;
        input.addEventListener('change', event => {
          event.stopPropagation();
          select.value = next.option.value;
          select.dispatchEvent(new Event('change',{bubbles:true}));
          this.draw();
        });
        wrap.append(input,face);
        box.append(wrap);
      }
      ui.append(box);
    };
    const lots = [...new Set(items.map(item => item.lot))];
    if (lots.length > 1) group('Unidades',lots,current.lot,(item,v) => item.lot === v);
    const subset = items.filter(item => item.lot === current.lot);
    const colors = [...new Set(subset.map(item => item.color))];
    if (colors.length > 1) group('Color',colors,current.color,(item,v) => item.lot === current.lot && item.color === v,true);
    const sizes = [...new Set(subset.map(item => item.size))].sort((a,b) => (sizeOrder.includes(a)?sizeOrder.indexOf(a):99)-(sizeOrder.includes(b)?sizeOrder.indexOf(b):99));
    group('Talla',sizes,current.size,(item,v) => item.lot === current.lot && item.color === current.color && item.size === v);
    if (focusKey) Array.from(ui.querySelectorAll('input')).find(el => el.dataset.key === focusKey)?.focus({preventScroll:true});
  }
}
if (!customElements.get('nuvel-product-options')) customElements.define('nuvel-product-options', NuvelProductOptions);

class NuvelPackAction extends HTMLElement {
  connectedCallback() {
    this.addEventListener('change', this.refresh);
    this.addEventListener('submit', this.submit);
    this.refresh();
  }
  disconnectedCallback() {
    this.removeEventListener('change', this.refresh);
    this.removeEventListener('submit', this.submit);
  }
  refresh = () => {
    const choice = this.querySelector('input[type=radio]:checked');
    if (!choice) return;
    const group = choice.closest('[data-component-pack]');
    if (group) {
      const cents = Array.from(group.querySelectorAll('select')).reduce((sum,s) => sum + Number(s.selectedOptions[0].dataset.price),0);
      const money = new Intl.NumberFormat('es-ES',{style:'currency',currency:this.querySelector('form').dataset.currency || 'EUR'});
      choice.dataset.price = money.format(cents / 100);
      group.querySelector('[data-unit]').textContent = choice.dataset.price;
    }
    const needsOptions = choice.hasAttribute('data-options');
    this.querySelector('label:has([name=quantity])').hidden = needsOptions;
    this.querySelector('button[type=submit]').textContent =
      (needsOptions ? 'Elegir opciones' : 'Añadir al carrito') + ' · ' + choice.dataset.price;
  };
  submit = async event => {
    const choice = this.querySelector('input[type=radio]:checked');
    if (choice?.hasAttribute('data-component')) {
      event.preventDefault();
      const form = this.querySelector('form');
      const button = form.querySelector('button[type=submit]');
      if (button.disabled) return;
      button.disabled = true;
      const quantities = new Map();
      for (const field of choice.closest('[data-component-pack]').querySelectorAll('select')) {
        quantities.set(field.value,(quantities.get(field.value)||0)+Number(form.elements.quantity.value));
      }
      try {
        const response = await fetch(form.action+'.js',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({items:Array.from(quantities,([id,quantity])=>({id,quantity}))})});
        if (!response.ok) throw Error('Comprueba las tallas y la disponibilidad del pack.');
        location.assign(form.dataset.cart);
      } catch (error) {form.querySelector('[role=status]').textContent=error.message; button.disabled=false;}
      return;
    }
    if (choice?.hasAttribute('data-options')) {
      event.preventDefault();
      location.assign(choice.dataset.url);
    }
  };
}
if (!customElements.get('nuvel-pack-action')) customElements.define('nuvel-pack-action', NuvelPackAction);