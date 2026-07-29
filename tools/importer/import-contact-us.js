/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import formContactParser from './parsers/form-contact.js';
import heroBannerParser from './parsers/hero-banner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/msdconnect-cleanup.js';
import sectionsTransformer from './transformers/msdconnect-sections.js';

// PARSER REGISTRY
const parsers = {
  'form-contact': formContactParser,
  'hero-banner': heroBannerParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'contact-us',
  description: 'Contact Us page with breadcrumbs, intro, and contact form with side content columns',
  urls: [
    'https://www.msdconnect.co.uk/contact-us',
  ],
  blocks: [
    {
      name: 'form-contact',
      instances: [
        '#mhh_mcn_main .gform_wrapper',
        '#gform_wrapper_22',
        '.gform_wrapper',
      ],
    },
    {
      name: 'hero-banner',
      instances: [
        '#mhh_mcn_main section.mhh-mcn-v1-hero',
        '.mhh-mcn-v1-hero',
      ],
    },
  ],
  sections: [
    {
      id: 'rc4',
      name: 'Main Content',
      selector: '#mhh_mcn_content',
      style: null,
      blocks: ['form-contact', 'hero-banner'],
      defaultContent: [
        '#mhh_mcn_main > h1',
        '#mhh_mcn_main > p.mhh-mcn-v1-paragraph--eda8279a005678b631514239ba44d5cc',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name, selector, element, section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index';
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
