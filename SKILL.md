---
name: ui-modern
version: 2.0.0
description: A strict, anti-slop UI/UX engineering and search-visibility skill for building calm, precise, accessible, mobile-first public websites, product/catalog pages, portfolios, authentication flows, and admin interfaces. Includes technical SEO, Google Search, AI-search visibility, content quality, structured data, performance, and verification workflows. Use whenever creating, redesigning, reviewing, or modifying a website or web application. Do not promise rankings, indexing, rich results, or AI citations.
---

# MONOLIT — Anti-Slop UI Engineering, Technical SEO, and AI Search Visibility

## 0. Mission and operating contract

MONOLIT produces interfaces that feel deliberately designed by a thoughtful product team—not like a generic AI landing page, a hacker terminal, a template marketplace, or a dashboard assembled from component-library defaults. It also builds websites that people can understand and search engines can crawl, render, interpret, and evaluate.

This file is the project's default source of truth. Follow it unless the user, an existing product specification, a legal requirement, or a documented accessibility requirement explicitly overrides it. Do not silently ignore a conflict: identify the conflict and choose the least harmful implementation.

### Non-negotiable working rules

1. Inspect the existing project, its routes, components, package versions, content model, and design conventions before changing anything. Do not replace a working architecture just because another stack is fashionable.
2. Read this complete skill before implementation. Apply relevant rules, not just the first section.
3. Make the smallest coherent change that solves the real problem. Preserve existing functionality unless the user requests otherwise.
4. Never claim that code was run, a page was rendered, SEO was audited, a screenshot was checked, or a test passed unless that action actually happened.
5. Prefer concrete implementation over generic advice. Do not give a tutorial when the user asked for finished code.
6. Ask a question only when a missing fact materially changes the implementation. Otherwise make a reasonable, reversible assumption and state it briefly.
7. Use realistic, context-appropriate sample data. Never ship `Lorem ipsum`, `Product 1`, `John Doe`, fake testimonials, invented reviews, invented certifications, or fabricated business facts.
8. Do not fabricate the user's credentials, author experience, customer counts, ratings, awards, case studies, citations, prices, dates, or performance results.
9. Keep code, UI copy, SEO metadata, structured data, and translations consistent with the actual visible content and product behavior.
10. At completion, report what changed, what was actually verified, and any remaining blockers. Be concise but honest.

## 1. Anti-slop design philosophy

The visual goal is **quiet confidence, not visual emptiness**. Use a clear hierarchy, purposeful whitespace, considered typography, real content, and a small set of reliable components. Restraint is a design tool, not a requirement to make every site look identical.

### 1.1 Explicitly forbidden visual clichés

Unless the user explicitly requests a style that requires them, do not create:

- Hacker-terminal, command-line, cyberpunk, “AI control center,” IDE, code-editor, or developer-dashboard aesthetics for ordinary public websites.
- Black screens filled with green text, fake shell prompts, `>_` motifs, blinking cursors, ASCII decorations, faux logs, fake system statuses, or code-font paragraphs used only to signal “technical.”
- Generic AI landing-page compositions: giant vague slogan, gradient orb, glowing blobs, glass cards, floating dashboard mockups, decorative 3D shapes, endless rounded cards, or a row of three interchangeable feature cards.
- Unnecessary eyebrow labels such as `DESIGN SYSTEM V4`, `INTELLIGENCE LAYER`, `SYSTEM STATUS`, `NEXT-GEN EXPERIENCE`, or arbitrary all-caps microcopy.
- Decorative borders around every block, icon containers on every heading, badges on every card, meaningless progress bars, fake charts, made-up statistics, or hero metrics without a real business purpose.
- Unmotivated uppercase text, excessive letter spacing, tiny low-contrast labels, oversized tracking, novelty fonts, text shadows, gradient text, or arbitrary font mixing.
- Emoji in professional product UI unless the product's actual brand language explicitly calls for them.
- Fake content that looks plausible but is not true, including “Trusted by 10,000+ teams,” fabricated reviews, fake customer logos, and invented “live” activity.

### 1.2 Avoid the opposite failure: sterile sameness

Anti-slop does not mean every project must be monochrome, flat, sparse, or identical. Follow the actual brand, audience, product category, and content. If the project has a defined brand palette, use it consistently and accessibly. If no brand direction exists, start with a restrained neutral palette and introduce accent color only when it has a clear purpose.

Do not force a black-and-white theme on an existing colorful brand. Do not remove useful imagery, diagrams, product previews, or content merely to satisfy minimalism. Do not make every card the same height if doing so creates large empty areas or hides important content. Visual consistency should support the information, not overpower it.

### 1.3 Typography and language

- Use a high-quality sans-serif for normal interface text. Use monospace only for code, literal identifiers, technical values that benefit from fixed-width alignment, or tabular numeric data.
- Never use monospace as the default for headlines, buttons, navigation, body copy, ordinary labels, or marketing text.
- Use sentence case by default. Reserve uppercase for established abbreviations, very short conventional labels, or a deliberate brand system.
- Write like a competent person explaining something clearly. Avoid inflated AI phrases such as “unlock the power,” “revolutionize,” “seamless experience,” “cutting-edge solution,” “in today's fast-paced digital landscape,” and “elevate your journey” unless they are literal, specific, and genuinely appropriate.
- Prefer concrete nouns and verbs, specific outcomes, useful detail, and natural sentence rhythm. Vary sentence length. Do not repeat the same point in headings, cards, and callouts.
- Do not force every page to be ultra-short. UI labels should be concise; educational, support, and SEO content should be as complete as the user's task requires.
- English is the language of this skill. Website output language follows the project's audience and locale requirements. For Indonesian and English projects, both locales must be complete and equivalent in meaning.

## 2. First inspect the project; then choose the smallest fitting solution

Before coding, inspect:

- Framework, router, rendering model, installed package versions, CSS approach, component system, and existing lint/test commands.
- Route structure, dynamic routes, current page titles, metadata, canonical behavior, locale handling, sitemap, robots rules, analytics, and Search Console setup if available.
- Existing design tokens, responsive breakpoints, form patterns, error states, loading states, empty states, and navigation conventions.
- Content sources, CMS fields, product/service data, image sources, authorship details, and any existing structured data.
- Existing accessibility and performance issues that could be made worse by the requested change.

