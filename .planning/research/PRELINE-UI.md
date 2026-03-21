# Preline UI — Comprehensive Reference

> Researched 2026-03-21. Source: https://preline.co/docs/

---

## 1. Installation & Setup

**NPM:**
```bash
npm i preline
npm install -D @tailwindcss/forms
```

**CSS (main stylesheet):**
```css
@import "tailwindcss";
@source "./node_modules/preline/dist/*.js";
@import "./node_modules/preline/variants.css";
@plugin "@tailwindcss/forms";
@import "./themes/theme.css";
```

**JavaScript (near closing `</body>`):**
```html
<script src="./node_modules/preline/dist/preline.js"></script>
```

**Dark mode CSS variant override:**
```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
```

---

## 2. Theming System

Preline uses **semantic color tokens** (CSS variables) rather than raw Tailwind palette classes. All tokens auto-adapt to light/dark.

| Token group | Examples |
|---|---|
| Foreground | `text-foreground`, `text-muted-foreground-1`, `text-muted-foreground-2`, `text-foreground-inverse` |
| Surfaces | `bg-layer`, `bg-surface`, `bg-surface-1`, `bg-surface-2`, `bg-surface-3`, `bg-surface-4` |
| Borders | `border-layer-line`, `border-line-2`, `border-line-3`, `border-card-line` |
| Primary | `bg-primary`, `bg-primary-hover`, `bg-primary-focus`, `bg-primary-active`, `text-primary`, `text-primary-foreground`, `border-primary-line` |
| Secondary | `bg-secondary`, `text-secondary-foreground` |
| Card | `bg-card`, `border-card-line`, `border-card-header`, `divide-card-divider` |
| Navbar | `bg-navbar`, `border-navbar-line`, `text-navbar-nav-foreground`, `bg-navbar-inverse` |
| Sidebar | `bg-sidebar`, `border-sidebar-line`, `bg-sidebar-nav-active`, `bg-sidebar-nav-hover` |
| Dropdown | `bg-dropdown`, `border-dropdown-line`, `text-dropdown-item-foreground`, `bg-dropdown-item-hover`, `divide-dropdown-divider` |
| Select | `bg-select`, `bg-select-item-hover`, `text-select-item-foreground` |
| Tooltip | `bg-tooltip`, `border-tooltip-line`, `text-tooltip-foreground` |
| Switch | `bg-switch`, `bg-primary-checked`, `border-primary-checked` |
| Muted | `bg-muted`, `bg-muted-hover`, `bg-muted-focus`, `text-muted-foreground` |
| Scrollbar | `bg-scrollbar-track`, `bg-scrollbar-thumb` |

**Built-in brand themes:** Default (Blue) · Harvest (Amber) · Ocean (Cyan) · Moon (Gray) · Retro · Autumn · Bubblegum · Cashmere · Olive

Applied via `data-theme="theme-{name}"` on `<html>`.

---

## 3. Dark Mode

**Mechanism:** `.dark` class on any ancestor activates all `dark:*` utilities.

**localStorage key:** `hs_theme` — values: `"light"` | `"dark"` | `"auto"`

**Anti-flash script (in `<head>`):**
```javascript
const isLight = localStorage.getItem('hs_theme') === 'light' ||
  (localStorage.getItem('hs_theme') === 'auto' &&
   !window.matchMedia('(prefers-color-scheme: dark)').matches);
if (!isLight) document.documentElement.classList.add('dark');
```

**Toggle data attributes:**
- `data-hs-theme-switch` — checkbox toggle
- `data-hs-theme-click-value="dark"` / `"light"` / `"auto"` — button-based switch

---

## 4. JavaScript Behavior Pattern

All interactive components use CSS classes prefixed `hs-` and data attributes `data-hs-*`. Components self-initialize via `preline.js`.

**State pseudo-classes used in Tailwind class strings:**
- `hs-accordion-active:*` — accordion open
- `hs-collapse-open:*` — collapse expanded
- `hs-dropdown-open:*` — dropdown visible
- `hs-tab-active:*` — active tab
- `hs-tooltip-shown:*` — tooltip visible
- `hs-overlay-open:*` — modal/overlay open
- `hs-stepper-active:*`, `hs-stepper-completed:*` — stepper states

**Required third-party:** Floating UI (dropdown, tooltip, popover, datepicker placement).

---

## 5. Components

### 5.1 Accordion

