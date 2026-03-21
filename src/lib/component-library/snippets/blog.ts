import type { ComponentSnippet } from "../types";

export const blogSnippets: ComponentSnippet[] = [
  {
    id: "article-grid",
    name: "Article Grid",
    description: "Grid layout for blog posts with thumbnail, title, excerpt, and metadata",
    category: "blog",
    tags: ["article-grid", "cards"],
    priority: 1,
    domain_hints: ["blog"],
    min_score: 1,
    fallback: true,
    fallback_for: ["blog"],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">View All &rarr;</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 h-48 rounded-t-xl flex items-center justify-center text-4xl">📝</div>
        <div class="p-6">
          <div class="flex gap-2 mb-2">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Technology</span>
          </div>
          <h3 class="text-lg font-bold leading-snug mb-2 text-gray-900 dark:text-white">Getting Started with Modern Web Development</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">An introduction to the tools and frameworks that power today's web. Learn the essentials to build great products.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Jan 15, 2024</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>
      </article>
      <article class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 h-48 rounded-t-xl flex items-center justify-center text-4xl">🎨</div>
        <div class="p-6">
          <div class="flex gap-2 mb-2">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400">Design</span>
          </div>
          <h3 class="text-lg font-bold leading-snug mb-2 text-gray-900 dark:text-white">Principles of Great UI Design in 2024</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">Discover the core principles that separate good design from great design. Practical tips you can apply today.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Feb 3, 2024</span>
            <span>·</span>
            <span>7 min read</span>
          </div>
        </div>
      </article>
      <article class="bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 h-48 rounded-t-xl flex items-center justify-center text-4xl">💡</div>
        <div class="p-6">
          <div class="flex gap-2 mb-2">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">Product</span>
          </div>
          <h3 class="text-lg font-bold leading-snug mb-2 text-gray-900 dark:text-white">How to Build Products Users Actually Love</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">User research, iteration, and feedback loops — the secret ingredients to products with real product-market fit.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Mar 20, 2024</span>
            <span>·</span>
            <span>10 min read</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Vertical timeline for blog posts, changelog, or career history",
    category: "blog",
    tags: ["timeline"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Timeline</h2>
    <div class="space-y-8">
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
          <div class="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <span class="text-xs text-gray-400 dark:text-gray-500">Q1 2024</span>
          <h3 class="font-semibold mt-1 text-gray-900 dark:text-white">Project Launch</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Initial release with core features. 500+ users in first week.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
          <div class="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <span class="text-xs text-gray-400 dark:text-gray-500">Q2 2024</span>
          <h3 class="font-semibold mt-1 text-gray-900 dark:text-white">Feature Expansion</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Added collaboration tools and analytics dashboard. Reached 5K users.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-violet-600 dark:bg-violet-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
          <div class="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <span class="text-xs text-gray-400 dark:text-gray-500">Q3 2024</span>
          <h3 class="font-semibold mt-1 text-gray-900 dark:text-white">Mobile App</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">iOS and Android apps launched. Cross-platform sync enabled.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
        </div>
        <div class="opacity-60">
          <span class="text-xs text-gray-400 dark:text-gray-500">Q4 2024</span>
          <h3 class="font-semibold mt-1 text-gray-900 dark:text-white">Enterprise Plan</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Coming soon — dedicated support, SSO, and custom integrations.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "table-of-contents",
    name: "Table of Contents",
    description: "Sidebar table of contents for long-form blog or documentation pages",
    category: "blog",
    tags: ["table-of-contents"],
    priority: 3,
    domain_hints: ["blog"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
    <aside class="lg:w-64 flex-shrink-0">
      <div class="sticky top-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">On This Page</h3>
        <nav id="toc-nav">
          <ul class="space-y-2 text-sm">
            <li><a href="#intro" class="toc-link text-blue-600 dark:text-blue-400 font-medium">Introduction</a></li>
            <li><a href="#setup" class="toc-link text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Getting Started</a></li>
            <li class="pl-4"><a href="#install" class="toc-link text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Installation</a></li>
            <li class="pl-4"><a href="#config" class="toc-link text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Configuration</a></li>
            <li><a href="#usage" class="toc-link text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Usage Guide</a></li>
            <li><a href="#advanced" class="toc-link text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Advanced Topics</a></li>
            <li><a href="#faq" class="toc-link text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a></li>
          </ul>
        </nav>
      </div>
    </aside>
    <main class="flex-1">
      <h1 id="intro" class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Introduction</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">Welcome to the documentation. This guide will walk you through everything you need to know to get started and become productive quickly.</p>
      <h2 id="setup" class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Getting Started</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">Follow these steps to set up your environment and start building. The process takes about 5 minutes.</p>
      <h3 id="install" class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Installation</h3>
      <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 mb-6"><pre><code>npm install your-package</code></pre></div>
      <h3 id="config" class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Configuration</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-8">Configure your settings in the config file. See the reference for all available options.</p>
    </main>
  </div>
</section>`,
  },
  {
    id: "reading-progress",
    name: "Reading Progress Bar",
    description: "Fixed top reading progress bar that tracks scroll position",
    category: "blog",
    tags: ["reading-progress", "progress"],
    priority: 2,
    domain_hints: ["blog"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<div id="reading-progress-wrap">
  <div id="reading-progress-bar" style="position:fixed;top:0;left:0;height:3px;background:#2563eb;width:0%;z-index:9999;transition:width 0.1s linear;"></div>
</div>
<section class="py-12 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <div class="flex gap-2 mb-4">
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Article</span>
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">8 min read</span>
      </div>
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Modern Web Architecture</h1>
      <p class="text-gray-400 dark:text-gray-500 text-sm">Published March 15, 2024 · By Jane Doe</p>
    </div>
    <div>
      <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">Modern web architecture has evolved dramatically over the past decade. From monolithic applications to microservices, from server-side rendering to client-side single-page applications and back to server-side again with modern frameworks.</p>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">The key principles remain constant: performance, scalability, maintainability, and developer experience. Each architectural decision involves trade-offs that must align with your specific use case and team capabilities.</p>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Understanding these patterns and knowing when to apply them is what separates senior engineers from junior ones. This guide provides a practical framework for making these decisions confidently.</p>
    </div>
  </div>
</section>
<script>
  (function() {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar) return;
    function update() {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();
</script>`,
  },
  {
    id: "blog-category-tabs",
    name: "Blog Category Tabs",
    description: "Blog article grid with Preline tab filter by category",
    category: "blog",
    tags: ["article-grid", "cards"],
    priority: 2,
    domain_hints: ["blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Browse by Category</h2>
    <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav class="flex gap-x-1" data-hs-tabs aria-label="Blog categories">
        <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 border-b-2 border-blue-600 text-sm font-medium text-blue-600 dark:border-blue-500 dark:text-blue-500" id="tab-all" data-hs-tab="#tab-panel-all" aria-controls="tab-panel-all">
          All
        </button>
        <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" id="tab-tech" data-hs-tab="#tab-panel-tech" aria-controls="tab-panel-tech">
          Technology
        </button>
        <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" id="tab-design" data-hs-tab="#tab-panel-design" aria-controls="tab-panel-design">
          Design
        </button>
      </nav>
    </div>
    <div id="tab-panel-all">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-3">Technology</span>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Getting Started with AI Tools</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">A practical intro to integrating AI into your development workflow.</p>
          <div class="text-xs text-gray-400 dark:text-gray-500 mt-3">Mar 10 · 6 min</div>
        </article>
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400 mb-3">Design</span>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Color Theory for Web Designers</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">How to use color psychology to improve your UI conversions.</p>
          <div class="text-xs text-gray-400 dark:text-gray-500 mt-3">Feb 22 · 8 min</div>
        </article>
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400 mb-3">Technology</span>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Understanding TypeScript Generics</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Deep dive into TypeScript generics with real-world examples.</p>
          <div class="text-xs text-gray-400 dark:text-gray-500 mt-3">Jan 30 · 12 min</div>
        </article>
      </div>
    </div>
    <div id="tab-panel-tech" class="hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Getting Started with AI Tools</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">A practical intro to integrating AI into your development workflow.</p>
        </article>
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Understanding TypeScript Generics</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Deep dive into TypeScript generics with real-world examples.</p>
        </article>
      </div>
    </div>
    <div id="tab-panel-design" class="hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">Color Theory for Web Designers</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">How to use color psychology to improve your UI conversions.</p>
        </article>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "blog-single-article",
    name: "Blog Single Article Layout",
    description: "Full single article page with author bio, tags, and social share",
    category: "blog",
    tags: ["article-grid"],
    priority: 3,
    domain_hints: ["blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Development</span>
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">10 min read</span>
      </div>
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Building Scalable APIs with Node.js</h1>
      <div class="flex items-center gap-3 mt-4">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">JD</div>
        <div>
          <div class="font-medium text-sm text-gray-900 dark:text-white">Jane Doe</div>
          <div class="text-xs text-gray-400 dark:text-gray-500">April 5, 2024 · Senior Engineer</div>
        </div>
      </div>
    </div>
    <div class="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
      <p>Building a robust API that can scale to handle millions of requests requires careful planning. This guide covers the most important patterns and best practices.</p>
      <p>Rate limiting, caching, database connection pooling, and horizontal scaling are all critical components. We'll explore each in detail with working code examples.</p>
      <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100"><pre><code>app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));</code></pre></div>
      <p>The key insight is that scalability is not an afterthought — it must be designed in from the very beginning of your API architecture.</p>
    </div>
    <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap gap-2">
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400">Node.js</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400">APIs</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400">Scalability</span>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "blog-accordion-toc",
    name: "Blog Accordion Table of Contents",
    description: "Collapsible table of contents using Preline hs-accordion-group",
    category: "blog",
    tags: ["table-of-contents"],
    priority: 3,
    domain_hints: ["blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <div class="hs-accordion-group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div class="hs-accordion active" id="toc-accordion">
        <button class="hs-accordion-toggle w-full flex items-center justify-between gap-x-3 py-4 px-6 font-semibold text-start text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" aria-controls="toc-accordion-content">
          Table of Contents
          <svg class="hs-accordion-active:rotate-180 size-4 text-gray-600 dark:text-gray-300 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="toc-accordion-content" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="toc-accordion">
          <div class="bg-white dark:bg-gray-800 px-6 pb-5">
            <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li><a href="#intro" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Introduction</a></li>
              <li><a href="#setup" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Setting Up Your Environment</a></li>
              <li><a href="#install" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4">Installation Steps</a></li>
              <li><a href="#usage" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Basic Usage</a></li>
              <li><a href="#advanced" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Advanced Configuration</a></li>
              <li><a href="#faq" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Frequently Asked Questions</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 space-y-6 text-gray-600 dark:text-gray-300">
      <h2 id="intro" class="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
      <p>This guide covers everything you need to know to get started quickly and effectively.</p>
      <h2 id="setup" class="text-2xl font-bold text-gray-900 dark:text-white">Setting Up Your Environment</h2>
      <p>Before you begin, ensure your development environment meets the minimum requirements listed in the prerequisites section.</p>
    </div>
  </div>
</section>`,
  },
];
