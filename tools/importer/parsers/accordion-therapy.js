/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-therapy. Base: accordion.
 * Source: https://www.msdconnect.co.uk/hcp-resources
 * Expandable therapy-area panels. Each panel becomes a 2-cell row:
 *   Title cell   (mandatory) — therapy-area label (optionally with leading icon)
 *   Content cell (mandatory) — product grid / rich default content
 * Generated: 2026-07-29
 */
export default function parse(element, { document }) {
  // Each accordion panel is a molecule section.
  const panels = Array.from(
    element.querySelectorAll(':scope > .mhh-mcn-v1-accordion-molecule'),
  );

  const cells = [];

  panels.forEach((panel) => {
    // --- Title cell ---
    const titleCell = [];
    const titleEl = panel.querySelector('.mhh-mcn-v1-accordion-molecule-header__title');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Preserve the leading therapy-area icon, if present.
    const iconImg = panel.querySelector(
      '.mhh-mcn-v1-accordion-molecule-header__icon img',
    );
    if (iconImg) titleCell.push(iconImg);

    if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      titleCell.push(heading);
    }

    // --- Content cell ---
    const body = panel.querySelector('.mhh-mcn-v1-accordion-molecule-content__body')
      || panel.querySelector('.mhh-mcn-v1-accordion-molecule-content');

    let contentCell;
    if (body && body.children.length) {
      contentCell = Array.from(body.children);
    } else if (body) {
      contentCell = [body];
    } else {
      contentCell = '';
    }

    // Only emit rows that have a title (mandatory) or content.
    if (titleCell.length || (Array.isArray(contentCell) && contentCell.length)) {
      cells.push([titleCell.length ? titleCell : '', contentCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-therapy', cells });
  element.replaceWith(block);
}
