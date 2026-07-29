export default function decorate(block) {
  // Hero banner uses a CSS background image (no authored inline image).
  // If an author does provide a picture in the first cell, treat it as the
  // background layer; otherwise the block relies on its CSS background.
  const picture = block.querySelector(':scope > div:first-child picture');
  if (picture) {
    block.classList.add('has-image');
  }
}