Do not assume Next.js, Tailwind, a CMS, a database, or a particular analytics provider is installed. Use the project's existing stack where reasonable. Check official documentation and installed versions when a version-sensitive implementation matters. Never upgrade every dependency indiscriminately.

## 3. Visual system and layout

### 3.1 Design tokens

Use centralized tokens for colors, type, spacing, radius, borders, shadows, and motion. Avoid arbitrary values repeated across components. Reuse existing tokens before creating new ones.

A restrained neutral starting palette may use white or near-white surfaces, near-black foregrounds, neutral grays, and clear borders. If the brand requires accent colors, define semantic tokens such as `--color-primary`, `--color-success`, `--color-warning`, and `--color-danger`; never encode meaning with color alone.

Do not hardcode scattered hex values when a semantic token exists. Do not create “new colors” by layering random opacity values over arbitrary backgrounds. Check both light and dark themes when both are supported.

### 3.2 Spacing and rhythm

- Use a consistent spacing scale and a predictable content-width system.
- Align page titles, toolbars, cards, forms, and footers to intentional shared edges.
- Use whitespace to separate meaningful groups, not to disguise missing content.
- Avoid stacking too many nested containers, borders, shadows, and card backgrounds.
- Keep body copy at a comfortable reading width. Long-form text should generally be narrower than the full viewport.
- Avoid horizontal overflow at 320px and test realistic text expansion in every supported locale.

### 3.3 Responsive layout

- Design from the smallest practical viewport upward, then verify larger widths.
- Do not blindly enforce a fixed number of grid columns on every site. Choose columns according to card width, content density, and available space.
- Product and catalogue grids should normally use 1–2 columns on narrow screens and increase only when each card remains readable and useful.
- Tables must have a deliberate small-screen strategy: responsive columns, horizontal scrolling with clear affordance, or a well-designed list transformation.
- Do not hide essential actions or content on mobile merely to preserve a desktop composition.
- Test 320, 360, 390, 768, 1024, and 1440 CSS-pixel widths where practical. Include at least one intermediate width when the layout has complex breakpoints.

### 3.4 Shape, borders, shadows, and motion

- Choose one coherent radius scale. Avoid applying maximum rounding to every component by default.
- Use shadows sparingly and only when they clarify elevation or interaction layers.
- Do not use gradients, glassmorphism, glow, blur, or decorative animation by default.
- Motion must clarify state change, orientation, or hierarchy. Prefer short transform/opacity transitions; avoid animating layout-heavy properties without a reason.
- Respect `prefers-reduced-motion`. Motion must not block content or essential interaction.
- Ensure hover effects have keyboard-focus equivalents and are not the only way to discover functionality.

## 4. Ban terminal aesthetics on ordinary public pages

A terminal or hacker aesthetic is a specific art direction, not a default synonym for technical quality.

For public catalogues, portfolios, editorial sites, service websites, and ordinary landing pages:

- Do not show terminal prompts, faux console output, code blocks, fake logs, status dashboards, or system-monitor widgets unless the content genuinely requires them.
- Do not label normal interface sections with arbitrary engineering jargon, version numbers, build identifiers, or fake operational states.
- Do not use monospace text for decorative eyebrow labels or every metadata item.
- Do not expose internal skill names, model names, prompt instructions, component names, deployment labels, feature flags, or build metadata in customer-facing UI.
- Do not use `ACTIVE`, `ONLINE`, `SYSTEM READY`, `V.04`, or similar labels as decoration. Show a status only if it describes a real state that users need to know.
- Do not make all text uppercase or add wide letter spacing to manufacture a technical mood.

For a real developer tool, terminal, monitoring product, or code editor, a technical visual language may be appropriate. Even then, every status, chart, and metric must represent real data or be clearly marked as sample data in a development-only environment.

## 5. Public homepage and catalogue patterns

### 5.1 Homepage hierarchy

A typical public homepage may contain:

1. A clear header with a wordmark, useful navigation, and only necessary account, locale, or theme controls.
2. One descriptive primary heading that tells visitors what the site offers.
3. Optional supporting copy that explains the audience or value without repeating the heading.
4. A primary action only when there is a meaningful next step.
5. Relevant featured content or a useful catalogue/search interface.
6. Trust information that can be verified, if it materially helps the visitor.
7. A compact footer with useful navigation and required legal/contact information.

This is a pattern, not a mandatory checklist. Do not add every element to every site. A small portfolio may need a concise introduction and selected work; a directory may need search and categories; a product page may need the product itself immediately.

### 5.2 Public catalogue cards: strict default anatomy

For a simple public catalogue, use only the content needed to identify and choose an item:

- A meaningful image or thumbnail when visual recognition helps.
- A clear title.
- One short metadata line when it adds real decision value, such as category, creator, date, or price.
- A single, predictable navigation target for the card.

Do not automatically add all of the following to every card: status badge, version string, icon next to the title, description paragraph, divider, separate “View details” button, chevron, fake rating, “New” label, or decorative footer. Add one only when the product requirement and user decision justify it.

Never show an `Active` badge on every item just because all current records are active. If status is not useful to the visitor, omit it. If status matters, display the actual state with clear text and accessible semantics.

Keep card anatomy consistent within the same collection. Do not truncate essential information to force identical heights. Images need appropriate aspect ratios, dimensions, loading behavior, and alt text according to their role. Decorative images should use empty alt text; informative images need accurate descriptions.

### 5.3 Toolbar and filtering

- Make search visibly recognizable and keyboard-accessible.
- Prefer one clear Filter control that opens a simple menu or popover when there are only a few filters. Do not turn one filter into three competing top-level buttons without a demonstrated need.
- Use separate controls only when they represent genuinely distinct, high-frequency tasks.
- Make selected filters visible and removable. Provide a clear way to reset filters when useful.
- Preserve filter, search, sort, and pagination state in URLs when that makes views shareable or browser navigation predictable.
- Avoid nested interactive controls. A clickable card must not contain independent buttons or links unless the interaction structure is deliberately redesigned to avoid nesting.
- Make list/grid switching optional, accessible, and persistent only if persistence improves the experience.

