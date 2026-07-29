export default function decorate(block) {
  // If an author provides a picture, render it as the banner image (contact-us
  // side banner). Otherwise the block falls back to its CSS background image
  // used by the full-width hero (hcp-resources).
  const picture = block.querySelector(':scope > div picture');
  if (picture) {
    block.classList.add('has-image');
  }
}
