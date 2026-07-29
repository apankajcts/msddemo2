/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsPromoParser from './parsers/columns-promo.js';
import columnsValuesParser from './parsers/columns-values.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/msdconnect-cleanup.js';
import sectionsTransformer from './transformers/msdconnect-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-promo': columnsPromoParser,
  'columns-values': columnsValuesParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'MSD Connect UK homepage with hero, resource/about promo articles, values section and figure',
  urls: [
    'https://www.msdconnect.co.uk/',
  ],
  blocks: [
    {
      name: 'columns-promo',
      instances: [
        '.mhh-mcn-v1-columns--9b8b696fbefb89785698d8442c3ce7d4',
        '.mhh-mcn-v1-columns--2b071bc3bac2805952cb91eb1596182b',
      ],
    },
    {
      name: 'columns-values',
      instances: [
        '.mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428',
      ],
    },
    {
      name: 'section-values',
      instances: [
        '.mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428',
      ],
      section: 'pale-teal',
    },
  ],
  sections: [
    {
      id: 'rc3',
      name: 'Main Content',
      selector: '#mhh_mcn_content',
      style: null,
      blocks: ['columns-promo', 'columns-values'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'Job Number',
      selector: 'body > div.site-footer-job-number.site-footer-job-number--above-footer',
      style: null,
      blocks: [],
      defaultContent: ['body > div.site-footer-job-number.site-footer-job-number--above-footer'],
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

    // Un-nest homepage promotional bands. In the source, band 2 (columns-promo)
    // and band 3 (columns-values) are authored as columns nested INSIDE band 1.
    // Replacing band 1 in place would destroy them, so hoist each nested band to
    // be a sibling right after band 1 (preserving top-to-bottom order) and drop
    // the now-empty wrapper column it lived in.
    const band1 = document.querySelector('.mhh-mcn-v1-columns--9b8b696fbefb89785698d8442c3ce7d4');
    if (band1) {
      const nestedSelector = '.mhh-mcn-v1-columns--2b071bc3bac2805952cb91eb1596182b, .mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428';
      let anchor = band1;
      Array.from(band1.querySelectorAll(nestedSelector)).forEach((nested) => {
        const wrapperCol = nested.closest('.mhh-mcn-v1-column');
        anchor.after(nested);
        anchor = nested;
        if (wrapperCol && wrapperCol.parentNode
          && !wrapperCol.querySelector('img, h1, h2, h3, h4, h5, h6, p, a')) {
          wrapperCol.remove();
        }
      });
    }

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
