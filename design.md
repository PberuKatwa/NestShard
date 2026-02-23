# Design System — Luxury Real Estate Blog

> This document captures the design philosophy, tokens, and component patterns for the blog page. All contributors and AI-assisted tools should reference this to maintain visual consistency.

---

## Philosophy

The aesthetic is **luxury, editorial, and warm** — not sterile or corporate. Every decision should feel like a premium property brochure: generous whitespace, rich typography, gold accents, and photography-forward layouts. Interactions are smooth and deliberate — never jarring.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `ivory` | `#FDFDFB` | Primary page background, light section fills |
| `charcoal` | `#1A1A1A` | Primary text, dark section backgrounds, overlays |
| `soft-gold` | `#C0A067` | Primary accent — CTAs, active states, badges, icons |
| `dark-gold` | `#A78B58` | Hover state for gold elements |
| `light-gray` | `#F5F5F5` | Secondary section backgrounds, filter bars |
| `white` | `#FFFFFF` | Card surfaces, form inputs |

### Opacity Conventions
- `charcoal/60` — Secondary/meta text (dates, labels)
- `charcoal/70` — Body/description text
- `charcoal/80` — Overlay backgrounds on images (e.g. category badges)
- `charcoal/10` — Very subtle backgrounds (icon wells, hover fills)
- `ivory/80` — Body text on dark backgrounds
- `ivory/60` — Fine print on dark backgrounds
- `ivory/20` — Subtle borders on dark backgrounds
- `ivory/10` — Input background on dark backgrounds

---

## Typography

| Role | Font | Tailwind Class |
|---|---|---|
| Display / Headings | Playfair Display (serif) | `font-display` |
| Body / UI | Poppins (sans-serif) | `font-sans` (default) |

### Scale in Use

| Element | Classes |
|---|---|
| Hero / Featured title | `font-display text-3xl md:text-4xl font-bold text-charcoal` |
| Card heading (H3) | `font-display text-2xl font-bold text-charcoal` |
| Section label (eyebrow) | `text-soft-gold font-semibold tracking-widest uppercase text-sm` |
| Body / excerpt | `text-charcoal/70 text-base` |
| Meta (date, tags) | `text-sm text-charcoal/60` |
| Fine print | `text-sm text-ivory/60` (on dark) |

### Heading Hover
Card headings should transition to gold on hover:
```
hover:text-soft-gold transition-colors
```

---

## Spacing & Layout

- **Section padding:** `py-20` (standard), `py-12` (compact, e.g. filter bar)
- **Container:** `container mx-auto px-6`
- **Max content width:** `max-w-6xl mx-auto` for featured/editorial content
- **Card grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Card padding:** `p-6` (body), `p-8 lg:p-12` (featured article copy panel)

---

## Section Backgrounds — Alternation Pattern

Alternate backgrounds to visually separate sections without hard borders:

| Section | Background |
|---|---|
| Featured article | `bg-ivory` |
| Filter / category bar | `bg-light-gray` + `border-b border-charcoal/10` |
| Blog grid | `bg-ivory` |
| Newsletter CTA | `bg-charcoal text-ivory` |

---

## Components

### Blog Card (Standard)

Used in the 3-column grid. Dynamic data replaces all placeholder content.

```html
<article class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
  data-aos="fade-up" data-aos-delay="100">

  <!-- Image -->
  <div class="relative h-64">
    <img src="{signed_url}" alt="{title}" class="w-full h-full object-cover">
  </div>

  <!-- Body -->
  <div class="p-6">
    <!-- Meta -->
    <div class="flex items-center gap-3 text-sm text-charcoal/60 mb-3">
      <span class="flex items-center">
        <i data-lucide="calendar" class="w-4 h-4 mr-1"></i>
        {formatted_date}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-display text-2xl font-bold text-charcoal mb-3 hover:text-soft-gold transition-colors">
      <a href="blog-post.html?id={id}">{title}</a>
    </h3>

    <!-- Excerpt -->
    <p class="text-charcoal/70 mb-4">{content.substring(0, 120)}...</p>

    <!-- CTA -->
    <a href="blog-post.html?id={id}"
      class="inline-flex items-center text-soft-gold font-semibold hover:text-dark-gold transition-colors">
      Read More <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
    </a>
  </div>
</article>
```

**Hover behavior:** Cards lift (`hover:-translate-y-2`) and deepen shadow (`hover:shadow-2xl`) on hover. Title turns gold.