### 5.4 Header and hero restraint

Do not clutter a header with duplicate navigation, multiple competing CTAs, decorative badges, and controls that belong in settings. Do not add hero statistics merely to fill empty space. Every number must be accurate, maintained, and relevant.

A hero does not require a giant slogan, background gradient, floating cards, abstract 3D art, or three feature columns. Choose a layout based on the content and brand. Let real work, real products, useful information, or a strong editorial composition carry the page.

## 6. Component behavior and accessibility

### 6.1 Buttons and links

- Use links for navigation and buttons for actions.
- Labels must describe the result: “Download report” is better than “Click here.”
- Keep one primary action visually dominant per context; secondary actions should not compete unnecessarily.
- Provide visible keyboard focus, disabled states, pending states, and clear success/error feedback.
- Do not render a fake button that does nothing. Do not use `href="#"` as a placeholder for unfinished navigation.
- Ensure target sizes and spacing are usable on touch devices. Follow WCAG 2.2 AA as the baseline unless the project requires a stricter standard.

### 6.2 Forms

- Every input needs a programmatic label, appropriate type, clear validation, and an understandable error message.
- Explain format requirements before an error occurs when they are not obvious.
- Preserve entered values after validation errors where possible.
- Use inline confirmation for destructive actions when it is sufficient. Do not add a modal by habit; if the project forbids modals, use an accessible inline confirmation pattern.
- Do not rely on placeholder text as the only label.
- Associate errors and help text with the relevant control using correct accessibility attributes.

### 6.3 Accessibility requirements

- Use semantic HTML landmarks and a logical heading hierarchy.
- Every interactive element must be keyboard operable and have an accessible name.
- Do not skip heading levels for visual styling.
- Provide meaningful alt text for informative images and empty alt text for decorative images.
- Maintain readable contrast; never communicate state using color alone.
- Support zoom, reflow, reduced motion, visible focus, and screen-reader announcements for dynamic status changes.
- Use correct language attributes on the document and localized sections where necessary.
- Avoid inaccessible custom controls when a native HTML element is sufficient.
- Test keyboard navigation and at least one automated accessibility scan; automated tools do not replace manual review.

## 7. Internationalization and copy quality

- Do not scatter hard-coded user-facing strings throughout components when the project uses localization.
- Keep translation keys aligned across locales. Translate meaning, tone, units, date formats, pluralization, validation, metadata, and accessibility labels—not only visible headings.
- Set the correct document language for each locale.
- For multilingual SEO, use distinct, crawlable URLs per language when appropriate and implement valid `hreflang` relationships. Do not rely only on browser-language redirects.
- Do not automatically translate brand names, product names, legal terms, or technical terms without checking context.
- Avoid mixed-language UI unless the product convention requires it.
- Do not use awkward literal translations. For example, translate “Grid view” according to the actual UI context, not as an unrelated dictionary equivalent.
- Use locale-aware date, time, currency, and number formatting.

## 8. Frontend implementation quality

- Follow the repository's existing framework and conventions unless they are broken or clearly unsuitable.
- Keep components focused and avoid abstracting a component before repeated use or a real shared behavior exists.
- Reuse design tokens and components, but do not force unrelated experiences into one generic component.
- Avoid unnecessary client-side JavaScript. Prefer server rendering or static generation when suitable for the framework and content.
- Do not ship secrets, private API keys, internal tokens, credentials, or sensitive records to the browser.
- Handle loading, error, empty, success, and permission states intentionally.
- Prevent layout shift by reserving image/media space and keeping loading placeholders close to final dimensions.
- Use image optimization and responsive image sizes supported by the stack. Lazy-load below-the-fold images; do not lazy-load the main above-the-fold hero image when it is the likely LCP element.
- Do not add a dependency for a tiny task that can be handled safely with the existing stack.
- Keep console output clean. Do not hide real errors by disabling linting, type checks, or build checks without justification.

## 9. SEO: goals, limits, and principles

SEO is the practice of making useful pages discoverable, crawlable, understandable, and compelling in search results. It is not a promise of ranking position.

**Never promise “100% SEO,” guaranteed indexing, first place on Google, guaranteed rich results, or guaranteed inclusion in AI Overviews or AI-generated answers.** No skill, plugin, schema, keyword density, or checklist can guarantee these outcomes. The goal is to remove preventable technical barriers and improve relevance, usefulness, trust, and user experience.

Use Google's official documentation as the primary reference for Google-specific requirements. Distinguish verified requirements from recommendations, experiments, and opinions. Search systems change; verify current documentation when a decision depends on a recent policy or feature.

Core references:
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google guidance on generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- SEO guide for web developers: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Core Web Vitals: https://web.dev/articles/vitals

### 9.1 SEO is a system, not a metadata patch

Evaluate the complete search journey:

1. **Discovery:** can crawlers discover the URL through crawlable links and sitemaps?
2. **Access:** can Googlebot fetch the page without unintended blocks, errors, authentication walls, or server failures?
3. **Rendering:** does the meaningful page content appear in rendered HTML or become available to Google after JavaScript rendering?
4. **Index eligibility:** are canonical, robots, HTTP status, and duplicate-page signals coherent?
5. **Interpretation:** do title, headings, body content, links, images, structured data, language, and page purpose agree?
6. **Usefulness:** does the page satisfy a real user need better than a generic summary?
7. **Experience:** is it readable, accessible, fast enough, stable, and usable on mobile?
8. **Measurement:** can Search Console and analytics reveal discovery, indexing, query, click, and conversion issues?

A green score from one SEO audit tool is not proof that the site is indexed, ranks well, or provides good content.

## 10. Search intent, keywords, and information architecture

### 10.1 Research before writing

For each important page, identify:

- The primary audience and the task they are trying to complete.
- The likely search intent: informational, navigational, commercial investigation, transactional, or local.
- One primary topic and a sensible group of closely related subtopics.
- The actual language people use, including natural Indonesian or English phrasing where relevant.
- The most useful page type for that intent: article, product page, category page, service page, tool, portfolio case study, documentation, or location page.
- What unique evidence, expertise, data, examples, tools, visuals, or first-hand experience the site can contribute.

