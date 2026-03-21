import type { ComponentSnippet } from "../types";

export const ecommerceSnippets: ComponentSnippet[] = [
  {
    id: "pricing-table",
    name: "Pricing Table",
    description: "Clean pricing table with toggle for monthly/annual billing",
    category: "ecommerce",
    tags: ["pricing", "cta"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto text-center">
    <h2 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Choose Your Plan</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">Flexible pricing for teams of all sizes. No hidden fees.</p>
    <div class="flex items-center justify-center gap-3 mb-12">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" id="billing-toggle">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Annual</span>
      <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">Save 20%</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold mb-1 text-gray-900 dark:text-white">Starter</h3>
        <div class="mb-6">
          <span class="text-4xl font-black text-gray-900 dark:text-white" id="price-starter">$0</span>
          <span class="text-gray-500 dark:text-gray-400">/mo</span>
        </div>
        <ul class="space-y-2 text-sm mb-8">
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Up to 3 projects</li>
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>1 GB storage</li>
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Community support</li>
          <li class="flex gap-2 items-center text-gray-400 dark:text-gray-500"><span>✗</span>Custom domain</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Get Started Free</a>
      </div>
      <div class="bg-blue-600 border-2 border-blue-600 rounded-xl p-6 shadow-lg dark:bg-blue-700 dark:border-blue-700">
        <div class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-white/20 text-white mb-2">Most Popular</div>
        <h3 class="text-lg font-bold mb-1 text-white">Pro</h3>
        <div class="mb-6">
          <span class="text-4xl font-black text-white" id="price-pro">$29</span>
          <span class="text-white/70">/mo</span>
        </div>
        <ul class="space-y-2 text-sm mb-8 text-white/90">
          <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Unlimited projects</li>
          <li class="flex gap-2 items-center"><span class="font-bold">✓</span>50 GB storage</li>
          <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Priority email support</li>
          <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Custom domain</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors">Start Free Trial</a>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <h3 class="text-lg font-bold mb-1 text-gray-900 dark:text-white">Enterprise</h3>
        <div class="mb-6">
          <span class="text-4xl font-black text-gray-900 dark:text-white" id="price-enterprise">$99</span>
          <span class="text-gray-500 dark:text-gray-400">/mo</span>
        </div>
        <ul class="space-y-2 text-sm mb-8">
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Everything in Pro</li>
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>1 TB storage</li>
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>Dedicated support</li>
          <li class="flex gap-2 items-center text-gray-700 dark:text-gray-300"><span class="text-teal-600 dark:text-teal-400 font-bold">✓</span>SSO + SAML</li>
        </ul>
        <a href="#" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Contact Sales</a>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const toggle = document.getElementById('billing-toggle');
      const prices = { starter: [0, 0], pro: [29, 23], enterprise: [99, 79] };
      toggle.addEventListener('change', function() {
        const annual = toggle.checked;
        document.getElementById('price-starter').textContent = '$' + prices.starter[annual ? 1 : 0];
        document.getElementById('price-pro').textContent = '$' + prices.pro[annual ? 1 : 0];
        document.getElementById('price-enterprise').textContent = '$' + prices.enterprise[annual ? 1 : 0];
      });
    })();
  </script>
</section>`,
  },
  {
    id: "feature-comparison",
    name: "Feature Comparison",
    description: "Detailed feature comparison table for products or services",
    category: "ecommerce",
    tags: ["features", "pricing"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Full Feature Comparison</h2>
    <div class="overflow-x-auto">
      <table class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm text-sm border border-gray-200 dark:border-gray-700">
        <thead>
          <tr class="border-b-2 border-gray-100 dark:border-gray-700">
            <th class="text-left py-4 px-5 font-semibold text-gray-900 dark:text-white w-48">Feature</th>
            <th class="text-center py-4 px-5 font-semibold text-gray-900 dark:text-white">Free</th>
            <th class="text-center py-4 px-5 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">Pro</th>
            <th class="text-center py-4 px-5 font-semibold text-gray-900 dark:text-white">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-gray-50 dark:bg-gray-700/30"><td colspan="4" class="font-semibold text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 py-2 px-5">Core Features</td></tr>
          <tr class="border-t border-gray-100 dark:border-gray-700"><td class="py-3 px-5 text-gray-700 dark:text-gray-300">Projects</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">3</td><td class="text-center py-3 px-5 font-semibold text-gray-900 dark:text-white bg-blue-50/50 dark:bg-blue-900/10">Unlimited</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">Unlimited</td></tr>
          <tr class="border-t border-gray-100 dark:border-gray-700"><td class="py-3 px-5 text-gray-700 dark:text-gray-300">Storage</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">1 GB</td><td class="text-center py-3 px-5 font-semibold text-gray-900 dark:text-white bg-blue-50/50 dark:bg-blue-900/10">50 GB</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">1 TB</td></tr>
          <tr class="border-t border-gray-100 dark:border-gray-700"><td class="py-3 px-5 text-gray-700 dark:text-gray-300">Team members</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">1</td><td class="text-center py-3 px-5 font-semibold text-gray-900 dark:text-white bg-blue-50/50 dark:bg-blue-900/10">10</td><td class="text-center py-3 px-5 text-gray-700 dark:text-gray-300">Unlimited</td></tr>
          <tr class="bg-gray-50 dark:bg-gray-700/30"><td colspan="4" class="font-semibold text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 py-2 px-5">Advanced Features</td></tr>
          <tr class="border-t border-gray-100 dark:border-gray-700"><td class="py-3 px-5 text-gray-700 dark:text-gray-300">Analytics</td><td class="text-center py-3 px-5 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3 px-5 text-teal-600 dark:text-teal-400 font-bold bg-blue-50/50 dark:bg-blue-900/10">✓</td><td class="text-center py-3 px-5 text-teal-600 dark:text-teal-400 font-bold">✓</td></tr>
          <tr class="border-t border-gray-100 dark:border-gray-700"><td class="py-3 px-5 text-gray-700 dark:text-gray-300">SSO / SAML</td><td class="text-center py-3 px-5 text-gray-300 dark:text-gray-600">—</td><td class="text-center py-3 px-5 text-gray-300 dark:text-gray-600 bg-blue-50/50 dark:bg-blue-900/10">—</td><td class="text-center py-3 px-5 text-teal-600 dark:text-teal-400 font-bold">✓</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
  {
    id: "product-showcase",
    name: "Product Showcase",
    description: "Hero-style product showcase with image, features, and buy CTA",
    category: "ecommerce",
    tags: ["hero", "features", "cta"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col lg:flex-row items-center gap-16">
      <div class="flex-1 flex justify-center">
        <div class="w-80 h-80 bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30 rounded-3xl flex items-center justify-center text-8xl shadow-xl">📦</div>
      </div>
      <div class="flex-1">
        <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-4">New Release</span>
        <h2 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Product Pro v2.0</h2>
        <p class="text-gray-500 dark:text-gray-400 text-lg mb-6">The most powerful version yet. Rebuilt from the ground up for speed, reliability, and an exceptional user experience.</p>
        <div class="space-y-3 mb-8">
          <div class="flex items-center gap-3"><span class="text-teal-600 dark:text-teal-400 text-lg">✓</span><span class="text-gray-700 dark:text-gray-300">2x faster than the previous version</span></div>
          <div class="flex items-center gap-3"><span class="text-teal-600 dark:text-teal-400 text-lg">✓</span><span class="text-gray-700 dark:text-gray-300">Works offline with full sync when reconnected</span></div>
          <div class="flex items-center gap-3"><span class="text-teal-600 dark:text-teal-400 text-lg">✓</span><span class="text-gray-700 dark:text-gray-300">Available on iOS, Android, and Web</span></div>
          <div class="flex items-center gap-3"><span class="text-teal-600 dark:text-teal-400 text-lg">✓</span><span class="text-gray-700 dark:text-gray-300">30-day money-back guarantee</span></div>
        </div>
        <div class="flex items-center gap-4 mb-6">
          <div class="text-4xl font-black text-gray-900 dark:text-white">$49</div>
          <div>
            <div class="text-gray-400 dark:text-gray-500 line-through text-sm">$79</div>
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">38% off launch sale</span>
          </div>
        </div>
        <div class="flex gap-4">
          <a href="#" class="py-3 px-6 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Buy Now</a>
          <a href="#" class="py-3 px-6 inline-flex items-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Learn More</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "cta-banner",
    name: "CTA Banner",
    description: "Full-width call-to-action banner with headline and action buttons",
    category: "ecommerce",
    tags: ["cta"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
    <p class="text-xl text-white/80 mb-10 max-w-xl mx-auto">Join over 10,000 teams already using our platform. No credit card required to start your free trial.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="py-3 px-6 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors">Start Free Trial</a>
      <a href="#" class="py-3 px-6 inline-flex items-center justify-center text-sm font-medium rounded-lg border border-white/50 text-white hover:bg-white/10 transition-colors">View Pricing</a>
    </div>
    <p class="text-sm text-white/60 mt-6">14-day free trial · No credit card required · Cancel anytime</p>
  </div>
</section>`,
  },
  {
    id: "product-card-grid",
    name: "Product Card Grid",
    description: "E-commerce product cards with dismiss badge and add-to-cart button",
    category: "ecommerce",
    tags: ["products", "cards"],
    priority: 2,
    domain_hints: ["ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Featured Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="relative">
          <div class="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-5xl">👟</div>
          <button type="button" class="absolute top-3 right-3 w-6 h-6 bg-gray-800/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-900 transition-colors" data-hs-remove-element="#product-badge-1">✕</button>
          <span id="product-badge-1" class="absolute top-3 left-3 inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">SALE</span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Running Shoes Pro</h3>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg font-black text-gray-900 dark:text-white">$89</span>
            <span class="text-sm text-gray-400 dark:text-gray-500 line-through">$120</span>
          </div>
          <button class="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Add to Cart</button>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="relative">
          <div class="h-48 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center text-5xl">👜</div>
          <button type="button" class="absolute top-3 right-3 w-6 h-6 bg-gray-800/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-900 transition-colors" data-hs-remove-element="#product-badge-2">✕</button>
          <span id="product-badge-2" class="absolute top-3 left-3 inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">NEW</span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Leather Tote Bag</h3>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg font-black text-gray-900 dark:text-white">$149</span>
          </div>
          <button class="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Add to Cart</button>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="relative">
          <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-5xl">⌚</div>
          <button type="button" class="absolute top-3 right-3 w-6 h-6 bg-gray-800/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-900 transition-colors" data-hs-remove-element="#product-badge-3">✕</button>
          <span id="product-badge-3" class="absolute top-3 left-3 inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">LIMITED</span>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Smart Watch Elite</h3>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg font-black text-gray-900 dark:text-white">$299</span>
            <span class="text-sm text-gray-400 dark:text-gray-500 line-through">$399</span>
          </div>
          <button class="w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "cart-summary",
    name: "Cart Summary",
    description: "Shopping cart summary with quantity increment/decrement controls",
    category: "ecommerce",
    tags: ["products", "cta"],
    priority: 2,
    domain_hints: ["ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Cart</h2>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
      <div class="p-4 flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">👟</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-900 dark:text-white">Running Shoes Pro</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Size: 42 · Color: Black</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="w-7 h-7 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center qty-dec" data-target="qty-1">−</button>
          <span id="qty-1" class="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">1</span>
          <button class="w-7 h-7 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center qty-inc" data-target="qty-1">+</button>
        </div>
        <div class="font-bold text-gray-900 dark:text-white w-14 text-right">$89</div>
      </div>
      <div class="p-4 flex items-center gap-4">
        <div class="w-16 h-16 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">👜</div>
        <div class="flex-1">
          <div class="font-semibold text-gray-900 dark:text-white">Leather Tote Bag</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Color: Brown</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="w-7 h-7 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center qty-dec" data-target="qty-2">−</button>
          <span id="qty-2" class="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">2</span>
          <button class="w-7 h-7 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center qty-inc" data-target="qty-2">+</button>
        </div>
        <div class="font-bold text-gray-900 dark:text-white w-14 text-right">$298</div>
      </div>
      <div class="p-4">
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2"><span>Subtotal</span><span>$387</span></div>
        <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3"><span>Shipping</span><span class="text-teal-600 dark:text-teal-400">Free</span></div>
        <div class="flex justify-between font-bold text-lg text-gray-900 dark:text-white mb-4"><span>Total</span><span>$387</span></div>
        <button class="w-full py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Proceed to Checkout</button>
      </div>
    </div>
  </div>
  <script>
    (function() {
      document.querySelectorAll('.qty-inc').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const el = document.getElementById(btn.dataset.target);
          el.textContent = parseInt(el.textContent, 10) + 1;
        });
      });
      document.querySelectorAll('.qty-dec').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const el = document.getElementById(btn.dataset.target);
          const val = parseInt(el.textContent, 10);
          if (val > 1) el.textContent = val - 1;
        });
      });
    })();
  </script>
