import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment (localhost/aem up first, then DA/EDS production)
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag the sections read from the content fragment so CSS can lay them out.
  // Order matches content/footer.plain.html: nav links, brand logos, legal, AE notice.
  const sectionClasses = ['footer-nav', 'footer-logos', 'footer-legal', 'footer-ae'];
  [...footer.children].forEach((section, i) => {
    if (sectionClasses[i]) section.classList.add(sectionClasses[i]);
  });

  block.append(footer);
}