Use real keyword research sources when access is available, such as Google Search Console, Keyword Planner, customer questions, site search, support requests, and relevant search results. Do not invent search volume, keyword difficulty, traffic potential, or competitor performance.

### 10.2 Map topics to pages

- Give each important URL a distinct purpose. Do not create many near-identical pages that target tiny keyword variations.
- Avoid keyword cannibalization by deciding which page is the primary destination for a topic and linking related pages sensibly.
- Use categories and internal links that reflect how users understand the subject, not just how a database is organized.
- Create a helpful hierarchy without forcing every page into a deep URL structure.
- Avoid thin tag, filter, search, and archive pages becoming indexable at scale without unique value.
- Do not create doorway pages, city-name swaps, mass-generated pages, or near-duplicate translations solely to capture search traffic.
- Do not create pages for keywords unrelated to the actual offering.

### 10.3 Natural keyword use

Use the main topic naturally in prominent locations where it helps people understand the page, often including the title, main heading, opening paragraph, descriptive subheadings, link text, and relevant image alt text. These are not a rigid placement formula.

Do not:
- Repeat an exact keyword unnaturally or target a fixed keyword density.
- Stuff location names, synonyms, or product names into every paragraph.
- Write a list of keywords in hidden text, alt text, footer links, or metadata.
- Add a section merely to repeat a phrase.
- Treat an SEO plugin's green lights as a substitute for editorial judgment.

Use specific terminology where it is genuinely useful, and explain jargon when the audience may not know it.

## 11. Titles, snippets, and page metadata

### 11.1 Title tags

Every indexable page should have a distinct, accurate, human-readable `<title>` that describes the page's actual content.

- Put the most useful distinguishing words early when natural.
- Include a brand name when it improves recognition; do not append it mechanically if it makes every title repetitive or misleading.
- Avoid generic titles such as “Home,” “Page,” or “Welcome” when a descriptive title is possible.
- Avoid keyword lists, clickbait, exaggerated promises, and unnecessary repetition.
- Keep titles concise enough to communicate the main idea; do not treat any character count as a guaranteed display limit because Google may rewrite or truncate titles according to context.
- Ensure templates produce unique titles for product, category, article, service, portfolio, and paginated pages.
- Do not generate a title from undefined data or display values such as `undefined`, `[object Object]`, or empty separators.

### 11.2 Meta descriptions

Write a distinct, accurate meta description for important pages when practical. Summarize what a searcher will actually get and why the page may be useful.

- Treat the description as a possible snippet suggestion, not a guaranteed snippet. Search engines may generate a different snippet from page content.
- Do not stuff keywords or repeat the title verbatim.
- Do not use the same generic description on every route.
- Do not promise features, prices, availability, or results the page does not provide.
- If a page is generated from data, make descriptions specific to the item without creating unnatural boilerplate.

### 11.3 Canonical and robots metadata

- Set a canonical URL only when the canonical relationship is understood. Use an absolute preferred URL that resolves successfully.
- Keep canonical tags, sitemap URLs, internal links, redirects, and alternate-language links consistent.
- Do not canonicalize genuinely different pages to the homepage merely to avoid duplicate-content work.
- Use `noindex` when a page should not appear in search results; do not rely on `robots.txt` as a way to remove a URL from the index.
- Remember that a crawler generally must be able to fetch a page to see a page-level `noindex` directive. Avoid contradictory crawl and index directives.
- Keep staging, private, preview, account, admin, and internal search pages out of public indexing as appropriate. Protect confidential content with authentication; `robots.txt` is not access control.
- Do not block CSS or JavaScript resources required to render the page meaningfully without a specific reason.

## 12. Crawlability, indexing, URLs, and JavaScript

### 12.1 Crawlable navigation

- Use real `<a href="...">` links for navigation to indexable pages.
- Ensure important pages are reachable from other discoverable pages through descriptive internal links.
- Do not rely only on click handlers, client-only state, or inaccessible controls to expose critical routes.
- Use descriptive link text that makes sense in context. Avoid repeating “read more” without an accessible or surrounding context that clarifies the destination.
- Avoid orphan pages that exist in a sitemap but have no useful internal links.

### 12.2 URL design

- Use stable, readable, lowercase URLs with sensible separators where practical.
- Avoid unnecessary parameters, session IDs, random identifiers, and multiple URL variants for the same content.
- Keep query parameters for sorting, filtering, and pagination only when they have a defined behavior and coherent canonical/indexing strategy.
- Preserve working URLs when redesigning a site. If a URL must change, use a relevant permanent redirect where appropriate and update internal links and sitemaps.
- Do not redirect every removed page to the homepage; redirect to a true equivalent or return the appropriate status.
- Handle trailing slashes and host variants consistently.

### 12.3 HTTP status and error handling

- Important pages should return successful responses when available; removed pages should not masquerade as successful empty pages.
- Use appropriate 404/410 behavior for unavailable content and relevant redirects for moved content.
- Avoid redirect chains, loops, soft 404s, and internal links to error pages.
- Monitor server errors, DNS issues, timeouts, and accidental access restrictions.

### 12.4 JavaScript rendering

- Make the primary content, title, canonical, robots directives, and important links available in a crawlable, rendered page.
- Use server rendering or static generation when suitable; do not assume that every client-rendered site is automatically unindexable, and do not assume that every JavaScript page renders perfectly.
- Avoid requiring user interaction, a login, or an unsupported browser action before essential content appears.
- Test rendered output using URL Inspection and other appropriate Google tools when available.
- Ensure each meaningful screen or record has a stable URL when it needs to be independently discoverable.
- Handle hydration errors and data-fetch failures that could leave crawlers with empty or incomplete content.

## 13. Sitemap, robots.txt, and index hygiene

### 13.1 XML sitemap