```html
<div class="hs-accordion-group">
  <div class="hs-accordion active" id="hs-basic-heading-one">
    <button class="hs-accordion-toggle hs-accordion-active:text-primary-active py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-foreground hover:text-muted-foreground-1"
      aria-expanded="true" aria-controls="hs-basic-collapse-one">
      <svg class="hs-accordion-active:hidden block size-3.5"><!-- plus --></svg>
      <svg class="hs-accordion-active:block hidden size-3.5"><!-- minus --></svg>
      Accordion #1
    </button>
    <div id="hs-basic-collapse-one" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region">
      <p class="text-foreground">Content here.</p>
    </div>
  </div>
</div>
```

**Always open:** `data-hs-accordion-always-open` on group.

**Bordered:**
```html
<div class="hs-accordion active bg-layer border border-layer-line -mt-px first:rounded-t-lg last:rounded-b-lg">
  <button class="hs-accordion-toggle py-4 px-5 inline-flex items-center gap-x-3 w-full font-semibold"><!-- ... --></button>
  <div class="hs-accordion-content"><div class="pb-4 px-5">Content</div></div>
</div>
```

**Nested:** wrap inner items in `<div class="hs-accordion-group ps-6">`.

---

### 5.2 Alert

```html
<!-- Soft info -->
<div class="bg-primary-100 border border-primary-200 text-primary-800 rounded-lg p-4 dark:bg-primary-500/20 dark:border-primary-900 dark:text-primary-400" role="alert">
  <div class="flex">
    <div class="shrink-0"><svg class="shrink-0 size-4 mt-0.5"><!-- info --></svg></div>
    <div class="ms-4">
      <h3 class="text-sm font-semibold">Info</h3>
      <div class="mt-1 text-sm">Alert message here.</div>
    </div>
  </div>
</div>

<!-- Dismissible -->
<div id="dismiss-alert" class="bg-teal-100 border border-teal-200 text-teal-800 rounded-lg p-4 dark:bg-teal-500/20 dark:border-teal-900 dark:text-teal-400" role="alert">
  <div class="flex justify-between">
    <p class="text-sm">Alert message</p>
    <button type="button" class="shrink-0 ms-auto" data-hs-remove-element="#dismiss-alert">
      <svg class="size-4"><!-- X --></svg>
    </button>
  </div>
</div>
```

Color variants: `primary` · `teal` (success) · `red` (error) · `yellow` (warning)

Dark mode pattern: `dark:bg-{color}-500/20 dark:border-{color}-900 dark:text-{color}-400`

---

### 5.3 Avatar

```html
<!-- Circular -->
<img class="inline-block size-11 rounded-full" src="..." alt="Avatar">

<!-- Rounded square -->
<img class="inline-block size-11 rounded-lg" src="..." alt="Avatar">

<!-- With status dot -->
<div class="relative inline-block">
  <img class="inline-block size-11 rounded-full" src="..." alt="Avatar">
  <span class="absolute bottom-0 end-0 block size-1.5 rounded-full ring-2 ring-layer bg-surface-3"></span>
</div>

<!-- Initials solid -->
<span class="inline-flex items-center justify-center size-11 rounded-full font-semibold bg-primary text-primary-foreground">AC</span>

<!-- Initials soft -->
<span class="inline-flex items-center justify-center size-11 text-sm font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-400">AC</span>

<!-- Initials outline -->
<span class="inline-flex items-center justify-center size-11 text-sm font-semibold rounded-full border border-primary text-primary">AC</span>

<!-- Media object -->
<div class="flex items-center gap-3">
  <img class="inline-block shrink-0 size-11 rounded-full" src="..." alt="">
  <div class="grow">
    <h3 class="font-semibold text-foreground">Mark Wanner</h3>
    <p class="text-sm font-medium text-muted-foreground-1">mark@gmail.com</p>
  </div>
</div>
```

**Sizes:** `size-6` · `size-8` · `size-9.5` · `size-11` · `size-15.5`

---

### 5.4 Badge

```html
<!-- Solid -->
<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-primary text-primary-foreground">Badge</span>

<!-- Soft (with dark mode) -->
<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-400">Badge</span>

<!-- Outline -->
<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border border-primary text-primary">Badge</span>

<!-- White/layer -->
<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-layer border border-layer-line text-layer-foreground shadow-2xs">Badge</span>

<!-- With dot indicator -->
<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-400">
  <span class="size-1.5 inline-block rounded-full bg-primary-800 dark:bg-primary-400"></span>
  Badge
</span>

<!-- Dismissible -->
<span id="dismiss-badge" class="inline-flex items-center gap-x-1.5 py-1.5 ps-3 pe-2 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-400">
  Badge
  <button type="button" class="shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-primary-200 dark:hover:bg-primary-900" data-hs-remove-element="#dismiss-badge">
    <svg><!-- X --></svg>
  </button>
</span>

<!-- Animated ping (notification dot) -->
<span class="flex absolute top-0 end-0 size-3">
  <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
  <span class="relative inline-flex rounded-full size-3 bg-red-500"></span>
</span>
```

