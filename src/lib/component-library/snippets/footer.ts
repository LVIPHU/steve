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
    html: `<footer class="footer footer-center p-10 bg-base-200 text-base-content">
  <aside>
    <div class="text-3xl font-black text-primary mb-2">Brand</div>
    <p class="text-base-content/60 max-w-sm text-center">Building better products for a better world. Trusted by thousands of teams worldwide.</p>
  </aside>
  <nav>
    <div class="grid grid-flow-col gap-6">
      <a href="#" class="link link-hover">About</a>
      <a href="#" class="link link-hover">Blog</a>
      <a href="#" class="link link-hover">Careers</a>
      <a href="#" class="link link-hover">Contact</a>
      <a href="#" class="link link-hover">Privacy</a>
    </div>
  </nav>
  <aside>
    <p class="text-base-content/40 text-sm">&copy; 2024 Brand. All rights reserved.</p>
  </aside>
</footer>`,
  },
  {
    id: "footer-multicolumn",
    name: "Footer Multi-Column",
    description: "Multi-column footer with grouped navigation links and newsletter",
    category: "footer",
    tags: ["footer"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<footer class="footer p-10 bg-neutral text-neutral-content">
  <aside>
    <div class="text-2xl font-black mb-2">Brand</div>
    <p class="text-neutral-content/60 max-w-xs text-sm">Your trusted partner for building the future. Since 2020.</p>
  </aside>
  <nav>
    <h6 class="footer-title">Product</h6>
    <a href="#" class="link link-hover text-sm">Features</a>
    <a href="#" class="link link-hover text-sm">Pricing</a>
    <a href="#" class="link link-hover text-sm">Changelog</a>
    <a href="#" class="link link-hover text-sm">Roadmap</a>
  </nav>
  <nav>
    <h6 class="footer-title">Company</h6>
    <a href="#" class="link link-hover text-sm">About</a>
    <a href="#" class="link link-hover text-sm">Blog</a>
    <a href="#" class="link link-hover text-sm">Careers</a>
    <a href="#" class="link link-hover text-sm">Press</a>
  </nav>
  <nav>
    <h6 class="footer-title">Legal</h6>
    <a href="#" class="link link-hover text-sm">Privacy Policy</a>
    <a href="#" class="link link-hover text-sm">Terms of Service</a>
    <a href="#" class="link link-hover text-sm">Cookie Policy</a>
  </nav>
</footer>
<div class="footer footer-center p-4 bg-neutral text-neutral-content/40 border-t border-neutral-content/10">
  <aside><p class="text-sm">&copy; 2024 Brand Inc. All rights reserved.</p></aside>
</div>`,
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
    html: `<footer class="border-t border-base-200 py-8 px-6">
  <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-base-content/40 text-sm">&copy; 2024 Your Name. All rights reserved.</p>
    <div class="flex gap-6">
      <a href="#" class="text-base-content/40 hover:text-primary transition-colors text-sm">Twitter</a>
      <a href="#" class="text-base-content/40 hover:text-primary transition-colors text-sm">GitHub</a>
      <a href="#" class="text-base-content/40 hover:text-primary transition-colors text-sm">LinkedIn</a>
    </div>
  </div>
</footer>`,
  },
];
