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

  // tools/importer/import-hcp-resources.js
  var import_hcp_resources_exports = {};
  __export(import_hcp_resources_exports, {
    default: () => import_hcp_resources_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > picture, :scope > img, picture, img");
    const content = element.querySelector(".mhh-mcn-v1-hero-content") || element;
    const heading = content.querySelector("h1, h2, h3, h4, h5, h6");
    const paragraphs = Array.from(content.querySelectorAll("p")).filter(
      (p) => p.textContent.trim().length
    );
    const links = Array.from(content.querySelectorAll("a")).filter(
      (a) => !a.closest("h1, h2, h3, h4, h5, h6")
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    paragraphs.forEach((p) => contentCell.push(p));
    links.forEach((a) => contentCell.push(a));
    if (contentCell.length) {
      cells.push([contentCell]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-therapy.js
  function parse2(element, { document }) {
    const panels = Array.from(
      element.querySelectorAll(":scope > .mhh-mcn-v1-accordion-molecule")
    );
    const cells = [];
    panels.forEach((panel) => {
      const titleCell = [];
      const titleEl = panel.querySelector(".mhh-mcn-v1-accordion-molecule-header__title");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const iconImg = panel.querySelector(
        ".mhh-mcn-v1-accordion-molecule-header__icon img"
      );
      if (iconImg) titleCell.push(iconImg);
      if (titleText) {
        const heading = document.createElement("h3");
        heading.textContent = titleText;
        titleCell.push(heading);
      }
      const body = panel.querySelector(".mhh-mcn-v1-accordion-molecule-content__body") || panel.querySelector(".mhh-mcn-v1-accordion-molecule-content");
      let contentCell;
      if (body && body.children.length) {
        contentCell = Array.from(body.children);
      } else if (body) {
        contentCell = [body];
      } else {
        contentCell = "";
      }
      if (titleCell.length || Array.isArray(contentCell) && contentCell.length) {
        cells.push([titleCell.length ? titleCell : "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-therapy", cells });
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

  // tools/importer/import-hcp-resources.js
  var parsers = {
    "hero-banner": parse,
    "accordion-therapy": parse2
  };
  var PAGE_TEMPLATE = {
    name: "hcp-resources",
    description: "Healthcare Professional Resources page with breadcrumbs, intro, and therapy-area accordion",
    urls: [
      "https://www.msdconnect.co.uk/hcp-resources"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "#mhh_mcn_main section.mhh-mcn-v1-hero",
          ".mhh-mcn-v1-hero"
        ]
      },
      {
        name: "accordion-therapy",
        instances: [
          "#mhh_mcn_main .mhh-mcn-v1-accordion",
          ".mhh-mcn-v1-accordion"
        ]
      }
    ],
    sections: [
      {
        id: "rc4",
        name: "Main Content",
        selector: "#mhh_mcn_content",
        style: null,
        blocks: ["hero-banner", "accordion-therapy"],
        defaultContent: ["#mhh_mcn_main p.mhh-mcn-v1-paragraph--8c5a5356ee9bdf2b563ddc4b9b1a4c27"]
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
  var import_hcp_resources_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
  return __toCommonJS(import_hcp_resources_exports);
})();
