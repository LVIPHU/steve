import type { ComponentSnippet } from "../types";

export const ctaSnippets: ComponentSnippet[] = [
  {
    id: "cta-banner-centered",
    name: "CTA Banner Centered",
    description: "Centered CTA banner with gradient background",
    category: "cta",
    tags: ["cta", "banner"],
    priority: 1,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: true,
    fallback_for: ["landing", "generic"],
    html: `<section class="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
  <div class="max-w-3xl mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6">Start Building Today</h2>
    <p class="text-xl text-white/80 mb-10 max-w-xl mx-auto">Join thousands of teams already creating beautiful products. No credit card required.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="py-3 px-8 inline-flex items-center justify-center text-base font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-lg">Get Started Free</a>
      <a href="#" class="py-3 px-8 inline-flex items-center justify-center text-base font-semibold rounded-xl border-2 border-white/50 text-white hover:bg-white/10 transition-colors">Learn More</a>
    </div>
    <p class="text-white/60 text-sm mt-6">Free forever plan available · No setup fees</p>
  </div>
</section>`,
  },
  {
    id: "cta-email-inline",
    name: "CTA with Email Input",
    description: "CTA section with inline email input form",
    category: "cta",
    tags: ["cta", "newsletter"],
    priority: 2,
    domain_hints: ["landing", "blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">Enter your email and we'll send you a free trial. No commitment required.</p>
    <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onsubmit="return false">
      <input type="email" placeholder="Enter your email address" class="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <button type="submit" class="py-3 px-6 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0">Start Free Trial</button>
    </form>
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">By signing up you agree to our Terms of Service and Privacy Policy.</p>
  </div>
</section>`,
  },
  {
    id: "cta-app-store",
    name: "CTA App Store Download",
    description: "CTA section with app store badge placeholders",
    category: "cta",
    tags: ["cta", "download"],
    priority: 3,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    <div class="flex-1">
      <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-4">Available Now</span>
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Take It Everywhere With You</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 text-lg">Download our app for iOS and Android. Works offline and syncs automatically when you're back online.</p>
      <div class="flex flex-wrap gap-4">
        <a href="#" class="inline-flex items-center gap-2 py-3 px-5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <div class="text-left"><div class="text-xs text-gray-300 dark:text-gray-400">Download on the</div><div class="text-sm font-semibold">App Store</div></div>
        </a>
        <a href="#" class="inline-flex items-center gap-2 py-3 px-5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3.18 23.76c.32.18.69.19 1.04.03l12.56-7.26-2.88-2.88-10.72 10.11zm-.76-19.57C2.14 4.6 2 5.01 2 5.5v13c0 .49.14.9.42 1.22l.07.06 7.29-7.28v-.17L2.42 4.13l-.07.06zM19.66 10.2l-2.77-1.6-3.22 3.22 3.22 3.22 2.8-1.62c.8-.46.8-1.76-.03-2.22zM4.22.24L16.78 7.5 13.9 10.38 1.34.27C1.69.11 2.06.12 2.38.3L4.22.24z"/></svg>
          <div class="text-left"><div class="text-xs text-gray-300 dark:text-gray-400">Get it on</div><div class="text-sm font-semibold">Google Play</div></div>
        </a>
      </div>
    </div>
    <div class="flex-1 flex justify-center">
      <div class="w-56 h-96 bg-gradient-to-b from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center text-7xl shadow-xl">📱</div>
    </div>
  </div>
</section>`,
  },
  {
    id: "cta-social-proof",
    name: "CTA with Social Proof",
    description: "CTA with social proof numbers and trust indicators",
    category: "cta",
    tags: ["cta", "social-proof"],
    priority: 2,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-900 dark:bg-gray-950">
  <div class="max-w-4xl mx-auto text-center">
    <div class="flex justify-center gap-1 mb-4">
      <span class="text-amber-400 text-xl">★★★★★</span>
      <span class="text-gray-400 text-sm ml-2 mt-1">4.9 / 5 from 3,200+ reviews</span>
    </div>
    <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6">Trusted by 50,000+ Teams</h2>
    <p class="text-gray-400 mb-10 text-lg max-w-xl mx-auto">The fastest way to build, ship, and scale your product. Join our growing community today.</p>
    <a href="#" class="py-4 px-10 inline-flex items-center justify-center text-base font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">Start Free — No Credit Card</a>
    <div class="mt-12 grid grid-cols-3 gap-8 border-t border-gray-700 pt-10">
      <div><div class="text-3xl font-extrabold text-white">50K+</div><div class="text-gray-400 text-sm mt-1">Active teams</div></div>
      <div><div class="text-3xl font-extrabold text-white">99.9%</div><div class="text-gray-400 text-sm mt-1">Uptime SLA</div></div>
      <div><div class="text-3xl font-extrabold text-white">&lt; 2min</div><div class="text-gray-400 text-sm mt-1">Avg support response</div></div>
    </div>
  </div>
</section>`,
  },
  {
    id: "cta-countdown",
    name: "CTA with Countdown Timer",
    description: "Urgent CTA with countdown timer using vanilla JS",
    category: "cta",
    tags: ["cta", "timer"],
    priority: 3,
    domain_hints: ["landing", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700">
  <div class="max-w-3xl mx-auto text-center">
    <span class="inline-flex items-center py-1 px-3 rounded-full text-xs font-bold bg-white/20 text-white mb-6 uppercase tracking-wider">Limited Time Offer</span>
    <h2 class="text-4xl font-extrabold text-white mb-4">50% Off — Ends In</h2>
    <div class="flex justify-center gap-4 mb-10">
      <div class="bg-white/20 rounded-xl px-4 py-3 min-w-16 text-center">
        <div id="ctd-hours" class="text-3xl font-extrabold text-white">00</div>
        <div class="text-xs text-white/70 mt-0.5">Hours</div>
      </div>
      <div class="text-2xl font-bold text-white self-center mt-1">:</div>
      <div class="bg-white/20 rounded-xl px-4 py-3 min-w-16 text-center">
        <div id="ctd-mins" class="text-3xl font-extrabold text-white">30</div>
        <div class="text-xs text-white/70 mt-0.5">Minutes</div>
      </div>
      <div class="text-2xl font-bold text-white self-center mt-1">:</div>
      <div class="bg-white/20 rounded-xl px-4 py-3 min-w-16 text-center">
        <div id="ctd-secs" class="text-3xl font-extrabold text-white">00</div>
        <div class="text-xs text-white/70 mt-0.5">Seconds</div>
      </div>
    </div>
    <a href="#" class="py-4 px-10 inline-flex items-center justify-center text-base font-semibold rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 transition-colors shadow-lg">Claim 50% Discount</a>
    <p class="text-white/60 text-sm mt-4">Offer valid for first-time customers only</p>
  </div>
  <script>
    (function() {
      let total = (0 * 3600) + (30 * 60) + 0;
      function pad(n) { return String(n).padStart(2, '0'); }
      function tick() {
        if (total <= 0) return;
        total--;
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        const hEl = document.getElementById('ctd-hours');
        const mEl = document.getElementById('ctd-mins');
        const sEl = document.getElementById('ctd-secs');
        if (hEl) hEl.textContent = pad(h);
        if (mEl) mEl.textContent = pad(m);
        if (sEl) sEl.textContent = pad(s);
      }
      setInterval(tick, 1000);
    })();
  </script>
</section>`,
  },
  {
    id: "cta-sticky-bar",
    name: "Sticky CTA Bar",
    description: "Sticky CTA bar fixed at the bottom of the page",
    category: "cta",
    tags: ["cta", "sticky"],
    priority: 4,
    domain_hints: ["landing", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<div id="sticky-cta-bar" class="fixed bottom-0 inset-x-0 z-50 py-3 px-6 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
  <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
    <div>
      <p class="text-sm font-semibold text-gray-900 dark:text-white">Special launch offer — 30% off all plans</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">Ends midnight. No code needed.</p>
    </div>
    <div class="flex items-center gap-3">
      <a href="#" class="py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Claim Offer</a>
      <button type="button" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-hs-remove-element="#sticky-cta-bar" aria-label="Dismiss">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
</div>
<section class="py-24 px-6 bg-white dark:bg-gray-900 pb-20">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Scroll down to see the sticky bar</h2>
    <p class="text-gray-500 dark:text-gray-400">The sticky CTA bar appears at the bottom of the page and can be dismissed by the user.</p>
  </div>
</section>`,
  },
  {
    id: "cta-background-image",
    name: "CTA with Background Image",
    description: "CTA section with background image overlay pattern",
    category: "cta",
    tags: ["cta", "hero"],
    priority: 2,
    domain_hints: ["landing", "portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="relative py-24 px-6 bg-gray-900 dark:bg-gray-950 overflow-hidden">
  <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%);"></div>
  <div class="relative max-w-3xl mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">The Future of Work Starts Here</h2>
    <p class="text-gray-300 mb-10 text-xl max-w-xl mx-auto">Empower your team with tools designed for speed, collaboration, and scale.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="py-4 px-8 inline-flex items-center justify-center text-base font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get Started Free</a>
      <a href="#" class="py-4 px-8 inline-flex items-center justify-center text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">Watch Demo</a>
    </div>
  </div>
</section>`,
  },
  {
    id: "cta-split",
    name: "CTA Split Layout",
    description: "CTA split layout with text left and form right",
    category: "cta",
    tags: ["cta", "form"],
    priority: 2,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <div class="flex flex-col lg:flex-row gap-12 items-center">
      <div class="flex-1">
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-4">Free 14-day trial</span>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">Ready to transform your workflow?</h2>
        <ul class="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>No credit card required</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Full access to all features</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Cancel anytime</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>24/7 support included</li>
        </ul>
      </div>
      <div class="flex-1 w-full">
        <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Start your free trial</h3>
          <form class="space-y-4" onsubmit="return false">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" placeholder="Jane Doe" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work Email</label>
              <input type="email" placeholder="jane@company.com" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <button type="submit" class="w-full py-3 px-5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Start Free Trial</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
];
