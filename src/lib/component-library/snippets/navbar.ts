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
    html: `<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400">Brand</a>
    <ul class="hidden md:flex items-center gap-1" role="list">
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Home</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">About</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Services</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Contact</a></li>
    </ul>
    <a href="#" class="hidden md:inline-flex py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">Get Started</a>
    <button class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" data-hs-collapse="#navbar-mobile-menu" aria-expanded="false" aria-controls="navbar-mobile-menu" aria-label="Toggle menu">
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>
  <div id="navbar-mobile-menu" class="hs-collapse hidden md:hidden border-t border-gray-200 dark:border-gray-700">
    <ul class="px-6 py-4 space-y-1" role="list">
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Home</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">About</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Services</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Contact</a></li>
      <li class="pt-2"><a href="#" class="block py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center">Get Started</a></li>
    </ul>
  </div>
</header>`,
  },
  {
    id: "navbar-dropdown",
    name: "Navbar with Dropdown",
    description: "Navigation bar with Preline dropdown menus for nested navigation",
    category: "navbar",
    tags: ["navbar", "features"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400">Brand</a>
    <ul class="hidden lg:flex items-center gap-1" role="list">
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Home</a></li>
      <li>
        <div class="hs-dropdown relative inline-flex">
          <button class="hs-dropdown-toggle px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-x-1" aria-haspopup="menu" aria-expanded="false">
            Products
            <svg class="size-3.5 shrink-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="hs-dropdown-menu hidden opacity-0 transition-[opacity,margin] duration-200 absolute top-full start-0 mt-1 min-w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-1 dark:bg-gray-800 dark:border-gray-700" role="menu" aria-label="Products submenu">
            <a href="#" class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">Feature A</a>
            <a href="#" class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">Feature B</a>
            <a href="#" class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" role="menuitem">Feature C</a>
          </div>
        </div>
      </li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Pricing</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">About</a></li>
    </ul>
    <div class="hidden lg:flex items-center gap-2">
      <a href="#" class="py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">Log in</a>
      <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">Sign up</a>
    </div>
    <button class="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" data-hs-collapse="#navbar-dropdown-mobile" aria-expanded="false" aria-controls="navbar-dropdown-mobile" aria-label="Toggle menu">
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>
  <div id="navbar-dropdown-mobile" class="hs-collapse hidden lg:hidden border-t border-gray-200 dark:border-gray-700">
    <ul class="px-6 py-4 space-y-1" role="list">
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Home</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Products</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
      <li><a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">About</a></li>
    </ul>
  </div>
</header>`,
  },
  {
    id: "navbar-dark-toggle",
    name: "Navbar with Dark Mode Toggle",
    description: "Responsive navbar featuring a dark mode toggle button with sun/moon icons",
    category: "navbar",
    tags: ["navbar"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Brand</a>
    <ul class="hidden md:flex items-center gap-1" role="list">
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Home</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Features</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Pricing</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Blog</a></li>
    </ul>
    <div class="flex items-center gap-2">
      <button id="theme-toggle" type="button" class="size-9 flex justify-center items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" aria-label="Toggle dark mode">
        <svg class="hidden dark:block shrink-0 size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
        <svg class="block dark:hidden shrink-0 size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <a href="#" class="hidden md:inline-flex py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get Started</a>
    </div>
  </nav>
  <script>
    (function(){
      var btn=document.getElementById('theme-toggle');
      if(btn){btn.addEventListener('click',function(){
        var isDark=document.documentElement.classList.toggle('dark');
        localStorage.setItem('hs_theme',isDark?'dark':'light');
      });}
    })();
  </script>
</header>`,
  },
  {
    id: "navbar-mobile",
    name: "Navbar Mobile Friendly",
    description: "Responsive navbar with Preline collapse hamburger menu for mobile",
    category: "navbar",
    tags: ["navbar"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <nav class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Brand</a>
    <div class="hidden md:flex items-center gap-4">
      <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Home</a>
      <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</a>
      <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Work</a>
      <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Contact</a>
    </div>
    <button class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" data-hs-collapse="#navbar-mobile-collapse" aria-expanded="false" aria-controls="navbar-mobile-collapse" aria-label="Toggle menu">
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </nav>
  <div id="navbar-mobile-collapse" class="hs-collapse hidden md:hidden border-t border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4 space-y-1">
      <a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Home</a>
      <a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">About</a>
      <a href="#" class="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Work</a>
      <a href="#" class="block mt-2 py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center">Contact</a>
    </div>
  </div>
</header>`,
  },
  {
    id: "navbar-transparent",
    name: "Navbar Transparent",
    description: "Transparent overlay navbar for hero sections, transitions to solid on scroll",
    category: "navbar",
    tags: ["navbar"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <nav class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between" aria-label="Main navigation">
    <a href="/" class="text-xl font-bold text-white">Brand</a>
    <ul class="hidden md:flex items-center gap-1" role="list">
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors">Home</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors">Features</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors">Pricing</a></li>
      <li><a href="#" class="px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors">About</a></li>
    </ul>
    <a href="#" class="hidden md:inline-flex py-2 px-4 text-sm font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors">Get Started</a>
  </nav>
  <script>
    (function(){
      var header = document.getElementById('site-header');
      if (!header) return;
      function updateHeader() {
        if (window.scrollY > 50) {
          header.classList.add('bg-white', 'dark:bg-gray-900', 'border-b', 'border-gray-200', 'dark:border-gray-700', 'shadow-sm', 'py-0');
          header.querySelectorAll('a:not(.cta)').forEach(function(a) {
            a.classList.remove('text-white/90', 'hover:text-white', 'hover:bg-white/10');
            a.classList.add('text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-800');
          });
        } else {
          header.classList.remove('bg-white', 'dark:bg-gray-900', 'border-b', 'border-gray-200', 'dark:border-gray-700', 'shadow-sm');
        }
      }
      window.addEventListener('scroll', updateHeader);
      updateHeader();
    })();
  </script>
</header>`,
  },
];
