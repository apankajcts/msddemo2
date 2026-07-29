/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MSD Connect UK section breaks + section metadata.
 *
 * Driven by payload.template.sections (from tools/importer/page-templates.json).
 * Runs in afterTransform only.
 *
 * For each section (processed in reverse document order so inserts do not shift
 * earlier sections):
 *   - If the section has a `style`, append a "Section Metadata" block after the
 *     section's first element.
 *   - If the section is not the first and has content before it, insert an <hr>
 *     section break before the section's first element.
 *
 * Section selectors come from the template, which were derived from the captured
 * DOM (e.g. homepage: #mhh_mcn_content and
 * body > div.site-footer-job-number.site-footer-job-number--above-footer).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) {
      return;
    }

    const doc = element.ownerDocument;

    // Resolve the first matching element for each section, in template order.
    const sectionEls = sections.map((section) => {
      if (!section || !section.selector) return null;
      // Section selectors may be document-rooted (e.g. body > ...); query from
      // the document so those match, then fall back to the main element scope.
      return doc.querySelector(section.selector) || element.querySelector(section.selector);
    });

    // Process in reverse so DOM inserts don't invalidate earlier positions.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = sectionEls[i];
      if (!sectionEl) continue;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metadataBlock);
        }
      }

      // Section break before every non-first section that has content before it.
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
