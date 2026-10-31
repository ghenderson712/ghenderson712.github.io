"use strict";
(() => {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page && !link.hasAttribute('aria-current')) link.setAttribute('aria-current', 'page');
  });
  const button = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (!button || !nav) return;
  document.documentElement.classList.add('has-menu');
  button.hidden = false;
  const close = () => { nav.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') { close(); button.focus(); }
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
})();