---

### 5.5 Breadcrumb

```html
<!-- Chevron separators -->
<ol class="flex items-center whitespace-nowrap">
  <li class="inline-flex items-center">
    <a class="flex items-center text-sm text-muted-foreground-1 hover:text-primary-focus focus:outline-hidden focus:text-primary-focus" href="#">Home</a>
    <svg class="shrink-0 mx-2 size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
  </li>
  <li class="inline-flex items-center">
    <a class="flex items-center text-sm text-muted-foreground-1 hover:text-primary-focus focus:outline-hidden focus:text-primary-focus" href="#">
      App Center
      <svg class="shrink-0 mx-2 size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    </a>
  </li>
  <li class="inline-flex items-center text-sm font-semibold text-foreground truncate" aria-current="page">Application</li>
</ol>
```

---

### 5.6 Button

```html
<!-- Solid (primary) -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none">Solid</button>

<!-- Outline -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-layer-line text-muted-foreground-1 hover:border-primary-hover hover:text-primary-hover focus:outline-hidden focus:border-primary-focus focus:text-primary-focus disabled:opacity-50 disabled:pointer-events-none">Outline</button>

<!-- Ghost (with dark mode) -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-primary-600 hover:bg-primary-100 hover:text-primary-800 focus:outline-hidden focus:bg-primary-100 focus:text-primary-800 disabled:opacity-50 disabled:pointer-events-none dark:text-primary-500 dark:hover:bg-primary-500/20 dark:hover:text-primary-400 dark:focus:bg-primary-800/30 dark:focus:text-primary-400">Ghost</button>

<!-- Soft (with dark mode) -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200 focus:outline-hidden focus:bg-primary-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-500/20 dark:text-primary-400 dark:hover:bg-primary-500/30 dark:focus:bg-primary-500/30">Soft</button>

<!-- White/layer -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-layer-line bg-layer text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus disabled:opacity-50 disabled:pointer-events-none">White</button>

<!-- Link -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-primary hover:text-primary-hover focus:outline-hidden focus:text-primary-hover disabled:opacity-50 disabled:pointer-events-none">Link</button>

<!-- Loading -->
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none">
  <span class="animate-spin inline-block size-4 border-3 border-current border-t-transparent rounded-[999px]" role="status" aria-label="loading">
    <span class="sr-only">Loading...</span>
  </span>
  Loading
</button>
```

**Solid color variants:**

| Color | Key classes |
|---|---|
| Primary | `bg-primary border-primary-line text-primary-foreground` |
| Secondary | `bg-secondary border-secondary-line text-secondary-foreground` |
| Teal | `bg-teal-500 border-transparent text-foreground-inverse` |
| Red | `bg-red-500 border-transparent text-foreground-inverse` |
| Yellow | `bg-yellow-500 border-transparent text-foreground-inverse` |
| Dark/Plain | `bg-plain border-transparent text-inverse` |

---

### 5.7 Card

```html
<!-- Basic -->
<div class="flex flex-col bg-card border border-card-line shadow-2xs rounded-xl">
  <img class="w-full h-auto rounded-t-xl" src="..." alt="">
  <div class="p-4">
    <h3 class="font-semibold text-foreground">Card title</h3>
    <p class="mt-1 text-muted-foreground-1">Content text.</p>
    <a class="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover" href="#">Go somewhere</a>
  </div>
</div>

<!-- With header -->
<div class="flex flex-col bg-card border border-card-line shadow-2xs rounded-xl">
  <div class="bg-surface border-b border-card-line rounded-t-xl py-3 px-4">
    <p class="text-sm text-muted-foreground-1">Featured</p>
  </div>
  <div class="p-4"><h3 class="font-semibold text-foreground">Card title</h3></div>
</div>

<!-- With footer -->
<div class="flex flex-col bg-card border border-card-line shadow-2xs rounded-xl">
  <div class="p-4"><h3 class="font-semibold text-foreground">Card title</h3></div>
  <div class="bg-surface border-t border-card-line rounded-b-xl py-3 px-4">
    <p class="text-sm text-muted-foreground-1">Last updated 5 mins ago</p>
  </div>
</div>

<!-- Hover scale effect -->
<a class="flex flex-col group bg-card border border-card-line shadow-2xs rounded-xl overflow-hidden hover:shadow-lg transition" href="#">
  <div class="relative pt-[50%] overflow-hidden">
    <img class="size-full absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl" src="...">
  </div>
  <div class="p-4">Content</div>
</a>

<!-- Horizontal -->
<div class="sm:flex bg-card border border-card-line rounded-xl shadow-2xs">
  <div class="shrink-0 relative w-full rounded-t-xl overflow-hidden pt-[40%] sm:rounded-s-xl sm:max-w-60">
    <img class="size-full absolute top-0 start-0 object-cover" src="...">
  </div>
  <div class="flex flex-wrap"><div class="p-4 flex flex-col h-full sm:p-7">Content</div></div>
</div>

<!-- Card group (shared outer border) -->
<div class="grid border border-card-line rounded-xl shadow-2xs divide-y overflow-hidden sm:flex sm:divide-y-0 sm:divide-x divide-card-divider">
  <div class="flex flex-col flex-1 bg-card p-4">Card 1</div>
  <div class="flex flex-col flex-1 bg-card p-4">Card 2</div>
  <div class="flex flex-col flex-1 bg-card p-4">Card 3</div>
</div>

<!-- Top-accent border -->
<div class="flex flex-col bg-card border border-card-line border-t-4 border-t-primary shadow-2xs rounded-xl">
  <div class="p-4 md:p-5">Content</div>
</div>
```

