/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.msdconnect.co.uk/
 * Two-column promotional band mixing an image hero tile and a text+CTA card.
 * Generated: 2026-07-29
 */
export default function parse(element, { document }) {
  // The inner wrapper holds the direct-child columns for this band.
  const inner = element.querySelector(':scope > .mhh-mcn-columns-inner') || element;

  // Direct-child columns become the block's columns (cells in one row).
  // Exclude columns that merely wrap a nested columns block (those are
  // separate blocks — a second promo band or a values band — and must not be
  // pulled into this instance).
  let columns = Array.from(inner.querySelectorAll(':scope > .mhh-mcn-v1-column')).filter(
    (col) => !col.querySelector(':scope > .mhh-mcn-columns'),
  );

  // Fallback: if the expected column markup is absent, use direct children.
  if (!columns.length) {
    columns = Array.from(inner.children).filter(
      (col) => !col.querySelector(':scope > .mhh-mcn-columns'),
    );
  }

  // Build one cell per column, preserving its inner content (image, heading,
  // paragraph, CTA links). Extract the meaningful content nodes from each column.
  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Image (hero background / figure image).
    const img = col.querySelector('img');
    if (img) cellContent.push(img);

    // Heading (may wrap a link).
    const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) cellContent.push(heading);

    // Body paragraph(s).
    const paragraphs = Array.from(col.querySelectorAll('p'));
    paragraphs.forEach((p) => cellContent.push(p));

    // CTA link(s) that are not already inside a heading.
    const links = Array.from(col.querySelectorAll('a')).filter(
      (a) => !a.closest('h1, h2, h3, h4, h5, h6'),
    );
    links.forEach((a) => cellContent.push(a));

    row.push(cellContent.length ? cellContent : '');
  });

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
