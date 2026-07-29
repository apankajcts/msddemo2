/*
 * Accordion (therapy) Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-therapy-item-label';
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-therapy-item-body';

    // turn the "Product information" / "Training and resources" resource links
    // into buttons matching the source design (teal primary + outlined secondary)
    body.querySelectorAll('p').forEach((p) => {
      const links = [...p.querySelectorAll('a')];
      const isResourceRow = links.length > 0 && links.every((a) => {
        const t = a.textContent.trim().toLowerCase();
        return t === 'product information' || t === 'training and resources';
      });
      if (!isResourceRow) return;
      p.classList.add('accordion-therapy-resource-row');
      links.forEach((a) => {
        a.classList.add('button');
        if (a.textContent.trim().toLowerCase() === 'training and resources') {
          a.classList.add('secondary');
        }
      });
    });

    // group each product's paragraphs into a card. A new card begins on a
    // paragraph that opens with an emphasised product name (strong/em) and
    // includes a line break — i.e. the product heading + generic name row.
    const isProductStart = (p) => {
      const first = p.firstElementChild;
      const leadsWithName = first && (first.tagName === 'STRONG' || first.tagName === 'EM');
      return leadsWithName && p.querySelector('br');
    };
    const grid = document.createElement('div');
    grid.className = 'accordion-therapy-grid';
    let card = null;
    [...body.children].forEach((child) => {
      if (child.tagName === 'P' && isProductStart(child)) {
        card = document.createElement('div');
        card.className = 'accordion-therapy-card';
        grid.append(card);
      }
      if (card) {
        card.append(child);
      } else {
        // content before the first product (rare) stays in the body directly
        grid.append(child);
      }
    });
    body.append(grid);

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-therapy-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
