import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    if (nav && nav.getAttribute('aria-expanded') === 'true') {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
    }
  }
}

/**
 * Toggles the primary nav panel open/closed.
 * @param {Element} nav The nav element
 * @param {Boolean} forceExpanded Optional forced state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? forceExpanded
    : nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const toggle = nav.querySelector('.nav-menu-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    toggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  }
  if (expanded) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // brand: unwrap boilerplate button styling on the logo link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = '';
      const container = brandLink.closest('.button-container');
      if (container) container.className = '';
    }
  }

  // MENU toggle button (drives the primary nav panel at all viewports)
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-menu-toggle';
  toggle.setAttribute('aria-controls', 'nav');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.innerHTML = '<span class="nav-menu-toggle-label"></span>';
  toggle.addEventListener('click', () => toggleMenu(nav));

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // place the toggle in the primary bar, after the brand
    if (navBrand) navBrand.after(toggle);
    else nav.prepend(toggle);
    // close the panel after a nav link is followed
    navSections.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleMenu(nav, false));
    });
  }

  nav.setAttribute('aria-expanded', 'false');

  // close the panel and reset the toggle when crossing the mobile/desktop breakpoint
  const bp = window.matchMedia('(min-width: 600px)');
  bp.addEventListener('change', () => {
    if (nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
