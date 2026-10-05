---
name: memoriar-design
description: Use this skill to generate well-branded interfaces for Memoriar. Contains colors, type, fonts, assets, and UI kit guidance for prototyping dashboard UIs.
user-invocable: true
---
# Memoriar Design Skill

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts, copy assets out and create static HTML files. If working on production code, read the rules here to become an expert in designing with this brand.

## Quick map

- `README.md` — brand context, content fundamentals, visual foundations (read first)
- `colors_and_type.css` — drop-in CSS variables for colors, type, radius, shadow, spacing
- `css.json` — structured token understanding source
- `components.css` — aggregated component CSS extracted from preview cards
- `components/index.json` — component index; consume `preview/component-{slug}.html` first, then `components/{slug}.json` for intent/variants, and `_evidence/{slug}.json` only as fallback when a future library includes it
- `library-consumption.json` — recommended downstream read order
- `preview/` — small HTML cards illustrating foundations and components

## Essentials at a glance

- Primary `#2f6c75` anchors the system in azul-petróleo de confiança pública; mineral surfaces `#fcfaf6` and `#f6f1ea` keep the atmosphere calma, cívica e humana.
- Radius `8px / 12px / 20px / 9999px` keeps the library contemporary without softness excessiva; pills belong only to chips, badges, and tiny indicators.
- Spacing runs on a `4px` base with `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`; default buttons are `40px`, compact controls `32px`, and inputs `44px`.
- Type uses `Spectral` for display and headings at weights `500–600`, `Inter` for body copy at `400–700`, and `ui-monospace, SFMono-Regular, Consolas, monospace` for technical data.
- Voice is serena, cívica e respeitosa: copy such as “Buscar falecido”, “Ver localização” and “Casos funerários” should feel clara, humana e nunca dramática.
- Shadows are quiet and layered in `5` steps, from `0 1px 2px 0 rgba(16,42,48,0.08)` to `0 28px 60px -18px rgba(16,42,48,0.26)`; depth supports hierarchy without espetáculo.
- Signature pattern: editorial headings in `Spectral` sit over areia borders `#ddd3c3` and pale surfaces, while petróleo accents frame search, navigation, and public-data emphasis.

## Components

| Slug | Name | Key Insight |
|------|------|-------------|
| button | Button | Calls to action feel institucionais e acolhedores: filled petróleo for primary action, areia-based secondary for lower urgency. |
| input | Input | Search and form fields privilege calm legibility with `44px` height, visible icon support, and restrained focus treatment. |
| card | Card | Cards read like civic records: quiet borders, editorial titles, and supporting metadata before any loud status cue. |
| table | Table | Data tables emphasize triagem pública with pale headers, compact filters, and semantic status colors that stay understated. |
| topnav | Topnav | The top navigation presents Memoriar as contemporary public service, balancing brand mark, search access, and calm wayfinding. |
| sidebar | Sidebar | The sidebar turns administrative density into orderly sections, using the primary container and accent bar for humane orientation. |