**AOS animation:** `data-aos="fade-up"` with staggered `data-aos-delay` (100 / 200 / 300ms cycling per row).

---

### Featured Article (Hero Card)

Full-width split layout — image left, editorial content right.

```html
<div class="bg-white rounded-lg overflow-hidden shadow-2xl" data-aos="fade-up">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
    <!-- Image panel -->
    <div class="relative h-96 lg:h-auto">
      <img src="{image}" class="w-full h-full object-cover">
      <span class="absolute top-6 left-6 bg-soft-gold text-charcoal text-xs font-bold uppercase px-4 py-2 rounded-full">
        Featured
      </span>
    </div>
    <!-- Content panel -->
    <div class="p-8 lg:p-12 flex flex-col justify-center">
      <!-- Meta, title, excerpt, CTA -->
    </div>
  </div>
</div>
```

**Note:** The featured badge uses `bg-soft-gold text-charcoal` (inverted from card category badges which use `bg-charcoal/80 text-ivory`).

---

### Category Filter Bar

Pill-shaped buttons. Active state uses `bg-soft-gold`; inactive uses `bg-white` with a gold hover.

```html
<button class="px-6 py-2 bg-soft-gold text-charcoal rounded-full font-semibold hover:bg-dark-gold transition-colors">
  All Posts
</button>
<button class="px-6 py-2 bg-white text-charcoal rounded-full font-semibold hover:bg-soft-gold transition-colors">
  Market Trends
</button>
```

---

### Pagination

Number buttons are squares (`w-10 h-10 rounded-md`). Active page: `bg-soft-gold text-charcoal`. Inactive: `bg-white text-charcoal hover:bg-soft-gold`. Disabled arrows: `disabled:opacity-50`.

---

### Contact Info Cards

Icon wells use `bg-soft-gold/10 text-soft-gold` — a subtle gold tint, not full gold fill.

```html
<div class="flex-shrink-0 w-12 h-12 bg-soft-gold/10 text-soft-gold rounded-full flex items-center justify-center">
  <i data-lucide="map-pin" class="w-6 h-6"></i>
</div>
```

Social icon circles: `bg-charcoal/5` rest, `hover:bg-soft-gold hover:text-white` active.

---

### Newsletter / CTA Section

Dark section (`bg-charcoal text-ivory`). Gold icon, gold ring on input focus, gold submit button.

```html
<input class="flex-1 bg-ivory/10 text-white px-6 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-soft-gold border border-ivory/20">
<button class="bg-soft-gold text-charcoal px-8 py-4 rounded-md font-semibold hover:bg-dark-gold transition-colors">
  Subscribe Now
</button>
```

---

### Primary CTA Button (Forms / Submit)

```html
<button class="w-full bg-charcoal text-ivory px-8 py-4 rounded-md text-lg font-semibold hover:bg-soft-gold hover:text-charcoal shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
  Send Message
</button>
```

Charcoal base that flips to gold on hover — reinforces the luxury inversion pattern.

---

### Form Inputs

```html
<input class="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-soft-gold focus:border-transparent transition-all">
```

Soft border at rest, gold ring on focus. No harsh outlines.

---

## Interaction & Motion

| Pattern | Value |
|---|---|
| Standard transition | `transition-colors` |
| Card hover | `transition-all duration-500` |
| Button lift | `transform hover:-translate-y-0.5` |
| Card lift | `transform hover:-translate-y-2` |
| Scroll animation library | AOS (Animate On Scroll) |
| Default AOS effect | `data-aos="fade-up"` |
| Stagger delay cycle | 100ms → 200ms → 300ms (reset per row) |

---

## Icons

All icons use **Lucide** (`data-lucide="..."`) initialized with `window.lucide.createIcons()`. Standard sizes: `w-4 h-4` inline, `w-5 h-5` pagination/nav, `w-6 h-6` info cards, `w-16 h-16` section hero icons.

---

## Do's & Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Use `font-display` (Playfair) for all headings | Use Poppins for headings |
| Use soft-gold as the single accent color | Introduce new accent colors |
| Alternate `ivory` / `light-gray` / `charcoal` section backgrounds | Stack same backgrounds |
| Use `rounded-lg` on cards, `rounded-full` on pills/badges | Mix border radii arbitrarily |
| Animate with AOS `fade-up` + stagger | Use abrupt or instant reveals |
| Use `shadow-lg` at rest, `shadow-2xl` on hover | Use flat cards with no shadow |
| Keep image containers fixed height (`h-64`, `h-96`) with `object-cover` | Let images reflow and distort |