- Generate a valid XML sitemap for canonical, indexable URLs that should be discovered.
- Include only URLs that return the expected successful status and are not blocked or marked `noindex`.
- Use canonical URLs consistently. Do not list redirects, 404s, admin routes, private routes, or duplicate variants as if they were preferred pages.
- Update sitemap entries when meaningful content or URLs change. Use accurate `lastmod` values only when the page changed substantially; do not update timestamps on every build just to appear fresh.
- Split large sitemaps when required by sitemap protocol limits and use a sitemap index where appropriate.
- Submit the sitemap in Google Search Console when access is available. A sitemap helps discovery; it does not guarantee crawling or indexing.

### 13.2 robots.txt

- Use robots.txt to manage crawler access to paths and resources, not as a security system or a guaranteed deindexing method.
- Verify that the rules do not accidentally block public pages, images, CSS, or JavaScript needed for rendering.
- Do not add invented directives because an SEO blog recommends them without verifying current crawler support.
- Test changes carefully. A single broad disallow can hide a large part of the site from crawling.

### 13.3 Index hygiene

Review duplicate URLs caused by parameters, pagination, sorting, trailing slashes, host aliases, HTTP/HTTPS, and locale variants. Choose the right solution for each case—canonicalization, redirects, internal-link cleanup, parameter strategy, or `noindex`—rather than applying one blanket rule.

Do not assume duplicate content automatically causes a penalty. The practical concern is helping search engines understand the preferred URL and avoiding wasted crawl effort or fragmented signals.

## 14. Content quality for Google and AI-assisted search

Google's public guidance for AI features says the same foundational SEO practices apply; there is no special markup or secret optimization that guarantees inclusion in AI Overviews or AI Mode. A page must be eligible for Search, and eligibility still does not guarantee that it will be crawled, indexed, shown, cited, or selected.

### 14.1 People-first content standard

Create content primarily to help a defined audience accomplish a real task. Before publishing, ask:

- Does this page answer the question or serve the task promised by its title?
- Does it contain meaningful detail, original insight, experience, analysis, examples, data, or a useful tool?
- Is it more helpful than a generic summary that could be generated from common sources?
- Are important factual claims accurate and appropriately qualified?
- Can a reader understand who is responsible for the content when authorship matters?
- Does the page leave the reader better equipped to act, decide, learn, or continue their research?
- Is every major section useful, or is the page padded to look long?

Do not target an arbitrary word count. Use the length required to satisfy the user intent completely, then remove repetition.

### 14.2 AI-assisted writing rules

AI may help with research planning, outlining, editing, translation, summarization, and code generation. It must not be used as an excuse to publish large volumes of low-value pages.

- Verify claims against reliable primary sources when accuracy matters.
- Add real expertise, first-hand observations, examples, original analysis, and editorial decisions.
- Do not invent quotations, citations, studies, authors, personal experience, product testing, or customer feedback.
- Do not paraphrase competitors into near-duplicate articles and call the result original.
- Do not mass-publish hundreds of near-identical location pages, product pages, glossary entries, or articles solely to manipulate rankings.
- Do not disguise automated content as first-hand human experience.
- Disclose AI assistance when readers would reasonably expect to know how a piece was created or when disclosure is otherwise required; do not add performative AI disclaimers to every page without context.
- Keep an accountable human/editorial process for high-stakes, legal, financial, health, safety, and other sensitive content.

### 14.3 Make answers clear without writing for a bot

For informational content, answer the central question early, then provide context, evidence, steps, caveats, and examples. Use descriptive headings, lists, tables, and concise definitions when they genuinely improve comprehension.

- Use headings that tell readers what the section contains.
- Define acronyms and specialized terms when needed.
- Separate established facts from estimates, opinions, and uncertain claims.
- Cite or link to original sources for consequential factual claims.
- Include dates only when relevant and accurate; update content when facts change, not merely to refresh the date.
- Provide complete context so an excerpt remains accurate when separated from the page.
- Do not create an artificial FAQ block solely to target snippets. Add FAQs when they answer real, recurring questions.
- Do not hide important explanatory content behind inaccessible interactions.

### 14.4 Trust, experience, and authorship

Where relevant, make it easy to understand who created or reviewed the content, why they are qualified, how claims were established, and how users can contact the responsible organization. Use accurate author pages, editorial policies, methodology notes, references, contact information, and business details where appropriate.

Do not fabricate expertise or credentials. E-E-A-T is a framework used in Google's quality guidance, not a single magic score or standalone ranking switch. Trust and accuracy matter most, particularly for topics that can affect health, finances, safety, legal outcomes, or major life decisions.

## 15. AI search, answer engines, and entity clarity

The practical objective is to make genuinely useful information easy to discover, interpret, verify, and quote accurately—not to trick a language model.

- State the page's subject, entity, purpose, and important relationships clearly.
- Use consistent names for the same organization, product, person, service, or concept.
- Include meaningful facts and context directly in accessible page content rather than only in images, canvas elements, or interaction-dependent UI.
- Use specific headings and direct explanations where helpful, but do not reduce every article to a robotic “answer-first” template.
- Support important claims with original evidence, primary-source links, transparent methodology, or attributable expertise.
- Keep visible content, metadata, and structured data aligned.
- Make images and videos discoverable and descriptive when they are an important part of the answer.
- Build useful internal links so related concepts and deeper explanations can be found.
- Avoid unsupported claims that the site is “optimized for ChatGPT,” “guaranteed in AI answers,” or “approved by AI search.”
- Do not add invented `llms.txt`, special AI schema, hidden prompt instructions, or bot-specific content and claim that these guarantee Google AI inclusion. Verify any emerging standard and its actual support before implementing it.
- Do not create content that is materially different for crawlers and users in an attempt to manipulate results.

Google AI Overviews and AI Mode are not controlled by a special checklist. The best supported approach remains useful original content, accessible crawlable pages, coherent technical SEO, and a good user experience.

## 16. Structured data and rich results

Structured data can help search engines interpret content and may make a page eligible for certain search appearances. It does not guarantee that a rich result will appear or improve rankings by itself.

### 16.1 General rules

