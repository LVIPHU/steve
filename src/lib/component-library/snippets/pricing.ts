import type { ComponentSnippet } from "../types";

export const pricingSnippets: ComponentSnippet[] = [
  {
    id: "pricing-three-tier",
    name: "Three-Tier Pricing Table",
    description: "Three-tier pricing table with highlighted middle plan",
    category: "pricing",
    tags: ["pricing"],
    priority: 1,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: true,
    fallback_for: ["landing"],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-14 text-lg">No hidden fees. Cancel anytime.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div class="bg-gray-50 border border-gray-200 rounded-2xl p-8 dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
        <div class="mb-6"><span class="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span><span class="text-gray-500 dark:text-gray-400 text-sm">/month</span></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Perfect for individuals getting started.</p>
        <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-8">
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>3 projects</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>1 GB storage</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Community support</li>
          <li class="flex items-center gap-2 text-gray-400 dark:text-gray-500"><span>✗</span>Custom domain</li>
          <li class="flex items-center gap-2 text-gray-400 dark:text-gray-500"><span>✗</span>Analytics</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Get Started Free</a>
      </div>
      <div class="bg-blue-600 border-2 border-blue-600 rounded-2xl p-8 shadow-xl relative dark:bg-blue-700 dark:border-blue-700">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center py-1 px-3 rounded-full text-xs font-bold bg-amber-400 text-amber-900">Most Popular</span>
        <h3 class="text-lg font-bold text-white mb-2">Pro</h3>
        <div class="mb-6"><span class="text-4xl font-extrabold text-white">$29</span><span class="text-white/70 text-sm">/month</span></div>
        <p class="text-sm text-white/80 mb-6">For growing teams and businesses.</p>
        <ul class="space-y-3 text-sm text-white/90 mb-8">
          <li class="flex items-center gap-2"><span class="font-bold">✓</span>Unlimited projects</li>
          <li class="flex items-center gap-2"><span class="font-bold">✓</span>50 GB storage</li>
          <li class="flex items-center gap-2"><span class="font-bold">✓</span>Priority email support</li>
          <li class="flex items-center gap-2"><span class="font-bold">✓</span>Custom domain</li>
          <li class="flex items-center gap-2"><span class="font-bold">✓</span>Advanced analytics</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors">Start Free Trial</a>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-2xl p-8 dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
        <div class="mb-6"><span class="text-4xl font-extrabold text-gray-900 dark:text-white">$99</span><span class="text-gray-500 dark:text-gray-400 text-sm">/month</span></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">For large teams with advanced needs.</p>
        <ul class="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-8">
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Everything in Pro</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>1 TB storage</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Dedicated support</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>SSO + SAML</li>
          <li class="flex items-center gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Custom contracts</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contact Sales</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-toggle",
    name: "Pricing with Monthly/Annual Toggle",
    description: "Pricing section with monthly/annual billing toggle and price switch",
    category: "pricing",
    tags: ["pricing", "toggle"],
    priority: 1,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
    <div class="flex items-center justify-center gap-4 mb-10">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300" id="monthly-label">Monthly</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="pt-billing-toggle" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Annual</span>
      <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">Save 20%</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
      <div class="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Pro</h3>
        <div class="mb-5"><span class="text-4xl font-extrabold text-gray-900 dark:text-white" id="pt-price-pro">$29</span><span class="text-gray-500 dark:text-gray-400 text-sm">/mo</span></div>
        <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6">
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Unlimited projects</li>
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>50 GB storage</li>
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Priority support</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get Pro</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Enterprise</h3>
        <div class="mb-5"><span class="text-4xl font-extrabold text-gray-900 dark:text-white" id="pt-price-ent">$99</span><span class="text-gray-500 dark:text-gray-400 text-sm">/mo</span></div>
        <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6">
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Everything in Pro</li>
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>SSO + SAML</li>
          <li class="flex gap-2"><span class="text-teal-600 dark:text-teal-400">✓</span>Dedicated support</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contact Sales</a>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const toggle = document.getElementById('pt-billing-toggle');
      const proPrices = [29, 23];
      const entPrices = [99, 79];
      if (!toggle) return;
      toggle.addEventListener('change', function() {
        const annual = toggle.checked;
        const proEl = document.getElementById('pt-price-pro');
        const entEl = document.getElementById('pt-price-ent');
        if (proEl) proEl.textContent = '$' + proPrices[annual ? 1 : 0];
        if (entEl) entEl.textContent = '$' + entPrices[annual ? 1 : 0];
      });
    })();
  </script>