---

### 5.8 Carousel

```html
<div id="hs-carousel" class="relative" data-hs-carousel='{"isAutoPlay": false, "isInfiniteLoop": false}'>
  <div class="hs-carousel relative w-full min-h-96 overflow-hidden">
    <div class="hs-carousel-body flex flex-nowrap absolute top-0 bottom-0 start-0 transition-transform duration-700">
      <div class="hs-carousel-slide">Slide 1</div>
      <div class="hs-carousel-slide">Slide 2</div>
      <div class="hs-carousel-slide">Slide 3</div>
    </div>
  </div>
  <button class="hs-carousel-prev absolute inset-y-0 start-0 inline-flex justify-center items-center w-12 h-full text-foreground hover:bg-muted-hover rounded-s-xl">
    <span class="sr-only">Previous</span>
  </button>
  <button class="hs-carousel-next absolute inset-y-0 end-0 inline-flex justify-center items-center w-12 h-full text-foreground hover:bg-muted-hover rounded-e-xl">
    <span class="sr-only">Next</span>
  </button>
  <div class="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 gap-x-2"></div>
</div>
```

**Config options:** `isAutoPlay` · `isInfiniteLoop` · `isRTL` · `isDraggable` · `isCentered` · `isAutoHeight` · `isSnap` · `slidesQty: {"xs": 1, "sm": 3}`

---

### 5.9 Checkbox

```html
<!-- Default -->
<div class="flex items-center">
  <input type="checkbox" class="shrink-0 size-4 bg-transparent border-line-3 rounded-sm shadow-2xs text-primary focus:ring-0 focus:ring-offset-0 checked:bg-primary-checked checked:border-primary-checked disabled:opacity-50 disabled:pointer-events-none" id="hs-cb">
  <label for="hs-cb" class="text-sm ms-3 text-muted-foreground-1">Label</label>
</div>

<!-- Right-aligned card -->
<label for="hs-cb-right" class="flex items-center p-3 w-full bg-layer border border-layer-line rounded-lg text-sm">
  <span class="text-sm text-muted-foreground-1">Label</span>
  <input type="checkbox" class="shrink-0 ms-auto mt-0.5 size-4 bg-transparent border-line-3 rounded-sm shadow-2xs text-primary focus:ring-0 focus:ring-offset-0 checked:bg-primary-checked checked:border-primary-checked" id="hs-cb-right">
</label>
```

---

### 5.10 Collapse

```html
<button type="button" class="hs-collapse-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover"
  id="hs-collapse" aria-expanded="false" aria-controls="hs-collapse-heading" data-hs-collapse="#hs-collapse-heading">
  Collapse
  <svg class="hs-collapse-open:rotate-180 shrink-0 size-4"><!-- chevron --></svg>
</button>
<div id="hs-collapse-heading" class="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" role="region">
  <div class="mt-5">
    <p class="text-muted-foreground-1">Expandable content here.</p>
  </div>
</div>
```

---

### 5.11 Dropdown

```html
<div class="hs-dropdown relative inline-flex">
  <button id="hs-dropdown-default" type="button"
    class="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-layer border border-layer-line text-layer-foreground shadow-2xs hover:bg-layer-hover focus:outline-hidden focus:bg-layer-focus"
    aria-haspopup="menu" aria-expanded="false">
    Actions
    <svg class="hs-dropdown-open:rotate-180 size-4"><!-- chevron --></svg>
  </button>
  <div class="hs-dropdown-menu transition-[opacity,margin] hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-dropdown border border-dropdown-line shadow-md rounded-lg mt-2 p-1 space-y-0.5"
    role="menu" aria-orientation="vertical">
    <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:outline-hidden focus:bg-dropdown-item-focus" href="#">Newsletter</a>
    <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:outline-hidden focus:bg-dropdown-item-focus" href="#">Purchases</a>
    <div class="my-1 border-t border-dropdown-divider"></div>
    <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:outline-hidden focus:bg-dropdown-item-focus" href="#">Sign out</a>
  </div>
</div>
```

