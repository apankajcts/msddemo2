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

  // tools/importer/import-contact-us.js
  var import_contact_us_exports = {};
  __export(import_contact_us_exports, {
    default: () => import_contact_us_default
  });

  // tools/importer/parsers/form-contact.js
  function parse(element, { document }) {
    const cells = [];
    const typeFromField = (field) => {
      if (field.className.match(/gfield--type-select/) || field.querySelector("select")) return "select";
      if (field.className.match(/gfield--type-textarea/) || field.querySelector("textarea")) return "textarea";
      if (field.className.match(/gfield--type-email/)) return "email";
      if (field.className.match(/gfield--type-tel/)) return "tel";
      return "text";
    };
    const fields = Array.from(element.querySelectorAll(".gfield")).filter((field) => {
      const cls = field.className;
      if (/gfield--type-honeypot/.test(cls)) return false;
      if (/gfield--type-turnstile/.test(cls)) return false;
      if (/gform_validation_container/.test(cls)) return false;
      return true;
    });
    fields.forEach((field) => {
      const labelEl = field.querySelector(".gfield_label, label");
      let label = "";
      if (labelEl) {
        const clone = labelEl.cloneNode(true);
        clone.querySelectorAll(".gfield_required").forEach((r) => r.remove());
        label = clone.textContent.trim();
      }
      if (!label) return;
      const type = typeFromField(field);
      let optionsOrPlaceholder = "";
      const select = field.querySelector("select");
      if (select) {
        optionsOrPlaceholder = Array.from(select.querySelectorAll("option")).filter((opt) => !opt.classList.contains("gf_placeholder")).map((opt) => opt.textContent.trim()).filter(Boolean).join(", ");
      } else {
        const desc = field.querySelector(".gfield_description");
        if (desc) optionsOrPlaceholder = desc.textContent.trim();
      }
      const required = field.querySelector(".gfield_required") || /gfield_contains_required/.test(field.className) ? "Yes" : "";
      cells.push([label, type, optionsOrPlaceholder, required]);
    });
    const submitBtn = element.querySelector('.gform_button, input[type="submit"], button[type="submit"]');
    const submitLabel = submitBtn && (submitBtn.value || submitBtn.textContent).trim() || "Submit";
    cells.push([submitLabel, "submit", "", ""]);
    if (cells.length <= 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse2(element, { document }) {
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

  // tools/importer/import-contact-us.js
  var parsers = {
    "form-contact": parse,
    "hero-banner": parse2
  };
  var PAGE_TEMPLATE = {
    name: "contact-us",
    description: "Contact Us page with breadcrumbs, intro, and contact form with side content columns",
    urls: [
      "https://www.msdconnect.co.uk/contact-us"
    ],
    blocks: [
      {
        name: "form-contact",
        instances: [
          "#mhh_mcn_main .gform_wrapper",
          "#gform_wrapper_22",
          ".gform_wrapper"
        ]
      },
      {
        name: "hero-banner",
        instances: [
          "#mhh_mcn_main section.mhh-mcn-v1-hero",
          ".mhh-mcn-v1-hero"
        ]
      }
    ],
    sections: [
      {
        id: "rc4",
        name: "Main Content",
        selector: "#mhh_mcn_content",
        style: null,
        blocks: ["form-contact", "hero-banner"],
        defaultContent: [
          "#mhh_mcn_main > h1",
          "#mhh_mcn_main > p.mhh-mcn-v1-paragraph--eda8279a005678b631514239ba44d5cc"
        ]
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
  var import_contact_us_default = {
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
  return __toCommonJS(import_contact_us_exports);
})();
