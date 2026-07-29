/**
 * Contact form block (doc-authored).
 *
 * Expected initial content structure: a table where each subsequent row after
 * the block-name row describes one field:
 *   | Label | Type | Options / Placeholder | Required |
 *
 * Supported types: text, email, tel, textarea, select, submit.
 * For `select`, the third cell holds a comma-separated list of options.
 * For other fields, the third cell (if present) is used as a placeholder or,
 * for the submit row, help/disclaimer text can be placed in the field above it.
 *
 * Note: this block intentionally does NOT implement any bot/CAPTCHA challenge
 * (e.g. Cloudflare Turnstile). Anti-spam is expected to be handled server-side.
 *
 * @param {Element} block The block element
 */
function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createField(cells) {
  const label = (cells[0]?.textContent || '').trim();
  const type = (cells[1]?.textContent || 'text').trim().toLowerCase();
  const optionsRaw = (cells[2]?.textContent || '').trim();
  const required = /^(y|yes|true|required|\*)$/i.test((cells[3]?.textContent || '').trim());
  const name = slugify(label) || `field-${type}`;
  const id = `form-contact-${name}`;

  // Submit / button row renders a button, not a labelled field.
  if (type === 'submit' || type === 'button') {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-contact-field form-contact-field-submit';
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'button form-contact-submit';
    button.textContent = label || 'Submit';
    wrapper.append(button);
    return wrapper;
  }

  const wrapper = document.createElement('div');
  wrapper.className = `form-contact-field form-contact-field-${type}`;

  const labelEl = document.createElement('label');
  labelEl.className = 'form-contact-label';
  labelEl.setAttribute('for', id);
  labelEl.textContent = label;
  if (required) {
    const req = document.createElement('span');
    req.className = 'form-contact-required';
    req.setAttribute('aria-hidden', 'true');
    req.textContent = '*';
    labelEl.append(req);
  }
  wrapper.append(labelEl);

  let input;
  if (type === 'select') {
    input = document.createElement('select');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select:';
    input.append(placeholder);
    optionsRaw
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
      .forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        input.append(option);
      });
  } else if (type === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 6;
    // For textareas the third cell holds a disclaimer rendered as help text
    // below the field (not a placeholder), matching the source design.
  } else {
    input = document.createElement('input');
    input.type = ['email', 'tel'].includes(type) ? type : 'text';
    if (optionsRaw) input.placeholder = optionsRaw;
  }

  input.id = id;
  input.name = name;
  input.className = 'form-contact-input';
  if (required) input.required = true;
  wrapper.append(input);

  // Help / disclaimer text rendered below the field:
  // for textareas the third cell holds the disclaimer; for other field types a
  // trailing paragraph in the label cell is treated as field help text.
  const trailingP = cells[0]?.querySelector('p:not(:first-child)');
  let helpText = '';
  if (type === 'textarea') {
    helpText = optionsRaw;
  } else if (trailingP) {
    helpText = trailingP.textContent.trim();
  }
  if (helpText) {
    const helpEl = document.createElement('p');
    helpEl.className = 'form-contact-help';
    helpEl.textContent = helpText;
    wrapper.append(helpEl);
  }

  return wrapper;
}

export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');
  form.className = 'form-contact-form';
  form.setAttribute('novalidate', '');

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    form.append(createField(cells));
  });

  block.textContent = '';
  block.append(form);

  form.addEventListener('submit', (e) => {
    // Client-side guard only; real submission wiring is project-specific.
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
    }
  });
}
