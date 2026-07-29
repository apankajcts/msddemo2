export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (!pic) return;
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // image-hero tile: full-bleed photo behind an overlaid heading caption
        col.classList.add('columns-promo-hero');
      } else {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-promo-img-col');
        }
      }
    });
  });
}