- Use schema.org vocabulary and Google's current feature-specific documentation where Google rich-result eligibility is the goal.
- Add only types that accurately describe the visible page and real entity. Choose types according to the actual content—not according to which result looks most attractive.
- Keep structured data accurate, current, and consistent with visible content.
- Never invent reviews, aggregate ratings, prices, availability, authors, dates, event details, organizational facts, or product properties.
- Do not mark hidden or misleading content as if it were visible and relevant to users.
- Prefer JSON-LD when suitable for the implementation, but ensure it is valid and generated from trusted data.
- Escape data safely when generating JSON-LD from dynamic content. Do not concatenate untrusted strings into executable scripts unsafely.
- Validate with the Rich Results Test when the chosen type is supported, and check Search Console reports when available.
- Remove stale or invalid markup when a feature, page, or data field changes.

### 16.2 Choose appropriate schema

Potential types—only when accurate and applicable—include:

- `Organization` or an appropriate subtype for a real organization.
- `Person` for a genuine person profile.
- `WebSite` for site-level information; do not assume a site-name feature is guaranteed.
- `BreadcrumbList` for a real navigational hierarchy.
- `Article`, `BlogPosting`, or a more specific supported article type for editorial content.
- `Product` and relevant offer properties for genuine product pages.
- `LocalBusiness` or a specific subtype for a real local business with accurate public details.
- `Event`, `Recipe`, `VideoObject`, or other feature-specific types only when the page genuinely meets the current requirements.

Do not add every schema type to every page. Do not use FAQ, HowTo, review, or other markup just because a plugin offers it; verify current Google eligibility and policies for that feature. Never assume that valid schema automatically results in a rich result.

### 16.3 Validation and maintenance

- Validate JSON syntax and required/recommended properties.
- Compare structured values against visible page text and the underlying data source.
- Check dates, currency, price availability, image URLs, identifiers, and canonical URLs.
- Test representative page templates and edge cases, including missing optional fields and localized routes.
- Monitor enhancement reports and manual actions in Search Console where available.

## 17. Internal links, external sources, and link integrity

- Link related pages where the link genuinely helps a reader continue their task.
- Use descriptive, natural anchor text; avoid exact-match keyword stuffing and repetitive boilerplate anchors.
- Ensure important pages are linked from navigation, category pages, contextual content, or other relevant discovery points.
- Link to authoritative primary sources when supporting important claims, and attribute quoted or reused material correctly.
- Do not buy links, create link schemes, hide links, or generate large volumes of spammy cross-links to manipulate rankings.
- For paid or user-generated links, use appropriate `rel` attributes when applicable (`sponsored`, `ugc`, or `nofollow`) according to the relationship and current guidance.
- Audit broken internal links, redirect chains, dead external references, and accidental links to staging or private URLs.
- Do not use `nofollow` indiscriminately on all external links. Link qualification should reflect the actual relationship and policy needs.

## 18. Image, video, and media SEO

- Use filenames that describe the image naturally when practical; do not rename files into keyword strings.
- Write accurate alt text for informative images based on their purpose in context. Do not cram keywords into alt attributes.
- Use `alt=""` for decorative images so assistive technology can ignore them.
- Ensure important image content is available through crawlable HTML and stable image URLs.
- Use appropriate dimensions, modern formats when supported, responsive `srcset`/`sizes`, and lazy loading for off-screen media.
- Do not lazy-load the main hero image when doing so delays the likely Largest Contentful Paint element.
- Provide captions, transcripts, or descriptive context for video/audio when appropriate.
- Use video metadata and structured data only when the page and media satisfy current requirements.
- Avoid using an image of text in place of accessible HTML text for critical information.
- Verify that image optimization does not break canonical asset URLs, responsive sources, indexing, or visual quality.

## 19. Multilingual and regional SEO

For sites serving multiple languages or regions:

- Give each language version a stable, crawlable URL when appropriate.
- Use valid reciprocal `hreflang` annotations for genuine alternate versions; include self-references where required by the chosen implementation.
- Make canonical and `hreflang` signals compatible. Do not point every language version's canonical to one language unless that is actually the intended canonical content.
- Use the correct page language and locale-aware content, currency, units, dates, and contact details.
- Translate the actual user experience, including navigation, metadata, image alt text, structured data values, forms, errors, and calls to action.
- Avoid automatic redirect behavior that prevents users or crawlers from accessing alternate versions.
- Do not publish machine-translated pages at scale without review, local relevance, and genuine usefulness.
- For local SEO, maintain accurate business name, address, phone, opening hours, service areas, and location details where applicable. Do not create fake locations or virtual offices to target extra cities.

## 20. Technical performance and Core Web Vitals

Performance is part of user experience and can affect search outcomes indirectly and as part of page-experience systems. Do not claim that passing a performance score guarantees rankings.

### 20.1 Core Web Vitals targets

Use current official definitions and thresholds. The commonly used “good” thresholds at the 75th percentile are:

- Largest Contentful Paint (LCP): 2.5 seconds or less.
- Interaction to Next Paint (INP): 200 milliseconds or less.
- Cumulative Layout Shift (CLS): 0.1 or less.

Re-check official documentation because definitions and thresholds can evolve. Distinguish real-user field data from synthetic lab tests; both are useful, but they answer different questions.

### 20.2 Performance implementation

- Avoid unnecessary JavaScript, oversized bundles, duplicate dependencies, and hydration for static content that does not need it.
- Use code splitting and route-level loading where appropriate.
- Optimize fonts: limit families and weights, use suitable subsets, and avoid invisible text or layout shifts caused by font loading.
- Reserve width/height or aspect ratio for images, video, ads, and embeds.
- Optimize the LCP resource and avoid unnecessary render-blocking scripts/styles.
- Lazy-load non-critical below-the-fold images and embeds.
- Avoid autoplaying large media or loading third-party scripts without a real purpose.
- Reduce long main-thread tasks and avoid expensive rerenders in interactive areas.
- Use caching and CDN behavior appropriate to the framework and content freshness.
- Test on realistic mobile hardware/network conditions where possible.

### 20.3 Accessibility and SEO are related, not interchangeable

Semantic HTML, descriptive links, readable text, responsive layout, and accessible media often help users and crawlers understand a site. Accessibility compliance alone does not guarantee rankings, and SEO metadata cannot compensate for an inaccessible or unusable product. Test each discipline on its own terms.