**Options (CSS variables on wrapper):**
- `[--trigger:hover]` — hover-triggered
- `[--placement:top]` / `bottom` / `left` / `right`
- `[--auto-close:inside]` / `outside` / `false`
- `[--strategy:fixed]`

---

### 5.12 Form Input

```html
<!-- Default -->
<input type="text" class="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none" placeholder="Placeholder">

<!-- Gray (no border) -->
<input type="text" class="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-surface border-transparent sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:bg-layer focus:border-primary-focus focus:ring-primary-focus" placeholder="Placeholder">

<!-- Underline -->
<input type="text" class="py-2.5 sm:py-3 px-0 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-line-2 sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-t-transparent focus:border-x-transparent focus:border-b-primary-focus focus:ring-0" placeholder="Placeholder">

<!-- Floating label -->
<div class="relative">
  <input type="email" id="hs-float-email" class="peer p-4 block w-full bg-layer border-layer-line rounded-lg sm:text-sm text-foreground placeholder:text-transparent focus:border-primary-focus focus:ring-primary-focus focus:pt-6 focus:pb-2 not-placeholder-shown:pt-6 not-placeholder-shown:pb-2 autofill:pt-6 autofill:pb-2" placeholder="you@email.com">
  <label for="hs-float-email" class="absolute top-0 start-0 p-4 h-full sm:text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent text-foreground origin-[0_0] peer-disabled:opacity-50 peer-focus:scale-90 peer-focus:translate-x-0.5 peer-focus:-translate-y-1.5 peer-focus:text-muted-foreground-1 peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:translate-x-0.5 peer-not-placeholder-shown:-translate-y-1.5 peer-not-placeholder-shown:text-muted-foreground-1">Email</label>
</div>

<!-- With start icon -->
<div class="relative">
  <input type="text" class="peer py-2.5 sm:py-3 px-4 ps-11 block w-full bg-layer border-layer-line rounded-lg sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus" placeholder="Name">
  <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
    <svg class="size-4 text-muted-foreground"><!-- icon --></svg>
  </div>
</div>

<!-- Error state -->
<input type="text" class="py-2.5 sm:py-3 px-4 block w-full bg-layer border-red-500 rounded-lg sm:text-sm text-foreground focus:border-red-500 focus:ring-red-500">
<p class="text-sm text-red-500 mt-2">Error message</p>

<!-- Success state -->
<input type="text" class="py-2.5 sm:py-3 px-4 block w-full bg-layer border-teal-500 rounded-lg sm:text-sm text-foreground focus:border-teal-500 focus:ring-teal-500">
<p class="text-sm text-teal-500 mt-2">Looks good!</p>
```

---

### 5.13 Modal

```html
<!-- Trigger -->
<button type="button" data-hs-overlay="#hs-basic-modal"
  class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover">
  Open Modal
</button>

<!-- Modal -->
<div id="hs-basic-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabindex="-1">
  <div class="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-lg sm:w-full m-3 sm:mx-auto pointer-events-auto">
    <div class="flex flex-col bg-layer border border-layer-line shadow-2xs rounded-xl pointer-events-auto">
      <div class="flex justify-between items-center py-3 px-4 border-b border-layer-line">
        <h3 class="font-bold text-foreground">Modal title</h3>
        <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full text-muted-foreground-2 hover:bg-muted-hover" data-hs-overlay="#hs-basic-modal">
          <svg class="shrink-0 size-4"><!-- X --></svg>
        </button>
      </div>
      <div class="p-4 overflow-y-auto">
        <p class="text-muted-foreground-1">Modal body content.</p>
      </div>
      <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-layer-line">
        <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-layer-line bg-layer text-layer-foreground shadow-2xs hover:bg-layer-hover" data-hs-overlay="#hs-basic-modal">Close</button>
        <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

**Sizes:** `sm:max-w-sm` · `sm:max-w-lg` · `sm:max-w-2xl` · fullscreen `w-full h-full m-0`

**Static backdrop:** `data-hs-overlay-backdrop="static"`

---

### 5.14 Navbar

```html
<!-- With mobile collapse -->
<header class="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full py-3 bg-navbar border-b border-navbar-line">
  <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
    <div class="flex items-center justify-between">
      <a class="flex-none text-xl font-semibold text-foreground" href="#">Brand</a>
      <div class="sm:hidden">
        <button type="button" class="hs-collapse-toggle relative size-9 flex justify-center items-center rounded-lg bg-layer border border-layer-line"
          aria-expanded="false" aria-controls="hs-navbar-menu" data-hs-collapse="#hs-navbar-menu">
          <svg class="hs-collapse-open:hidden shrink-0 size-4"><!-- hamburger --></svg>
          <svg class="hs-collapse-open:block hidden shrink-0 size-4"><!-- X --></svg>
        </button>
      </div>
    </div>
    <div id="hs-navbar-menu" class="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block">
      <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
        <a class="font-medium text-primary-active" href="#">Active</a>
        <a class="text-sm text-navbar-nav-foreground hover:text-primary-hover" href="#">Link</a>
      </div>
    </div>
  </nav>
