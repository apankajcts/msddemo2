/**
 * Breadcrumb block.
 * Authored as rows of links plus a final plain-text current-page label, e.g.
 *   | breadcrumb |
 *   | [Home](/) |
 *   | Contact Us |
 * Renders them inline as an ordered breadcrumb trail with caret separators.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const items = rows.map((row) => {
    const link = row.querySelector('a');
    return { link, text: row.textContent.trim() };
  }).filter((i) => i.text);

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    if (item.link) {
      const a = document.createElement('a');
      a.href = item.link.getAttribute('href');
      a.textContent = item.text;
      li.append(a);
    } else {
      li.textContent = item.text;
      li.setAttribute('aria-current', 'page');
    }
    ol.append(li);
    if (i < items.length - 1) {
      const sep = document.createElement('span');
      sep.className = 'breadcrumb-separator';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '›';
      ol.append(sep);
    }
  });

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(ol);
  block.append(nav);
}
