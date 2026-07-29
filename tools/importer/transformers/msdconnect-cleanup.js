/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: MSD Connect UK site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content living under #mhh_mcn_content / #mhh_mcn_main.
 *
 * All selectors are taken from the captured DOM of the three migrated pages:
 *   - migration-work/cleaned.html (contact-us)
 *   - migration-work/pages/homepage/cleaned.html
 *   - migration-work/pages/hcp-resources/cleaned.html
 *
 * NOTE: div.site-footer-job-number (the regulatory job-number line) is
 * intentionally NOT removed — per page-structure.json it is kept as default
 * content (homepage rc4, contact-us rc5).
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent / OneTrust dialog and floating settings button.
    //   Found: <div id="onetrust-consent-sdk">, <div id="ot-sdk-btn-floating">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#ot-sdk-btn-floating',
      '[id^="ot-sdk-"]',
    ]);

    // Cloudflare Turnstile challenge + hidden honeypot form field (contact-us).
    //   Found: <div class="cf-turnstile" id="cf-turnstile_22">,
    //          <div class="gfield gfield--type-honeypot ...">
    WebImporter.DOMUtils.remove(element, [
      '.cf-turnstile',
      '[id^="cf-turnstile"]',
      '[id^="cf-chl-widget"]',
      '.gfield--type-honeypot',
      '.gform_validation_container',
    ]);

    // Empty dynamic announcement banner injection point + hidden announcement
    // markup (numeric suffix varies per page: 67902 / 29215).
    //   Found: <div id="mconnect-theme-banner-container">,
    //          <div id="announcement-markup-67902">, <div id="announcement-markup-29215">
    // The "MSDConnect HCP Disclaimer" gate (post_id 67902: "Are you a UK
    // Healthcare Professional?" + Yes/No buttons) is a WordPress announcement
    // modal that JS renders into <div id="mconnect-announcement-<id>"> at
    // runtime. Remove both the source markup and the rendered modal containers.
    WebImporter.DOMUtils.remove(element, [
      '#mconnect-theme-banner-container',
      '[id^="announcement-markup"]',
      '[id^="mconnect-announcement"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Shared header / primary + top nav (handled by nav orchestrator separately).
    //   Found: <header class="site-header ...">
    // Shared footer (handled by footer orchestrator separately). The footer also
    // contains the "Cookie Preferences" (.ot-sdk-show-settings) menu item, so
    // removing the footer removes it too.
    //   Found: <footer id="site-footer" class="site-footer ...">
    WebImporter.DOMUtils.remove(element, [
      'header.site-header',
      '#site-footer',
    ]);

    // Breadcrumb decoration / top railing (excluded per analysis, auto-generated).
    //   Found: <div class="top-railing">, <nav class="breadcrumb" id="breadcrumbs">,
    //          <div id="breadcrumb-dropdown">
    WebImporter.DOMUtils.remove(element, [
      '.top-railing',
      'nav.breadcrumb',
      '#breadcrumbs',
      '#breadcrumb-dropdown',
    ]);

    // Accessibility live-region / notification scaffolding (non-authorable).
    //   Found: <p id="a11y-speak-intro-text">, <div id="a11y-speak-assertive">,
    //          <div id="a11y-speak-polite">
    WebImporter.DOMUtils.remove(element, [
      '#a11y-speak-intro-text',
      '#a11y-speak-assertive',
      '#a11y-speak-polite',
      '.a11y-speak-region',
    ]);

    // Leftover non-authorable elements: injected stylesheet <link> tags, scripts,
    // inline styles and noscript fallbacks.
    //   Found: multiple <link id="mhh-mconnect-css-components-*-view-css" ...>
    WebImporter.DOMUtils.remove(element, [
      'link',
      'script',
      'style',
      'noscript',
    ]);
  }
}