</header>

<!-- Dark/inverse variant -->
<header class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full py-3 bg-navbar-inverse">
  <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
    <a class="flex-none text-xl font-semibold text-foreground-inverse" href="#">Brand</a>
    <div class="flex flex-row items-center gap-5">
      <a class="text-sm text-foreground-inverse/70 hover:text-foreground-inverse" href="#">Link</a>
    </div>
  </nav>
</header>
```

---

### 5.15 Pagination

```html
<!-- Basic -->
<nav class="flex items-center gap-x-1" aria-label="Pagination">
  <button type="button" class="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-foreground hover:bg-muted-hover disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous">
    <svg class="shrink-0 size-3.5"><!-- left --></svg>
    <span>Previous</span>
  </button>
  <div class="flex items-center gap-x-1">
    <button type="button" class="min-h-9.5 min-w-9.5 flex justify-center items-center bg-surface-1 text-foreground py-2 px-3 text-sm rounded-lg" aria-current="page">1</button>
    <button type="button" class="min-h-9.5 min-w-9.5 flex justify-center items-center text-foreground hover:bg-muted-hover py-2 px-3 text-sm rounded-lg">2</button>
    <button type="button" class="min-h-9.5 min-w-9.5 flex justify-center items-center text-foreground hover:bg-muted-hover py-2 px-3 text-sm rounded-lg">3</button>
  </div>
  <button type="button" class="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-foreground hover:bg-muted-hover disabled:opacity-50 disabled:pointer-events-none" aria-label="Next">
    <span>Next</span>
    <svg class="shrink-0 size-3.5"><!-- right --></svg>
  </button>
</nav>
```

---

### 5.16 Progress

```html
<!-- Basic -->
<div class="flex w-full h-1.5 bg-surface-1 rounded-full overflow-hidden" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
  <div class="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-primary-foreground text-center whitespace-nowrap transition duration-500" style="width: 25%"></div>
</div>

<!-- With label -->
<div>
  <div class="mb-2 flex justify-between items-center">
    <h3 class="text-sm font-medium text-foreground">Progress title</h3>
    <span class="text-sm text-foreground">50%</span>
  </div>
  <div class="flex w-full h-2 bg-surface-1 rounded-full overflow-hidden" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
    <div class="flex flex-col justify-center rounded-full overflow-hidden bg-primary transition duration-500" style="width: 50%"></div>
  </div>
</div>
```

Heights: `h-1.5` · `h-2` · `h-4` · `h-6`
Colors: `bg-primary` · `bg-teal-500` · `bg-red-500` · `bg-yellow-500`

---

### 5.17 Select

```html
<!-- Default -->
<select class="py-3 px-4 pe-9 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none">
  <option selected>Open this select menu</option>
  <option>1</option>
</select>

<!-- Error state -->
<select class="... border-red-500 focus:border-red-500 focus:ring-red-500">
<p class="text-sm text-red-600 mt-2">Please select a valid state.</p>
```

---

### 5.18 Sidebar

```html
<div id="hs-sidebar" class="hs-overlay [--auto-close:lg] sm:block w-64 -translate-x-full sm:translate-x-0 transition-all duration-300 h-full fixed top-0 start-0 z-60 bg-sidebar border-e border-sidebar-line" role="dialog" tabindex="-1">
  <header class="p-4 flex justify-between items-center">
    <a class="font-semibold text-xl text-foreground" href="#">Brand</a>
  </header>
  <nav class="h-full overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
    <ul class="space-y-1">
      <li><a href="#" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-sidebar-nav-foreground rounded-lg hover:bg-sidebar-nav-hover">Dashboard</a></li>
    </ul>
    <!-- Collapsible group -->
    <div class="hs-accordion-group" data-hs-accordion-always-open>
      <div class="hs-accordion">
        <button class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-sidebar-nav-foreground rounded-lg hover:bg-sidebar-nav-hover">
          Users
          <svg class="hs-accordion-active:block ms-auto hidden size-4"><!-- up --></svg>
          <svg class="hs-accordion-active:hidden ms-auto block size-4"><!-- down --></svg>
        </button>
        <div class="hs-accordion-content hidden">
          <ul class="pt-1 ps-7 space-y-1">
            <li><a class="py-2 px-2.5 text-sm text-sidebar-nav-foreground rounded-lg hover:bg-sidebar-nav-hover flex items-center gap-x-3.5" href="#">Sub Menu</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</div>