</section>`,
  },
  {
    id: "pricing-single-card",
    name: "Single Highlighted Plan Card",
    description: "Single highlighted pricing plan card",
    category: "pricing",
    tags: ["pricing"],
    priority: 2,
    domain_hints: ["saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900 flex items-center justify-center">
  <div class="max-w-sm w-full">
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-8 text-center shadow-2xl">
      <span class="inline-flex items-center py-1 px-3 rounded-full text-xs font-bold bg-white/20 text-white mb-5">Recommended</span>
      <h3 class="text-2xl font-bold text-white mb-2">Pro Plan</h3>
      <div class="mb-2"><span class="text-6xl font-extrabold text-white">$29</span><span class="text-white/70">/mo</span></div>
      <p class="text-white/70 text-sm mb-8">Everything you need to grow your business</p>
      <ul class="space-y-3 text-sm text-white/90 text-left mb-8">
        <li class="flex items-center gap-2"><span>✓</span>Unlimited projects</li>
        <li class="flex items-center gap-2"><span>✓</span>50 GB storage</li>
        <li class="flex items-center gap-2"><span>✓</span>Priority support 24/7</li>
        <li class="flex items-center gap-2"><span>✓</span>Custom domain included</li>
        <li class="flex items-center gap-2"><span>✓</span>Advanced analytics</li>
      </ul>
      <a href="#" class="w-full py-3 px-5 inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors">Start Free 14-day Trial</a>
      <p class="text-white/50 text-xs mt-3">No credit card required</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-comparison",
    name: "Feature Comparison Table",
    description: "Pricing feature comparison table with checkmark matrix",
    category: "pricing",
    tags: ["pricing", "table"],
    priority: 2,
    domain_hints: ["saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Feature Comparison</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-sm bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white w-1/2">Feature</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Free</th>
            <th class="text-center py-4 px-4 font-semibold text-blue-600 dark:text-blue-400">Pro</th>
            <th class="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">Enterprise</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">Projects</td><td class="text-center py-3.5 px-4 text-gray-700 dark:text-gray-300">3</td><td class="text-center py-3.5 px-4 font-semibold text-gray-900 dark:text-white">Unlimited</td><td class="text-center py-3.5 px-4 text-gray-700 dark:text-gray-300">Unlimited</td></tr>
          <tr class="bg-gray-50/50 dark:bg-gray-700/20"><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">Storage</td><td class="text-center py-3.5 px-4 text-gray-700 dark:text-gray-300">1 GB</td><td class="text-center py-3.5 px-4 font-semibold text-gray-900 dark:text-white">50 GB</td><td class="text-center py-3.5 px-4 text-gray-700 dark:text-gray-300">1 TB</td></tr>
          <tr><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">Custom Domain</td><td class="text-center py-3.5 px-4 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold">✓</td><td class="text-center py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold">✓</td></tr>
          <tr class="bg-gray-50/50 dark:bg-gray-700/20"><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">Analytics</td><td class="text-center py-3.5 px-4 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold">✓</td><td class="text-center py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold">✓</td></tr>
          <tr><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">SSO / SAML</td><td class="text-center py-3.5 px-4 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3.5 px-4 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3.5 px-4 text-teal-600 dark:text-teal-400 font-bold">✓</td></tr>
          <tr class="bg-gray-50/50 dark:bg-gray-700/20"><td class="py-3.5 px-6 text-gray-700 dark:text-gray-300">Support</td><td class="text-center py-3.5 px-4 text-gray-700 dark:text-gray-300">Community</td><td class="text-center py-3.5 px-4 font-semibold text-gray-900 dark:text-white">Email</td><td class="text-center py-3.5 px-4 font-semibold text-gray-900 dark:text-white">Dedicated</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-faq",
    name: "Pricing with FAQ",
    description: "Pricing section with FAQ accordion using Preline hs-accordion-group",
    category: "pricing",
    tags: ["pricing", "faq"],
    priority: 2,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Pricing FAQ</h2>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-12">Got questions? We've got answers.</p>
    <div class="hs-accordion-group divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div class="hs-accordion active bg-white dark:bg-gray-800" id="faq-1">
        <button class="hs-accordion-toggle w-full flex items-center justify-between gap-x-3 py-4 px-6 font-semibold text-start text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" aria-controls="faq-content-1">
          Can I try before I buy?
          <svg class="rotate-180 size-4 text-gray-600 dark:text-gray-300 shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-content-1" class="hs-accordion-content overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">Yes! Every plan comes with a 14-day free trial. No credit card required. You'll have full access to all features during the trial.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white dark:bg-gray-800" id="faq-2">
        <button class="hs-accordion-toggle w-full flex items-center justify-between gap-x-3 py-4 px-6 font-semibold text-start text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" aria-controls="faq-content-2">
          Can I change plans at any time?
          <svg class="size-4 text-gray-600 dark:text-gray-300 shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-content-2" class="hs-accordion-content hidden overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">Absolutely. You can upgrade or downgrade at any time from your account settings. Changes take effect immediately.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white dark:bg-gray-800" id="faq-3">
        <button class="hs-accordion-toggle w-full flex items-center justify-between gap-x-3 py-4 px-6 font-semibold text-start text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" aria-controls="faq-content-3">
          Is there a long-term commitment?
          <svg class="size-4 text-gray-600 dark:text-gray-300 shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-content-3" class="hs-accordion-content hidden overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">No long-term commitment required. Monthly plans can be cancelled at any time. Annual plans are billed upfront but can be cancelled for the remaining period.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white dark:bg-gray-800" id="faq-4">
        <button class="hs-accordion-toggle w-full flex items-center justify-between gap-x-3 py-4 px-6 font-semibold text-start text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" aria-controls="faq-content-4">
          Do you offer discounts for non-profits?
          <svg class="size-4 text-gray-600 dark:text-gray-300 shrink-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-content-4" class="hs-accordion-content hidden overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">Yes! We offer a 50% discount for registered non-profits and educational institutions. Contact us at support@example.com with proof of eligibility.</div>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
document.querySelectorAll('.hs-accordion-toggle').forEach(function(btn){
  btn.addEventListener('click', function(){
    var svg = this.querySelector('svg');
    if(svg) svg.classList.toggle('rotate-180');
  });
});
</script>`,
  },
  {
    id: "pricing-enterprise",
    name: "Enterprise Pricing Card",
    description: "Enterprise contact CTA pricing card",
    category: "pricing",
    tags: ["pricing", "cta"],
    priority: 3,
    domain_hints: ["saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-900 dark:bg-gray-950">
  <div class="max-w-4xl mx-auto">
    <div class="border border-gray-700 rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <h3 class="text-2xl font-bold text-white mb-2">Enterprise</h3>
        <p class="text-gray-400 mb-4 max-w-lg">Custom pricing for large organizations. Includes dedicated infrastructure, SLA guarantees, and a dedicated success team.</p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-300">
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>Custom team size</li>
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>Dedicated infrastructure</li>
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>99.99% uptime SLA</li>
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>HIPAA / SOC 2 compliant</li>
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>Custom contracts</li>
          <li class="flex items-center gap-2"><span class="text-teal-400">✓</span>Priority onboarding</li>
        </ul>
      </div>
      <div class="shrink-0 text-center">
        <p class="text-gray-400 text-sm mb-2">Starting at</p>
        <div class="text-4xl font-extrabold text-white mb-1">Custom</div>
        <p class="text-gray-400 text-xs mb-6">per month</p>
        <a href="#" class="py-3 px-8 inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap">Talk to Sales</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-freemium",
    name: "Freemium vs Pro Comparison",
    description: "Two-column freemium vs pro pricing comparison",
    category: "pricing",
    tags: ["pricing"],
    priority: 2,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Free vs Pro</h2>
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-center mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Free</h3>
          <div class="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">$0</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Forever free</div>
        </div>
        <ul class="space-y-2.5 text-sm">
          <li class="flex items-start gap-2 text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>3 projects</li>
          <li class="flex items-start gap-2 text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>1 GB storage</li>
          <li class="flex items-start gap-2 text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 mt-0.5">✓</span>Community forum</li>
          <li class="flex items-start gap-2 text-gray-400 dark:text-gray-500"><span class="mt-0.5">✗</span>Custom domain</li>
          <li class="flex items-start gap-2 text-gray-400 dark:text-gray-500"><span class="mt-0.5">✗</span>Analytics</li>
          <li class="flex items-start gap-2 text-gray-400 dark:text-gray-500"><span class="mt-0.5">✗</span>Priority support</li>
        </ul>
        <a href="#" class="mt-6 w-full py-2.5 px-4 inline-flex items-center justify-center text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Get Started</a>
      </div>
      <div class="bg-blue-600 border-2 border-blue-600 rounded-2xl p-6 dark:bg-blue-700 dark:border-blue-700">
        <div class="text-center mb-6">
          <h3 class="text-lg font-bold text-white">Pro</h3>
          <div class="text-3xl font-extrabold text-white mt-2">$29</div>
          <div class="text-sm text-white/70">per month</div>
        </div>
        <ul class="space-y-2.5 text-sm text-white/90">
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>Unlimited projects</li>
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>50 GB storage</li>
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>Priority email support</li>
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>Custom domain</li>
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>Advanced analytics</li>
          <li class="flex items-start gap-2"><span class="mt-0.5">✓</span>Team collaboration</li>
        </ul>
        <a href="#" class="mt-6 w-full py-2.5 px-4 inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-colors">Upgrade to Pro</a>
      </div>
    </div>
  </div>
</section>`,
  },
];
