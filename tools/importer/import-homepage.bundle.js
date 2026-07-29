/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-promo.js
  function parse(element, { document }) {
    const inner = element.querySelector(":scope > .mhh-mcn-columns-inner") || element;
    let columns = Array.from(inner.querySelectorAll(":scope > .mhh-mcn-v1-column")).filter(
      (col) => !col.querySelector(":scope > .mhh-mcn-columns")
    );
    if (!columns.length) {
      columns = Array.from(inner.children).filter(
        (col) => !col.querySelector(":scope > .mhh-mcn-columns")
      );
    }
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const cellContent = [];
      const img = col.querySelector("img");
      if (img) cellContent.push(img);
      const heading = col.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) cellContent.push(heading);
      const paragraphs = Array.from(col.querySelectorAll("p"));
      paragraphs.forEach((p) => cellContent.push(p));
      const links = Array.from(col.querySelectorAll("a")).filter(
        (a) => !a.closest("h1, h2, h3, h4, h5, h6")
      );
      links.forEach((a) => cellContent.push(a));
      row.push(cellContent.length ? cellContent : "");
    });
    if (!row.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-values.js
  function parse2(element, { document }) {
    const inner = element.querySelector(":scope > .mhh-mcn-columns-inner") || element;
    let columns = Array.from(inner.querySelectorAll(":scope > .mhh-mcn-v1-column"));
    if (!columns.length) {
      columns = Array.from(inner.children);
    }
    const row = [];
    columns.forEach((col) => {
      const cellContent = [];
      const heading = col.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) cellContent.push(heading);
      Array.from(col.querySelectorAll("p")).forEach((p) => cellContent.push(p));
      const figure = col.querySelector("figure");
      const img = col.querySelector("img");
      if (figure) {
        cellContent.push(figure);
      } else if (img) {
        cellContent.push(img);
      }
      row.push(cellContent.length ? cellContent : "");
    });
    if (!row.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-values", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/msdconnect-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#ot-sdk-btn-floating",
        '[id^="ot-sdk-"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cf-turnstile",
        '[id^="cf-turnstile"]',
        '[id^="cf-chl-widget"]',
        ".gfield--type-honeypot",
        ".gform_validation_container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#mconnect-theme-banner-container",
        '[id^="announcement-markup"]',
        '[id^="mconnect-announcement"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.site-header",
        "#site-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".top-railing",
        "nav.breadcrumb",
        "#breadcrumbs",
        "#breadcrumb-dropdown"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#a11y-speak-intro-text",
        "#a11y-speak-assertive",
        "#a11y-speak-polite",
        ".a11y-speak-region"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "script",
        "style",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/msdconnect-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) {
        return;
      }
      const doc = element.ownerDocument;
      const sectionEls = sections.map((section) => {
        if (!section || !section.selector) return null;
        return doc.querySelector(section.selector) || element.querySelector(section.selector);
      });
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = sectionEls[i];
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metadataBlock);
          }
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-promo": parse,
    "columns-values": parse2
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "MSD Connect UK homepage with hero, resource/about promo articles, values section and figure",
    urls: [
      "https://www.msdconnect.co.uk/"
    ],
    blocks: [
      {
        name: "columns-promo",
        instances: [
          ".mhh-mcn-v1-columns--9b8b696fbefb89785698d8442c3ce7d4",
          ".mhh-mcn-v1-columns--2b071bc3bac2805952cb91eb1596182b"
        ]
      },
      {
        name: "columns-values",
        instances: [
          ".mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428"
        ]
      },
      {
        name: "section-values",
        instances: [
          ".mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428"
        ],
        section: "pale-teal"
      }
    ],
    sections: [
      {
        id: "rc3",
        name: "Main Content",
        selector: "#mhh_mcn_content",
        style: null,
        blocks: ["columns-promo", "columns-values"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Job Number",
        selector: "body > div.site-footer-job-number.site-footer-job-number--above-footer",
        style: null,
        blocks: [],
        defaultContent: ["body > div.site-footer-job-number.site-footer-job-number--above-footer"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const band1 = document.querySelector(".mhh-mcn-v1-columns--9b8b696fbefb89785698d8442c3ce7d4");
      if (band1) {
        const nestedSelector = ".mhh-mcn-v1-columns--2b071bc3bac2805952cb91eb1596182b, .mhh-mcn-v1-columns--9b0cd5d9f091b59d976b708c61980428";
        let anchor = band1;
        Array.from(band1.querySelectorAll(nestedSelector)).forEach((nested) => {
          const wrapperCol = nested.closest(".mhh-mcn-v1-column");
          anchor.after(nested);
          anchor = nested;
          if (wrapperCol && wrapperCol.parentNode && !wrapperCol.querySelector("img, h1, h2, h3, h4, h5, h6, p, a")) {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