```

---

### 5.19 Spinner

```html
<div class="animate-spin inline-block size-6 border-3 border-current border-t-transparent rounded-[999px] text-primary" role="status" aria-label="loading">
  <span class="sr-only">Loading...</span>
</div>
```

Colors: `text-primary` · `text-foreground` · `text-teal-600` · `text-red-600` · `text-yellow-600`
Sizes: `size-4` · `size-6` · `size-8`

---

### 5.20 Stepper

```html
<div data-hs-stepper>
  <ul class="relative flex flex-row gap-x-2">
    <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 1}'>
      <div class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs align-middle">
        <span class="size-7 flex justify-center items-center shrink-0 bg-surface font-medium text-surface-foreground rounded-full hs-stepper-active:bg-primary-active hs-stepper-completed:bg-teal-500">
          <span class="hs-stepper-success:hidden hs-stepper-completed:hidden">1</span>
          <svg class="hs-stepper-success:block hidden shrink-0 size-3"><!-- checkmark --></svg>
        </span>
        <span class="ms-2 block text-sm font-medium text-foreground">Step 1</span>
      </div>
      <div class="w-full h-px flex-1 bg-surface-1 group-last:hidden hs-stepper-completed:bg-primary"></div>
    </li>
  </ul>
  <div class="mt-5">
    <div data-hs-stepper-content-item='{"index": 1}'>Content for step 1</div>
    <div class="hidden" data-hs-stepper-content-item='{"index": 2}'>Content for step 2</div>
    <div class="hidden" data-hs-stepper-content-item='{"isFinal": true}'>All done!</div>
  </div>
  <div class="mt-5 flex justify-between items-center gap-x-2">
    <button type="button" class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-layer-line bg-layer text-foreground shadow-2xs hover:bg-layer-hover" data-hs-stepper-back-btn>Back</button>
    <button type="button" class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover" data-hs-stepper-next-btn>Next</button>
    <button type="button" class="hidden py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover" data-hs-stepper-finish-btn>Finish</button>
  </div>
</div>
```

---

### 5.21 Switch (Toggle)

```html
<label for="hs-switch" class="relative inline-block w-11 h-6 cursor-pointer">
  <input type="checkbox" id="hs-switch" class="peer sr-only">
  <span class="absolute inset-0 bg-surface-1 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-primary-checked peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
  <span class="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-switch rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
</label>
```

**Sizes:** XS `w-9 h-5` · SM `w-11 h-6` · MD `w-13 h-7` · LG `w-15 h-8`

---

### 5.22 Table

```html
<div class="flex flex-col">
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full inline-block align-middle">
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-card-line">
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-muted-foreground-1 uppercase">Name</th>
              <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-muted-foreground-1 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-card-line">
            <tr class="hover:bg-muted-hover">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">John Brown</td>
              <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-primary hover:text-primary-hover">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

Striped: `odd:bg-surface even:bg-card` on `<tr>`

---

### 5.23 Tabs

```html
<!-- Underline tabs -->
<div class="border-b border-line-2">
  <nav class="-mb-px flex gap-x-6" role="tablist">
    <button type="button" class="hs-tab-active:font-semibold hs-tab-active:border-primary-active hs-tab-active:text-primary-active py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm text-muted-foreground-1 hover:text-primary-hover"
      id="tab-1" aria-selected="true" data-hs-tab="#panel-1" role="tab">Tab 1</button>
    <button type="button" class="hs-tab-active:font-semibold hs-tab-active:border-primary-active hs-tab-active:text-primary-active py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm text-muted-foreground-1 hover:text-primary-hover"
      id="tab-2" aria-selected="false" data-hs-tab="#panel-2" role="tab">Tab 2</button>
  </nav>
</div>
<div class="mt-3">
  <div id="panel-1" role="tabpanel"><p class="text-muted-foreground-1">Content 1</p></div>
  <div id="panel-2" class="hidden" role="tabpanel"><p class="text-muted-foreground-1">Content 2</p></div>
</div>

<!-- Segment/pill tabs -->
<div class="flex bg-surface rounded-lg p-1">
  <nav class="flex gap-x-1">
    <button type="button" class="hs-tab-active:bg-layer hs-tab-active:shadow-2xs hs-tab-active:text-foreground py-1.5 px-3 inline-flex items-center gap-x-2 text-sm text-muted-foreground-1 rounded-md hover:text-foreground"
      data-hs-tab="#seg-panel-1" role="tab">Tab 1</button>
  </nav>
</div>
```

