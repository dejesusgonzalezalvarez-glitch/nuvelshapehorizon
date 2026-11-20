const controls = 'button, a[href], summary, [role="button"]';
const guideLabel = /^(?:(?:ver|abrir|consultar|ampliar) (?:la )?)?gu[ií]a de tallas?$/i;

function removeGuideControls(section) {
  if (!section.querySelector('.nuvel-size-guide img')) return;
  for (const control of section.querySelectorAll(controls)) {
    const label = (control.getAttribute('aria-label') || control.textContent).trim();
    if (!guideLabel.test(label)) continue;
    if (control.matches('summary') && control.parentElement.matches('details')) {
      control.parentElement.open = true;
    }
    control.style.display = 'none';
  }
}

function initialise(root) {
  for (const guide of root.querySelectorAll('.nuvel-size-guide')) {
    const section = guide.closest('.shopify-section');
    if (!section || section.dataset.nuvelGuideReady) continue;
    section.dataset.nuvelGuideReady = 'true';
    removeGuideControls(section);
    new MutationObserver(() => removeGuideControls(section))
      .observe(section, { childList: true, subtree: true });
  }
}

initialise(document);
document.addEventListener('shopify:section:load', event => initialise(event.target));
