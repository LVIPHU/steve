import type { ComponentSnippet } from "../types";

export const navbarSnippets: ComponentSnippet[] = [
  {
    id: "navbar-simple",
    name: "Navbar Simple",
    description: "Clean navigation bar with logo, links, and action button",
    category: "navbar",
    tags: ["navbar"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "portfolio", "blog", "generic"],
    html: `<nav class="navbar bg-base-100 shadow-sm px-6">
  <div class="navbar-start">
    <a href="/" class="text-xl font-bold text-primary">Brand</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1 gap-1">
      <li><a href="#" class="rounded-lg">Home</a></li>
      <li><a href="#" class="rounded-lg">About</a></li>
      <li><a href="#" class="rounded-lg">Services</a></li>
      <li><a href="#" class="rounded-lg">Contact</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a href="#" class="btn btn-primary btn-sm">Get Started</a>
  </div>
</nav>`,
  },
  {
    id: "navbar-dropdown",
    name: "Navbar with Dropdown",
    description: "Navigation bar with dropdown menus for nested navigation",
    category: "navbar",
    tags: ["navbar", "features"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<nav class="navbar bg-base-100 shadow-sm px-6">
  <div class="navbar-start">
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Home</a></li>
        <li>
          <a>Products</a>
          <ul class="p-2">
            <li><a>Feature A</a></li>
            <li><a>Feature B</a></li>
          </ul>
        </li>
        <li><a>Pricing</a></li>
        <li><a>About</a></li>
      </ul>
    </div>
    <a href="/" class="text-xl font-bold text-primary ml-2">Brand</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1 gap-1">
      <li><a class="rounded-lg">Home</a></li>
      <li>
        <details>
          <summary class="rounded-lg">Products</summary>
          <ul class="p-2 z-[1] bg-base-100 rounded-box shadow w-40">
            <li><a>Feature A</a></li>
            <li><a>Feature B</a></li>
          </ul>
        </details>
      </li>
      <li><a class="rounded-lg">Pricing</a></li>
      <li><a class="rounded-lg">About</a></li>
    </ul>
  </div>
  <div class="navbar-end gap-2">
    <a href="#" class="btn btn-ghost btn-sm">Log in</a>
    <a href="#" class="btn btn-primary btn-sm">Sign up</a>
  </div>
</nav>`,
  },
  {
    id: "navbar-mobile",
    name: "Navbar Mobile Friendly",
    description: "Responsive navbar with hamburger menu for mobile",
    category: "navbar",
    tags: ["navbar"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<nav class="navbar bg-base-100 shadow-sm px-4" id="main-nav">
  <div class="navbar-start">
    <a href="/" class="text-xl font-bold">Brand</a>
  </div>
  <div class="navbar-end">
    <div class="hidden md:flex items-center gap-4">
      <a href="#" class="link link-hover">Home</a>
      <a href="#" class="link link-hover">About</a>
      <a href="#" class="link link-hover">Work</a>
      <a href="#" class="btn btn-primary btn-sm">Contact</a>
    </div>
    <button class="btn btn-ghost md:hidden" id="nav-toggle" aria-label="Toggle menu">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path id="nav-icon-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        <path id="nav-icon-close" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  <div id="mobile-menu" class="hidden w-full bg-base-100 border-t border-base-200">
    <ul class="menu p-4 gap-1">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Work</a></li>
      <li><a href="#" class="btn btn-primary btn-sm mt-2">Contact</a></li>
    </ul>
  </div>
  <script>
    (function() {
      const toggle = document.getElementById('nav-toggle');
      const menu = document.getElementById('mobile-menu');
      const iconOpen = document.getElementById('nav-icon-open');
      const iconClose = document.getElementById('nav-icon-close');
      if (toggle && menu) {
        toggle.addEventListener('click', function() {
          menu.classList.toggle('hidden');
          iconOpen.classList.toggle('hidden');
          iconClose.classList.toggle('hidden');
        });
      }
    })();
  </script>
</nav>`,
  },
];