---

### 5.24 Textarea

```html
<!-- Default -->
<textarea class="py-2 px-3 sm:py-3 sm:px-4 block w-full bg-layer border-layer-line rounded-lg sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb" rows="3" placeholder="Say hi..."></textarea>

<!-- Autoheight -->
<textarea data-hs-textarea-auto-height rows="3" class="..."></textarea>
```

---

### 5.25 Toast

```html
<div id="hs-toast" class="max-w-xs bg-layer border border-layer-line rounded-xl shadow-lg" role="alert">
  <div class="flex p-4">
    <div class="shrink-0">
      <svg class="shrink-0 size-4 text-teal-500 mt-0.5"><!-- check circle --></svg>
    </div>
    <div class="ms-3">
      <p class="text-sm text-foreground font-semibold">Success</p>
      <p class="text-sm text-muted-foreground-1 mt-1">Your action was completed.</p>
    </div>
    <button type="button" class="ms-auto shrink-0 size-5 inline-flex justify-center items-center rounded-full text-muted-foreground-2 hover:text-foreground hover:bg-muted-hover" data-hs-remove-element="#hs-toast">
      <svg class="size-3.5"><!-- X --></svg>
    </button>
  </div>
</div>
```

Dismiss: `data-hs-remove-element="#toast-id"` on close button.

---

### 5.26 Tooltip

```html
<div class="hs-tooltip [--placement:top] inline-block">
  <button type="button" class="hs-tooltip-toggle size-10 inline-flex justify-center items-center rounded-full bg-muted border border-line-2 text-muted-foreground-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary dark:hover:bg-primary-500/20 dark:hover:border-primary-900">
    <svg class="shrink-0 size-4"><!-- icon --></svg>
    <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-tooltip border border-tooltip-line text-xs font-medium text-tooltip-foreground rounded-md shadow-2xs" role="tooltip">
      Tooltip text
    </span>
  </button>
</div>
```

Placement: `[--placement:top]` · `right` · `bottom` · `left` · `auto`

---

## 6. Full Component Inventory

**Base:** Accordion · Alert · Avatar · Avatar Group · Badge · Blockquote · Button · Button Group · Card · Carousel · Chat Bubbles · Collapse · Datepicker · File Upload Progress · Legend Indicator · List · List Group · Progress · Ratings · Skeleton · Spinner · Static Icons · Stepper · Timeline · Toast · Tree View

**Navigation:** Navbar · Mega Menu · Navs · Tabs · Sidebar · Scrollspy · Breadcrumb · Pagination

**Forms:** Input · Input Group · Textarea · File Input · Checkbox · Radio · Switch · Select · Range Slider · Color Picker

**Advanced Forms:** Advanced Select · ComboBox · SearchBox · Input Number · Strong Password · Toggle Password · PIN Input · Copy Markup

**Overlays:** Dropdown · Context Menu · Modal · Offcanvas · Popover · Tooltip

**Tables:** Tables

**Third-party:** Charts · Datatables · File Upload (Dropzone) · WYSIWYG · Range Slider · Leaflet Maps · Confetti

---

## 7. Free Templates

| Name | Description |
|---|---|
| Agency | Landing page for agencies/studios |
| CMS | Admin dashboard (posts, members, content) |
| AI Chat | Conversational assistant demo |
| Coffee Shop | E-commerce product/checkout |
| Personal | CV/Resume profile page |

---

## 8. Key Conventions

1. **Semantic tokens first.** Use `bg-primary`, `text-foreground`, `border-layer-line` — not raw Tailwind palette for themed elements.
2. **Dark mode = `.dark` class** on `<html>`. Most tokens auto-adapt. Explicit `dark:bg-primary-500/20 dark:text-primary-400` for raw palette (badges, alerts).
3. **`hs-*` state pseudo-classes** go directly in Tailwind class strings: `hs-accordion-active:text-primary-active`.
4. **`data-hs-*` attributes** wire JS declaratively — no manual event listeners needed.
5. **`@tailwindcss/forms`** required for all form elements.
6. **`variants.css`** from npm provides the `hs-*` variant definitions Tailwind must resolve.
7. **Floating UI** required for Dropdown, Tooltip, Popover, Datepicker positioning.
8. `data-hs-remove-element="#id"` is the universal dismiss pattern for alerts, badges, toasts.