</section>`,
  },
  {
    id: "product-quick-view",
    name: "Product Quick View Modal",
    description: "Product quick view using Preline data-hs-overlay modal",
    category: "ecommerce",
    tags: ["products", "cards"],
    priority: 3,
    domain_hints: ["ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="h-52 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-5xl">🎧</div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Pro Headphones X200</h3>
          <div class="flex items-center justify-between">
            <span class="text-xl font-black text-gray-900 dark:text-white">$199</span>
            <button type="button" class="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-hs-overlay="#quick-view-modal">Quick View</button>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="h-52 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center text-5xl">💻</div>
        <div class="p-4">
          <h3 class="font-bold text-gray-900 dark:text-white mb-1">Laptop Stand Pro</h3>
          <div class="flex items-center justify-between">
            <span class="text-xl font-black text-gray-900 dark:text-white">$79</span>
            <button type="button" class="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-hs-overlay="#quick-view-modal">Quick View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="quick-view-modal" class="hs-overlay hidden fixed inset-0 z-50 overflow-x-hidden overflow-y-auto flex items-center justify-center">
    <div class="hs-overlay-backdrop fixed inset-0 bg-black/70" data-hs-overlay-backdrop></div>
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Pro Headphones X200</h3>
        <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-hs-overlay="#quick-view-modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center text-6xl mb-4">🎧</div>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Premium sound quality with active noise cancellation. 30-hour battery life. Compatible with all devices.</p>
      <div class="flex items-center justify-between">
        <span class="text-2xl font-black text-gray-900 dark:text-white">$199</span>
        <button class="py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Add to Cart</button>
      </div>
    </div>
  </div>
</section>`,
  },
];
