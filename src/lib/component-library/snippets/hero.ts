import type { ComponentSnippet } from "../types";

export const heroSnippets: ComponentSnippet[] = [
  {
    id: "hero-centered",
    name: "Hero Centered",
    description: "Full-width centered hero with headline, subtitle, and CTA buttons",
    category: "hero",
    tags: ["hero", "cta"],
    priority: 1,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "generic", "blog"],
    html: `<section class="py-24 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-5xl font-bold text-gray-900 dark:text-white leading-tight">Welcome to Your Site</h1>
    <p class="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Build something amazing. Your product description goes here to explain the value proposition clearly and concisely.</p>
    <div class="mt-10 flex flex-wrap gap-4 justify-center">
      <a href="#" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors">Get Started</a>
      <button type="button" data-hs-overlay="#hero-demo-modal" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none transition-colors">Watch Demo</button>
    </div>
  </div>
  <div id="hero-demo-modal" class="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto" role="dialog" tabindex="-1" aria-labelledby="hero-demo-modal-label">
    <div class="hs-overlay-animation-target scale-95 opacity-0 transition-all duration-200 ease-out sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
      <div class="bg-white border border-gray-200 rounded-xl shadow-xl w-full dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between items-center py-4 px-5 border-b border-gray-200 dark:border-gray-700">
          <h3 id="hero-demo-modal-label" class="font-semibold text-gray-900 dark:text-white">Product Demo</h3>
          <button type="button" class="size-8 flex justify-center items-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" data-hs-overlay="#hero-demo-modal" aria-label="Close">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center text-4xl mb-4">▶️</div>
          <p class="text-sm text-gray-600 dark:text-gray-400">See how our platform can transform your workflow in just 2 minutes.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-split",
    name: "Hero Split Layout",
    description: "Two-column hero with text on left, image placeholder on right",
    category: "hero",
    tags: ["hero", "features"],
    priority: 1,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: true,
    fallback_for: ["portfolio"],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    <div class="flex-1">
      <span class="inline-flex items-center gap-x-2 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-6">Available for Work</span>
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white leading-tight">Hi, I'm <span class="text-blue-600 dark:text-blue-400">Your Name</span></h1>
      <p class="mt-6 text-lg text-gray-600 dark:text-gray-400">Full-stack developer specializing in building exceptional digital experiences. Passionate about clean code and user-centered design.</p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="#projects" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">View Work</a>
        <a href="#contact" class="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none transition-colors">Contact Me</a>
      </div>
    </div>
    <div class="flex-1 flex justify-center">
      <div class="w-72 h-72 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-6xl shadow-xl">👤</div>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-minimal",
    name: "Hero Minimal",
    description: "Clean minimal hero with large typography and single CTA",
    category: "hero",
    tags: ["hero"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-28 px-6 max-w-4xl mx-auto text-center bg-white dark:bg-gray-900">
  <span class="inline-flex items-center gap-x-2 py-1 px-4 rounded-full text-sm font-medium border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 mb-8">New Feature Released</span>
  <h1 class="text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6">Make it <span class="text-blue-600 dark:text-blue-400">simple</span></h1>
  <p class="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">Less is more. Focus on what matters and strip away the noise. Your users will thank you.</p>
  <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">Start Now &rarr;</a>
</section>`,
  },
  {
    id: "hero-dashboard",
    name: "Hero Dashboard Header",
    description: "Dashboard top header with stats summary and quick actions",
    category: "hero",
    tags: ["hero", "stats"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: true,
    fallback_for: ["dashboard"],
    html: `<section class="bg-gray-50 dark:bg-gray-900 px-6 py-8">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="flex gap-3">
        <button class="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Export</button>
        <button class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ New</button>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,240</p>
        <p class="text-sm text-green-600 dark:text-green-400 mt-1">↑ 12% this month</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">$4.8k</p>
        <p class="text-sm text-green-600 dark:text-green-400 mt-1">↑ 8% this month</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Active Sessions</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">342</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Right now</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Conversion</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.2%</p>
        <p class="text-sm text-red-600 dark:text-red-400 mt-1">↓ 1% this week</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-with-badge",
    name: "Hero with Animated Badge",
    description: "Hero section with animated announcement badge and gradient background",
    category: "hero",
    tags: ["hero", "cta"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="relative py-24 px-6 bg-white dark:bg-gray-900 overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 pointer-events-none"></div>
  <div class="relative max-w-4xl mx-auto text-center">
    <div class="inline-flex items-center gap-x-2 py-1.5 px-4 rounded-full text-xs font-semibold bg-blue-600 text-white mb-8 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
      <span class="flex size-2 rounded-full bg-white opacity-75 animate-pulse"></span>
      New: Version 2.0 is here
    </div>
    <h1 class="text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">The platform built for <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">modern teams</span></h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">Everything your team needs to ship faster, collaborate better, and build products your customers love.</p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 focus:outline-none transition-all hover:-translate-y-0.5">Get Started Free</a>
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none transition-colors">Watch Demo</a>
    </div>
    <p class="mt-6 text-sm text-gray-500 dark:text-gray-500">No credit card required &bull; Free 14-day trial &bull; Cancel anytime</p>
  </div>
</section>`,
  },
  {
    id: "hero-typed-text",
    name: "Hero with Typed Text Animation",
    description: "Hero with a cycling typed text effect using vanilla JS",
    category: "hero",
    tags: ["hero", "cta"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-24 px-6 bg-white dark:bg-gray-900 text-center">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
      The best way to<br>
      <span id="typed-text" class="text-blue-600 dark:text-blue-400"></span><span class="animate-pulse">|</span>
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 mb-10">Transform your workflow with our powerful platform. Start for free, scale as you grow.</p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">Start Building</a>
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">See Examples</a>
    </div>
  </div>
  <script>
    (function() {
      var phrases = ['build faster', 'ship products', 'grow your team', 'delight users'];
      var el = document.getElementById('typed-text');
      if (!el) return;
      var phraseIndex = 0, charIndex = 0, isDeleting = false;
      function type() {
        var current = phrases[phraseIndex];
        if (isDeleting) {
          el.textContent = current.substring(0, charIndex - 1);
          charIndex--;
        } else {
          el.textContent = current.substring(0, charIndex + 1);
          charIndex++;
        }
        var speed = isDeleting ? 60 : 120;
        if (!isDeleting && charIndex === current.length) {
          speed = 1800;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          speed = 300;
        }
        setTimeout(type, speed);
      }
      type();
    })();
  </script>
</section>`,
  },
  {
    id: "hero-gradient",
    name: "Hero Gradient Full Screen",
    description: "Full-screen hero with dark gradient background and centered content",
    category: "hero",
    tags: ["hero", "cta"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950">
  <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #6366f1 0%, transparent 50%);"></div>
  <div class="relative max-w-4xl mx-auto text-center">
    <span class="inline-flex items-center gap-x-2 py-1 px-4 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/80 mb-8">Trusted by 10,000+ teams worldwide</span>
    <h1 class="text-6xl font-extrabold text-white leading-tight mb-6">Build products that <span class="text-blue-400">customers love</span></h1>
    <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-10">Our platform gives your team the tools to design, develop, and deploy at lightning speed.</p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50 focus:outline-none transition-colors">Get Started</a>
      <a href="#" class="py-3 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 focus:outline-none transition-colors">View Demo</a>
    </div>
  </div>
</section>`,
  },
];