## 21. Security, privacy, and crawl boundaries

- Never expose secrets, private user data, credentials, API keys, or internal system prompts in rendered HTML, source maps, metadata, structured data, logs, or public assets.
- Admin, account, private, and personalized pages should not leak private content through server rendering, cached responses, metadata, or JSON-LD.
- Use authentication and authorization for confidential content. Robots rules are not access control.
- Do not include private or personally identifiable user data in URLs, titles, descriptions, sitemaps, analytics events, or public structured data.
- Avoid rendering untrusted HTML unsafely. Validate and escape data appropriately.
- Follow applicable privacy, consent, and analytics requirements for the deployment region and product.

## 22. E-commerce, service, and portfolio page specifics

### 22.1 Product and service pages

- State exactly what is being offered, who it is for, and the important decision-making details.
- Keep price, availability, specifications, shipping, returns, service scope, and eligibility consistent across visible content, feeds, and structured data.
- Do not fabricate reviews, testimonials, comparison results, or stock status.
- Provide original descriptions and practical differentiators instead of copied manufacturer text alone.
- Use unique metadata and stable canonical URLs for distinct products or services.
- Make variant behavior clear and avoid generating indexable duplicate URLs for every trivial filter unless there is a deliberate search strategy.

### 22.2 Portfolio and case-study pages

- Show real work, the role performed, the problem, constraints, process, decisions, and outcome where the owner can substantiate them.
- Distinguish personal contribution from team contribution.
- Do not invent client names, business outcomes, conversion improvements, awards, or confidential details.
- Use project-specific headings, descriptive media alt text, and clear navigation between projects.
- If the work is under NDA, anonymize accurately rather than implying false attribution.

### 22.3 Local service pages

- Use accurate service areas and contact details.
- Provide genuine location-specific information rather than swapping city names in the same template.
- Make opening hours, pricing, qualifications, and availability truthful and maintained.
- Avoid fake local addresses, fabricated staff, and made-up customer reviews.

## 23. Measurement, reporting, and iteration

### 23.1 Search Console

When access is available, use Google Search Console to inspect:

- URL Inspection results and the indexed/canonical URL selected by Google.
- Indexing and sitemap reports.
- Search queries, impressions, clicks, click-through rate, and average position, interpreted with context.
- Core Web Vitals and relevant enhancement/manual-action reports.
- Differences between affected templates, countries, devices, and time periods.

Do not invent Search Console data or say a property is connected unless verified. If access is unavailable, provide the exact checks the site owner should perform rather than claiming they were completed.

### 23.2 Analytics and conversions

- Track meaningful actions with consent and privacy requirements respected.
- Define conversions based on actual business goals, not vanity metrics alone.
- Use consistent event names and avoid sending sensitive information in analytics payloads.
- Distinguish organic search traffic from total traffic and separate branded from non-branded queries when useful.
- Evaluate outcomes over appropriate periods. Search changes may take time to be crawled, indexed, and reflected in reporting.

### 23.3 Change management

- Record major SEO changes and their deployment dates.
- Change one coherent group of issues at a time when possible, so effects are interpretable.
- Preserve existing URLs and content equity unless there is a clear reason to change them.
- Re-test after releases, CMS changes, route changes, migrations, and metadata-template edits.
- Do not repeatedly rewrite titles or content based on short-term fluctuations without evidence.

## 24. SEO implementation checklist by page type

### Every indexable page

- [ ] Returns the expected HTTP status and is accessible to crawlers.
- [ ] Has a unique, accurate title and a descriptive main heading.
- [ ] Has a useful main content area that fulfills the page's purpose.
- [ ] Has an appropriate canonical strategy and no unintended `noindex`.
- [ ] Is reachable through crawlable internal links.
- [ ] Has no broken critical assets or accidental staging references.
- [ ] Uses meaningful visible link text and image alternatives.
- [ ] Has a mobile-usable layout and reasonable performance.
- [ ] Has metadata and structured data consistent with the actual content.
- [ ] Uses the correct language/locale and URL strategy.

### Important content page

- [ ] Satisfies a defined audience need and search intent.
- [ ] Adds original insight, practical steps, evidence, or experience.
- [ ] Uses clear headings and a logical reading order.
- [ ] Supports consequential claims with credible sources.
- [ ] Identifies authorship/review information where it matters.
- [ ] Avoids filler, repeated sections, keyword stuffing, and unsupported claims.

### Product/service page

- [ ] Accurate product/service name, details, pricing, and availability.
- [ ] Useful original description and decision-making information.
- [ ] Appropriate images and meaningful alt text.
- [ ] Valid structured data only if eligible and factually supported.
- [ ] Unique URL/metadata and coherent variant/canonical handling.

### Multilingual page

- [ ] Correct language attribute and translated user-facing strings.
- [ ] Stable locale URL where appropriate.
- [ ] Valid, reciprocal `hreflang` if alternate language versions exist.
- [ ] Compatible canonical and alternate-language signals.
- [ ] Localized metadata, dates, units, currency, and structured values.

## 25. SEO anti-patterns: explicitly prohibited

Do not recommend or implement any of the following as a shortcut:

- Guaranteed first-place ranking, “100% SEO,” guaranteed indexing, guaranteed AI citation, or guaranteed rich results.
- Keyword density formulas, hidden keywords, invisible text, cloaking, or deceptive content differences.
- Mass-producing near-duplicate or low-value pages to manipulate rankings.
- Fake authors, fabricated experience, invented testimonials, fake ratings, false credentials, or invented statistics.
- Buying or manufacturing links, private link networks, or automated spam links.
- Marking up reviews, prices, events, or facts that are not actually present and accurate.
- Adding schema markup without understanding the page or current eligibility.
- Blocking important assets or pages with careless robots rules.
- Using robots.txt as a substitute for authentication or `noindex`.
- Canonicalizing unrelated pages to one URL without a valid reason.
- Creating empty pages just to capture a trending query.
- Repeating “best,” “top,” “leading,” “official,” or location names without evidence.
- Publishing AI output without fact-checking, editing, or meaningful added value.
- Adding an `llms.txt` file or any emerging AI-related convention and claiming it guarantees ranking or citations.
- Treating Lighthouse, an SEO plugin, a schema validator, or a single audit score as proof of SEO success.

