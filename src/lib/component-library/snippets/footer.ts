import type { ComponentSnippet } from "../types";

export const footerSnippets: ComponentSnippet[] = [
  {
    id: "footer-simple",
    name: "Footer Simple",
    description: "Clean footer with logo, links, and copyright",
    category: "footer",
    tags: ["footer"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "portfolio", "blog", "generic", "dashboard"],
    html: `<footer class="bg-gray-100 dark:bg-gray-900 py-10 px-6">
  <div class="max-w-5xl mx-auto text-center">
    <div class="text-3xl font-black text-blue-600 dark:text-blue-400 mb-3">Site Name</div>
    <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto text-sm mb-6">Share knowledge and experiences. Thank you for visiting!</p>
    <nav aria-label="Footer navigation">
      <ul class="flex flex-wrap justify-center gap-6">
        <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200 transition-colors">Home</a></li>
        <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200 transition-colors">Articles</a></li>
        <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200 transition-colors">About</a></li>
        <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-gray-200 transition-colors">Contact</a></li>
      </ul>
    </nav>
    <p class="text-gray-400 dark:text-gray-600 text-sm mt-6">&copy; 2024 Site Name. All rights reserved.</p>
  </div>
</footer>`,
  },
  {
    id: "footer-multicolumn",
    name: "Footer Multi-Column",
    description: "Multi-column footer with grouped navigation links",
    category: "footer",
    tags: ["footer"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<footer class="bg-gray-900 dark:bg-gray-950 py-12 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <div>
        <div class="text-2xl font-black text-white mb-3">Brand</div>
        <p class="text-gray-400 text-sm max-w-xs">Your trusted partner for building the future. Since 2020.</p>
      </div>
      <nav aria-label="Product links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Product</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Features</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Changelog</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
        </ul>
      </nav>
      <nav aria-label="Company links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Company</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">About</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Careers</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Press</a></li>
        </ul>
      </nav>
      <nav aria-label="Legal links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Legal</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-gray-800 pt-6">
      <p class="text-sm text-gray-600 text-center">&copy; 2024 Brand Inc. All rights reserved.</p>
    </div>
  </div>
</footer>`,
  },
  {
    id: "footer-minimal",
    name: "Footer Minimal",
    description: "Minimal single-line footer with copyright and social links",
    category: "footer",
    tags: ["footer"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<footer class="border-t border-gray-200 dark:border-gray-700 py-8 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-gray-400 dark:text-gray-600 text-sm">&copy; 2024 Your Name. All rights reserved.</p>
    <div class="flex gap-6">
      <a href="#" class="text-gray-400 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm">Twitter</a>
      <a href="#" class="text-gray-400 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm">GitHub</a>
      <a href="#" class="text-gray-400 hover:text-gray-900 dark:text-gray-600 dark:hover:text-gray-200 transition-colors text-sm">LinkedIn</a>
    </div>
  </div>
</footer>`,
  },
  {
    id: "footer-newsletter",
    name: "Footer with Newsletter",
    description: "Footer with newsletter signup form and social links",
    category: "footer",
    tags: ["footer"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
  <div class="max-w-6xl mx-auto px-6 py-12">
    <div class="flex flex-col lg:flex-row gap-10 lg:items-start justify-between mb-10">
      <div class="max-w-sm">
        <div class="text-2xl font-black text-gray-900 dark:text-white mb-3">Brand</div>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">Stay in the loop — get the latest updates, tutorials, and tips delivered to your inbox.</p>
        <form class="flex gap-2" onsubmit="return false;" aria-label="Newsletter signup">
          <input type="email" placeholder="Enter your email" class="flex-1 min-w-0 py-2.5 px-4 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500" aria-label="Email address" />
          <button type="submit" class="py-2.5 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0">Subscribe</button>
        </form>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
        <nav aria-label="Product links">
          <h6 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Product</h6>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Docs</a></li>
          </ul>
        </nav>
        <nav aria-label="Company links">
          <h6 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Company</h6>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Careers</a></li>
          </ul>
        </nav>
        <nav aria-label="Social links">
          <h6 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Social</h6>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">GitHub</a></li>
            <li><a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">LinkedIn</a></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <p class="text-sm text-gray-500 dark:text-gray-500 text-center">&copy; 2024 Brand Inc. All rights reserved.</p>
    </div>
  </div>
</footer>`,
  },
  {
    id: "footer-back-to-top",
    name: "Footer with Back to Top",
    description: "Footer with 4-column layout and a back-to-top button",
    category: "footer",
    tags: ["footer"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<footer class="bg-gray-900 dark:bg-gray-950 pt-12 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
      <nav aria-label="Features links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Features</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Overview</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Integrations</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Security</a></li>
        </ul>
      </nav>
      <nav aria-label="Solutions links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Solutions</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Startups</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Education</a></li>
        </ul>
      </nav>
      <nav aria-label="Resources links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Resources</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">API Reference</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Status</a></li>
        </ul>
      </nav>
      <nav aria-label="Company links">
        <h6 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Company</h6>
        <ul class="space-y-2">
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">About</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
          <li><a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="py-6 flex items-center justify-between">
      <p class="text-sm text-gray-600">&copy; 2024 Brand Inc. All rights reserved.</p>
      <button id="back-to-top" aria-label="Back to top" class="size-9 flex justify-center items-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
      </button>
    </div>
  </div>
  <script>
    (function(){
      var btn = document.getElementById('back-to-top');
      if (btn) {
        btn.addEventListener('click', function() {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    })();
  </script>
</footer>`,
  },
];
