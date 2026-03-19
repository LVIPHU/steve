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
    html: `<section class="py-8 px-6 bg-base-100">
  <div class="max-w-7xl mx-auto">
    <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
      <div class="stat">
        <div class="stat-figure text-primary text-3xl">📈</div>
        <div class="stat-title">Page Views</div>
        <div class="stat-value text-primary">89.4K</div>
        <div class="stat-desc">21% more than last month</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-secondary text-3xl">🛒</div>
        <div class="stat-title">New Orders</div>
        <div class="stat-value text-secondary">1,234</div>
        <div class="stat-desc">↑ 14% this week</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-accent text-3xl">⭐</div>
        <div class="stat-title">Satisfaction</div>
        <div class="stat-value text-accent">4.8/5</div>
        <div class="stat-desc">From 840 reviews</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-3xl">💼</div>
        <div class="stat-title">Active Tasks</div>
        <div class="stat-value">47</div>
        <div class="stat-desc">12 due today</div>
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
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-5xl font-black text-primary mb-2" data-count="10000" id="counter-1">0</div>
        <div class="text-base-content/60 text-sm font-medium uppercase tracking-wide">Happy Users</div>
      </div>
      <div>
        <div class="text-5xl font-black text-secondary mb-2" data-count="250" id="counter-2">0</div>
        <div class="text-base-content/60 text-sm font-medium uppercase tracking-wide">Projects Done</div>
      </div>
      <div>
        <div class="text-5xl font-black text-accent mb-2" data-count="99" id="counter-3">0</div>
        <div class="text-base-content/60 text-sm font-medium uppercase tracking-wide">% Uptime</div>
      </div>
      <div>
        <div class="text-5xl font-black mb-2" data-count="24" id="counter-4">0</div>
        <div class="text-base-content/60 text-sm font-medium uppercase tracking-wide">Hour Support</div>
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
    html: `<section class="py-16 px-6 bg-base-100">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-10">Performance Metrics</h2>
    <div class="space-y-6">
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Customer Satisfaction</span>
          <span class="text-primary font-bold">94%</span>
        </div>
        <progress class="progress progress-primary w-full" value="94" max="100"></progress>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">On-time Delivery</span>
          <span class="text-secondary font-bold">87%</span>
        </div>
        <progress class="progress progress-secondary w-full" value="87" max="100"></progress>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Team Productivity</span>
          <span class="text-accent font-bold">78%</span>
        </div>
        <progress class="progress progress-accent w-full" value="78" max="100"></progress>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Budget Utilization</span>
          <span class="text-success font-bold">65%</span>
        </div>
        <progress class="progress progress-success w-full" value="65" max="100"></progress>
      </div>
    </div>
  </div>
</section>`,
  },
];