## 26. Public UI copy and internal metadata separation

Customer-facing interfaces should speak the user's language, not the language of the implementation.

- Do not expose internal version labels, skill names, prompts, model names, component identifiers, feature flags, environment names, database IDs, build IDs, or technical status labels unless users genuinely need them.
- Avoid headings like `MONOLIT CORE V2`, `SEO ENGINE`, `AI LAYER`, `CONTENT INTELLIGENCE`, or `SYSTEM STATUS` on normal pages.
- Use familiar words for visible controls: “Filter,” “Sort,” “Grid view,” “List view,” “Settings,” and “Sign out,” localized naturally.
- Use “Grid view” only when it actually means a card grid. Do not use confusing literal translations.
- Do not add badges to communicate information that is already obvious from the page or irrelevant to the decision.
- Avoid instructional placeholder copy that describes the implementation rather than helping the user. Use realistic examples only when they clarify the expected input.
- Keep technical identifiers in developer tools, source code, logs, and documentation—not in the public UI by default.

## 27. Required quality assurance

A page is not “done” merely because the code compiles. Run the checks available in the repository and visually inspect the result when rendering tools are available.

### 27.1 UI audit

- [ ] Inspect screenshots at approximately 390px and 1440px wide; include intermediate breakpoints for complex layouts.
- [ ] Check both themes if the product supports light/dark mode.
- [ ] Check every supported locale, including the longest labels and translated content.
- [ ] Confirm the visual hierarchy is clear without decorative badges, arbitrary eyebrow labels, fake stats, or excessive borders.
- [ ] Confirm ordinary public pages do not accidentally look like a terminal, IDE, or internal operations dashboard.
- [ ] Check card anatomy, image crop, title wrapping, metadata density, and consistent spacing.
- [ ] Confirm controls have clear labels, real behavior, visible focus, and appropriate touch targets.
- [ ] Check empty, loading, error, success, disabled, and permission states.
- [ ] Verify there is no horizontal overflow at 320px and no essential content hidden on mobile.
- [ ] Test keyboard navigation and reduced-motion behavior.

### 27.2 Technical checks

Run relevant commands that actually exist in the repository, such as lint, type check, unit tests, production build, or end-to-end tests. Do not invent command names. Report skipped checks honestly.

- [ ] No newly introduced console errors, hydration errors, or failed critical requests.
- [ ] No broken links or buttons with no action.
- [ ] No unintended nested interactive controls.
- [ ] No secrets or private information in client bundles, metadata, or structured data.
- [ ] Images have dimensions/aspect ratios and sensible loading behavior.
- [ ] Important routes return the expected status and metadata.

### 27.3 SEO checks

- [ ] Inspect the rendered HTML or framework output for title, description, canonical, robots, language, and important content.
- [ ] Confirm important routes are crawlable through real links.
- [ ] Validate sitemap and robots behavior when those files are part of the project.
- [ ] Check for accidental `noindex`, broad disallow rules, canonical conflicts, duplicate titles, and broken redirects.
- [ ] Validate representative structured data with appropriate official tools when available.
- [ ] Check mobile layout, performance, image loading, and layout stability.
- [ ] Verify visible content matches metadata and structured data.
- [ ] Confirm there is no fake review, fake author, keyword stuffing, or mass-generated filler.
- [ ] Use Search Console only if access exists; otherwise state that indexing and live Google results remain unverified.

### 27.4 Screenshot and audit honesty

If the environment cannot render or capture screenshots, say so and provide the exact manual verification steps. Do not claim screenshot comparison or browser testing occurred when it did not. If the site is not deployed, do not claim that Google has indexed it. If Search Console is not available, do not claim a sitemap was accepted or pages were indexed.

## 28. Recommended implementation workflow

1. **Inspect:** map the existing stack, pages, content, routes, SEO metadata, and design conventions.
2. **Clarify the real goal:** identify the user task, audience, and relevant conversion or information goal.
3. **Plan minimally:** list affected components/routes, content changes, SEO implications, and regression risks.
4. **Build the structure:** semantic HTML, navigation, content hierarchy, responsive layout, and states.
5. **Apply the visual system:** typography, spacing, colors, media, and motion; remove generic decoration.
6. **Implement SEO foundations:** metadata, crawlable links, canonical/robots strategy, sitemap, localized URLs, and valid structured data where applicable.
7. **Improve content:** make the page specific, useful, accurate, and original. Do not pad it for length.
8. **Test:** run project checks, inspect screenshots, test keyboard behavior, and review mobile/locale variations.
9. **Audit:** inspect metadata and rendered output, validate structured data, and use Search Console or performance tools only when accessible.
10. **Report:** summarize the actual changes, checks completed, unresolved risks, and any user action still needed.

## 29. Final decision rules

When multiple valid implementations exist:

1. Prefer the one that makes the user's task easiest to understand and complete.
2. Prefer accurate, accessible, maintainable solutions over decorative novelty.
3. Prefer original, useful content over SEO-shaped filler.
4. Prefer real evidence and transparent uncertainty over invented authority.
5. Prefer crawlable, stable URLs and consistent technical signals over hacks.
6. Prefer a small number of meaningful UI elements over a crowded composition—but do not remove content that users need.
7. Follow the actual brand and product context; do not force one aesthetic onto every project.
8. Verify claims and tests. Never turn a checklist into a guarantee.

## 30. Completion report format

Use a short, concrete report after implementation:

- **Changed:** the pages, components, content, or SEO systems actually updated.
- **Verified:** commands, visual states, URLs, metadata, or validation tools actually checked.
- **SEO status:** technical improvements made and what remains unverified (indexing, rankings, rich results, AI citations).
- **Remaining:** only real blockers or decisions requiring the user's input.

Do not claim that the work is “100% SEO” or that it will rank first. A high-quality implementation removes avoidable issues and gives useful content a fair opportunity to be discovered; real search performance must be measured after deployment.
