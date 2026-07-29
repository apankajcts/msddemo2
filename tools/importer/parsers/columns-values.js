/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-values. Base: columns.
 * Source: https://www.msdconnect.co.uk/
 * Two-column text-beside-image band (heading + paragraph beside a photo).
 * Generated: 2026-07-29
 */
export default function parse(element, { document }) {
  const inner = element.querySelector(':scope > .mhh-mcn-columns-inner') || element;

  // Direct-child columns become the block's columns (cells in one row).
  let columns = Array.from(inner.querySelectorAll(':scope > .mhh-mcn-v1-column'));
  if (!columns.length) {
    columns = Array.from(inner.children);
  }

  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Heading (values title).
    const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) cellContent.push(heading);

    // Body paragraph(s).
    Array.from(col.querySelectorAll('p')).forEach((p) => cellContent.push(p));

    // Image — prefer the full figure so caption/wrapper is preserved, else raw img.
    const figure = col.querySelector('figure');
    const img = col.querySelector('img');
    if (figure) {
      cellContent.push(figure);
    } else if (img) {
      cellContent.push(img);
    }

    row.push(cellContent.length ? cellContent : '');
  });

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-values', cells });
  element.replaceWith(block);
}
