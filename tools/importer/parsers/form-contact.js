/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form-contact. Base: form (custom, doc-authored).
 * Source: https://www.msdconnect.co.uk/contact-us
 *
 * Emits the block's expected 4-column field table:
 *   | Label | Type | Options / Placeholder | Required |
 * One row per form field, plus a final submit row.
 *
 * Excludes/cleans bot-protection fields: Cloudflare Turnstile and the hidden
 * honeypot field. Turnstile/anti-spam is handled server-side, not authored.
 * Generated: 2026-07-29
 */
export default function parse(element, { document }) {
  const cells = [];

  // Map source gfield type classes to the block's supported field types.
  const typeFromField = (field) => {
    if (field.className.match(/gfield--type-select/) || field.querySelector('select')) return 'select';
    if (field.className.match(/gfield--type-textarea/) || field.querySelector('textarea')) return 'textarea';
    if (field.className.match(/gfield--type-email/)) return 'email';
    if (field.className.match(/gfield--type-tel/)) return 'tel';
    return 'text';
  };

  // Iterate over each form field group, skipping bot/spam fields.
  const fields = Array.from(element.querySelectorAll('.gfield')).filter((field) => {
    const cls = field.className;
    if (/gfield--type-honeypot/.test(cls)) return false; // hidden honeypot
    if (/gfield--type-turnstile/.test(cls)) return false; // Cloudflare Turnstile
    if (/gform_validation_container/.test(cls)) return false; // validation container
    return true;
  });

  fields.forEach((field) => {
    // Label (strip the required asterisk marker text).
    const labelEl = field.querySelector('.gfield_label, label');
    let label = '';
    if (labelEl) {
      const clone = labelEl.cloneNode(true);
      clone.querySelectorAll('.gfield_required').forEach((r) => r.remove());
      label = clone.textContent.trim();
    }
    if (!label) return;

    const type = typeFromField(field);

    // Options (for selects) or placeholder text.
    let optionsOrPlaceholder = '';
    const select = field.querySelector('select');
    if (select) {
      optionsOrPlaceholder = Array.from(select.querySelectorAll('option'))
        .filter((opt) => !opt.classList.contains('gf_placeholder'))
        .map((opt) => opt.textContent.trim())
        .filter(Boolean)
        .join(', ');
    } else {
      // A field description (e.g. the privacy disclaimer) becomes placeholder/help text.
      const desc = field.querySelector('.gfield_description');
      if (desc) optionsOrPlaceholder = desc.textContent.trim();
    }

    // Required flag.
    const required = field.querySelector('.gfield_required') || /gfield_contains_required/.test(field.className)
      ? 'Yes'
      : '';

    cells.push([label, type, optionsOrPlaceholder, required]);
  });

  // Submit button row.
  const submitBtn = element.querySelector('.gform_button, input[type="submit"], button[type="submit"]');
  const submitLabel = (submitBtn && (submitBtn.value || submitBtn.textContent).trim()) || 'Submit';
  cells.push([submitLabel, 'submit', '', '']);

  // Empty-block guard: only the submit row means no real fields were found.
  if (cells.length <= 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-contact', cells });
  element.replaceWith(block);
}
