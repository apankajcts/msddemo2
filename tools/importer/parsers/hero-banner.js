/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.msdconnect.co.uk/hcp-resources (also /contact-us)
 * Full-bleed background image with an overlaid heading.
 * Block structure (1 column):
 *   Row 2: background image (optional)
 *   Row 3: title / subheading / CTA (optional)
 * Generated: 2026-07-29
 */
export default function parse(element, { document }) {
  // Background image (source uses a raw <img>; support <picture> too).
  const bgImage = element.querySelector(':scope > picture, :scope > img, picture, img');

  // Overlaid content lives in the hero content article.
  const content = element.querySelector('.mhh-mcn-v1-hero-content') || element;

  // Heading (title). Prefer a real heading; the source may only carry a
  // styled paragraph as its title.
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');

  // Subheading / body text — paragraphs that actually carry text.
  const paragraphs = Array.from(content.querySelectorAll('p')).filter(
    (p) => p.textContent.trim().length,
  );

  // CTA link(s) not already inside a heading.
  const links = Array.from(content.querySelectorAll('a')).filter(
    (a) => !a.closest('h1, h2, h3, h4, h5, h6'),
  );

  const cells = [];

  // Row 2: background image (only if present).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: overlaid content (heading + text + CTA), all in one cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  paragraphs.forEach((p) => contentCell.push(p));
  links.forEach((a) => contentCell.push(a));
  if (contentCell.length) {
    cells.push([contentCell]);
  }

  // Empty-block guard: nothing meaningful to emit.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
