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
    html: `<section class="py-16 px-6 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold">Latest Articles</h2>
      <a href="#" class="btn btn-ghost btn-sm">View All &rarr;</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center text-4xl">📝</figure>
        <div class="card-body">
          <div class="flex gap-2 mb-2">
            <span class="badge badge-primary badge-sm">Technology</span>
          </div>
          <h3 class="card-title text-lg leading-snug">Getting Started with Modern Web Development</h3>
          <p class="text-base-content/60 text-sm line-clamp-3">An introduction to the tools and frameworks that power today's web. Learn the essentials to build great products.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-base-content/40">
            <span>Jan 15, 2024</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>
      </article>
      <article class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-secondary/20 to-accent/20 h-48 flex items-center justify-center text-4xl">🎨</figure>
        <div class="card-body">
          <div class="flex gap-2 mb-2">
            <span class="badge badge-secondary badge-sm">Design</span>
          </div>
          <h3 class="card-title text-lg leading-snug">Principles of Great UI Design in 2024</h3>
          <p class="text-base-content/60 text-sm line-clamp-3">Discover the core principles that separate good design from great design. Practical tips you can apply today.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-base-content/40">
            <span>Feb 3, 2024</span>
            <span>·</span>
            <span>7 min read</span>
          </div>
        </div>
      </article>
      <article class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-accent/20 to-primary/20 h-48 flex items-center justify-center text-4xl">💡</figure>
        <div class="card-body">
          <div class="flex gap-2 mb-2">
            <span class="badge badge-accent badge-sm">Product</span>
          </div>
          <h3 class="card-title text-lg leading-snug">How to Build Products Users Actually Love</h3>
          <p class="text-base-content/60 text-sm line-clamp-3">User research, iteration, and feedback loops — the secret ingredients to products with real product-market fit.</p>
          <div class="flex items-center gap-2 mt-4 text-xs text-base-content/40">
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
    html: `<section class="py-16 px-6 bg-base-200">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-12">Timeline</h2>
    <ul class="timeline timeline-vertical">
      <li>
        <div class="timeline-start timeline-box">
          <span class="text-xs text-base-content/50">Q1 2024</span>
          <h3 class="font-semibold mt-1">Project Launch</h3>
          <p class="text-sm text-base-content/60 mt-1">Initial release with core features. 500+ users in first week.</p>
        </div>
        <div class="timeline-middle">
          <div class="w-4 h-4 rounded-full bg-primary border-4 border-base-100"></div>
        </div>
        <hr class="bg-primary"/>
      </li>
      <li>
        <hr class="bg-primary"/>
        <div class="timeline-middle">
          <div class="w-4 h-4 rounded-full bg-secondary border-4 border-base-100"></div>
        </div>
        <div class="timeline-end timeline-box">
          <span class="text-xs text-base-content/50">Q2 2024</span>
          <h3 class="font-semibold mt-1">Feature Expansion</h3>
          <p class="text-sm text-base-content/60 mt-1">Added collaboration tools and analytics dashboard. Reached 5K users.</p>
        </div>
        <hr/>
      </li>
      <li>
        <hr/>
        <div class="timeline-start timeline-box">
          <span class="text-xs text-base-content/50">Q3 2024</span>
          <h3 class="font-semibold mt-1">Mobile App</h3>
          <p class="text-sm text-base-content/60 mt-1">iOS and Android apps launched. Cross-platform sync enabled.</p>
        </div>
        <div class="timeline-middle">
          <div class="w-4 h-4 rounded-full bg-accent border-4 border-base-100"></div>
        </div>
        <hr/>
      </li>
      <li>
        <hr/>
        <div class="timeline-middle">
          <div class="w-4 h-4 rounded-full bg-base-300 border-4 border-base-100"></div>
        </div>
        <div class="timeline-end timeline-box opacity-60">
          <span class="text-xs text-base-content/50">Q4 2024</span>
          <h3 class="font-semibold mt-1">Enterprise Plan</h3>
          <p class="text-sm text-base-content/60 mt-1">Coming soon — dedicated support, SSO, and custom integrations.</p>
        </div>
      </li>
    </ul>
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
    html: `<section class="py-12 px-6 bg-base-100">
  <div class="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
    <aside class="lg:w-64 flex-shrink-0">
      <div class="sticky top-6">
        <h3 class="text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-4">On This Page</h3>
        <nav id="toc-nav">
          <ul class="space-y-2 text-sm">
            <li><a href="#intro" class="toc-link text-primary font-medium">Introduction</a></li>
            <li><a href="#setup" class="toc-link text-base-content/60 hover:text-primary transition-colors">Getting Started</a></li>
            <li class="pl-4"><a href="#install" class="toc-link text-base-content/50 hover:text-primary transition-colors">Installation</a></li>
            <li class="pl-4"><a href="#config" class="toc-link text-base-content/50 hover:text-primary transition-colors">Configuration</a></li>
            <li><a href="#usage" class="toc-link text-base-content/60 hover:text-primary transition-colors">Usage Guide</a></li>
            <li><a href="#advanced" class="toc-link text-base-content/60 hover:text-primary transition-colors">Advanced Topics</a></li>
            <li><a href="#faq" class="toc-link text-base-content/60 hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </nav>
      </div>
    </aside>
    <main class="flex-1">
      <h1 id="intro" class="text-3xl font-bold mb-4">Introduction</h1>
      <p class="text-base-content/70 mb-8">Welcome to the documentation. This guide will walk you through everything you need to know to get started and become productive quickly.</p>
      <h2 id="setup" class="text-2xl font-bold mb-4">Getting Started</h2>
      <p class="text-base-content/70 mb-4">Follow these steps to set up your environment and start building. The process takes about 5 minutes.</p>
      <h3 id="install" class="text-xl font-semibold mb-3">Installation</h3>
      <div class="mockup-code mb-6"><pre><code>npm install your-package</code></pre></div>
      <h3 id="config" class="text-xl font-semibold mb-3">Configuration</h3>
      <p class="text-base-content/70 mb-8">Configure your settings in the config file. See the reference for all available options.</p>
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
  <div id="reading-progress-bar" style="position:fixed;top:0;left:0;height:3px;background:hsl(var(--p));width:0%;z-index:9999;transition:width 0.1s linear;"></div>
</div>
<section class="py-12 px-6 bg-base-100">
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <div class="flex gap-2 mb-4">
        <span class="badge badge-primary">Article</span>
        <span class="badge badge-ghost">8 min read</span>
      </div>
      <h1 class="text-4xl font-bold mb-4">Understanding Modern Web Architecture</h1>
      <p class="text-base-content/50 text-sm">Published March 15, 2024 · By Jane Doe</p>
    </div>
    <div class="prose max-w-none">
      <p class="text-base-content/70 text-lg leading-relaxed mb-6">Modern web architecture has evolved dramatically over the past decade. From monolithic applications to microservices, from server-side rendering to client-side single-page applications and back to server-side again with modern frameworks.</p>
      <p class="text-base-content/70 leading-relaxed mb-6">The key principles remain constant: performance, scalability, maintainability, and developer experience. Each architectural decision involves trade-offs that must align with your specific use case and team capabilities.</p>
      <p class="text-base-content/70 leading-relaxed">Understanding these patterns and knowing when to apply them is what separates senior engineers from junior ones. This guide provides a practical framework for making these decisions confidently.</p>
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
];
