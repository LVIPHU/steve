import type { ComponentSnippet } from "../types";

export const statsSnippets: ComponentSnippet[] = [
  {
    id: "stats-bar",
    name: "Stats Bar",
    description: "Horizontal stats bar with key metrics for dashboard headers",
    category: "stats",
    tags: ["stats"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: true,
    fallback_for: ["dashboard"],
    html: `<section class="py-8 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-3xl mb-1">📈</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Page Views</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">89.4K</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">21% more than last month</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-3xl mb-1">🛒</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">New Orders</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">↑ 14% this week</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-3xl mb-1">⭐</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Satisfaction</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">4.8/5</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">From 840 reviews</div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-3xl mb-1">💼</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Active Tasks</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">47</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">12 due today</div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "stats-counter",
    name: "Stats Counter",
    description: "Animated counter stats with large numbers and labels",
    category: "stats",
    tags: ["stats"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2" data-count="10000" id="counter-1">0</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Happy Users</div>
      </div>
      <div>
        <div class="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2" data-count="250" id="counter-2">0</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Projects Done</div>
      </div>
      <div>
        <div class="text-5xl font-black text-violet-600 dark:text-violet-400 mb-2" data-count="99" id="counter-3">0</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">% Uptime</div>
      </div>
      <div>
        <div class="text-5xl font-black text-gray-900 dark:text-white mb-2" data-count="24" id="counter-4">0</div>
        <div class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Hour Support</div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const counters = document.querySelectorAll('[data-count]');
      const animateCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(c => observer.observe(c));
    })();
  </script>
</section>`,
  },
  {
    id: "stats-progress",
    name: "Stats Progress Bars",
    description: "Progress bar stats showing skill or metric completion percentages",
    category: "stats",
    tags: ["stats", "progress"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Performance Metrics</h2>
    <div class="space-y-6">
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium text-gray-900 dark:text-white">Customer Satisfaction</span>
          <span class="text-blue-600 dark:text-blue-400 font-bold">94%</span>
        </div>
        <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full" style="width:94%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium text-gray-900 dark:text-white">On-time Delivery</span>
          <span class="text-indigo-600 dark:text-indigo-400 font-bold">87%</span>
        </div>
        <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-indigo-600 rounded-full" style="width:87%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium text-gray-900 dark:text-white">Team Productivity</span>
          <span class="text-violet-600 dark:text-violet-400 font-bold">78%</span>
        </div>
        <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-violet-600 rounded-full" style="width:78%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium text-gray-900 dark:text-white">Budget Utilization</span>
          <span class="text-teal-600 dark:text-teal-400 font-bold">65%</span>
        </div>
        <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-teal-600 rounded-full" style="width:65%"></div></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "stats-kpi-cards",
    name: "Stats KPI Cards",
    description: "KPI metric cards with trend indicators and icons",
    category: "stats",
    tags: ["stats"],
    priority: 2,
    domain_hints: ["dashboard", "saas"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Key Metrics</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">+12.5%</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">$48,295</div>
        <div class="mt-2 text-xs text-gray-400 dark:text-gray-500">vs $42,934 last month</div>
        <div class="mt-4 flex w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full" style="width:72%"></div></div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">+8.2%</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">12,847</div>
        <div class="mt-2 text-xs text-gray-400 dark:text-gray-500">vs 11,874 last month</div>
        <div class="mt-4 flex w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-indigo-600 rounded-full" style="width:60%"></div></div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Churn Rate</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">-2.1%</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">3.4%</div>
        <div class="mt-2 text-xs text-gray-400 dark:text-gray-500">vs 5.5% last month</div>
        <div class="mt-4 flex w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-red-500 rounded-full" style="width:34%"></div></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "stats-minimal-row",
    name: "Stats Minimal Row",
    description: "Minimal inline stats row for landing page hero sections",
    category: "stats",
    tags: ["stats"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <div class="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
      <div>
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">50K+</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Customers worldwide</div>
      </div>
      <div class="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 self-stretch"></div>
      <div>
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">99.9%</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Uptime SLA</div>
      </div>
      <div class="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 self-stretch"></div>
      <div>
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">4.9★</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Average rating</div>
      </div>
      <div class="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 self-stretch"></div>
      <div>
        <div class="text-4xl font-extrabold text-gray-900 dark:text-white">24/7</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Expert support</div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "stats-with-icons",
    name: "Stats With Icons",
    description: "Stats grid with colored icon backgrounds and metric descriptions",
    category: "stats",
    tags: ["stats"],
    priority: 2,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Trusted by Teams Everywhere</h2>
      <p class="text-gray-500 dark:text-gray-400">Numbers that speak for themselves.</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div class="text-center">
        <div class="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <div class="text-3xl font-extrabold text-gray-900 dark:text-white">25K+</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Active users</div>
      </div>
      <div class="text-center">
        <div class="w-14 h-14 bg-teal-100 dark:bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
        </div>
        <div class="text-3xl font-extrabold text-gray-900 dark:text-white">500+</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Projects shipped</div>
      </div>
      <div class="text-center">
        <div class="w-14 h-14 bg-violet-100 dark:bg-violet-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="text-3xl font-extrabold text-gray-900 dark:text-white">3x</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Faster delivery</div>
      </div>
      <div class="text-center">
        <div class="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
        </div>
        <div class="text-3xl font-extrabold text-gray-900 dark:text-white">4.9/5</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Customer rating</div>
      </div>
    </div>
  </div>
</section>`,
  },
];
