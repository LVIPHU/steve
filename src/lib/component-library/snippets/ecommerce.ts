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
    html: `<section class="py-20 px-6 bg-base-100">
  <div class="max-w-5xl mx-auto text-center">
    <h2 class="text-4xl font-bold mb-4">Choose Your Plan</h2>
    <p class="text-base-content/60 mb-6">Flexible pricing for teams of all sizes. No hidden fees.</p>
    <div class="flex items-center justify-center gap-3 mb-12">
      <span class="text-sm font-medium" id="billing-monthly-label">Monthly</span>
      <input type="checkbox" class="toggle toggle-primary" id="billing-toggle">
      <span class="text-sm font-medium">Annual</span>
      <span class="badge badge-success badge-sm">Save 20%</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
      <div class="card bg-base-200 border border-base-300">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-1">Starter</h3>
          <div class="mb-6">
            <span class="text-4xl font-black" id="price-starter">$0</span>
            <span class="text-base-content/50">/mo</span>
          </div>
          <ul class="space-y-2 text-sm mb-8">
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>Up to 3 projects</li>
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>1 GB storage</li>
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>Community support</li>
            <li class="flex gap-2 items-center text-base-content/40"><span>✗</span>Custom domain</li>
          </ul>
          <a href="#" class="btn btn-outline btn-block">Get Started Free</a>
        </div>
      </div>
      <div class="card bg-primary text-primary-content border-2 border-primary shadow-lg">
        <div class="card-body">
          <div class="badge badge-secondary self-start mb-2">Most Popular</div>
          <h3 class="text-lg font-bold mb-1">Pro</h3>
          <div class="mb-6">
            <span class="text-4xl font-black" id="price-pro">$29</span>
            <span class="opacity-70">/mo</span>
          </div>
          <ul class="space-y-2 text-sm mb-8 opacity-90">
            <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Unlimited projects</li>
            <li class="flex gap-2 items-center"><span class="font-bold">✓</span>50 GB storage</li>
            <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Priority email support</li>
            <li class="flex gap-2 items-center"><span class="font-bold">✓</span>Custom domain</li>
          </ul>
          <a href="#" class="btn btn-secondary btn-block">Start Free Trial</a>
        </div>
      </div>
      <div class="card bg-base-200 border border-base-300">
        <div class="card-body">
          <h3 class="text-lg font-bold mb-1">Enterprise</h3>
          <div class="mb-6">
            <span class="text-4xl font-black" id="price-enterprise">$99</span>
            <span class="text-base-content/50">/mo</span>
          </div>
          <ul class="space-y-2 text-sm mb-8">
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>Everything in Pro</li>
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>1 TB storage</li>
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>Dedicated support</li>
            <li class="flex gap-2 items-center"><span class="text-success font-bold">✓</span>SSO + SAML</li>
          </ul>
          <a href="#" class="btn btn-outline btn-block">Contact Sales</a>
        </div>
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
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">Full Feature Comparison</h2>
    <div class="overflow-x-auto">
      <table class="table bg-base-100 rounded-xl shadow-sm text-sm">
        <thead>
          <tr class="border-b-2 border-base-200">
            <th class="w-48">Feature</th>
            <th class="text-center">Free</th>
            <th class="text-center text-primary bg-primary/5">Pro</th>
            <th class="text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-base-200/50"><td colspan="4" class="font-semibold text-xs uppercase tracking-wide text-base-content/50 py-2">Core Features</td></tr>
          <tr><td>Projects</td><td class="text-center">3</td><td class="text-center bg-primary/5 font-semibold">Unlimited</td><td class="text-center">Unlimited</td></tr>
          <tr><td>Storage</td><td class="text-center">1 GB</td><td class="text-center bg-primary/5 font-semibold">50 GB</td><td class="text-center">1 TB</td></tr>
          <tr><td>Team members</td><td class="text-center">1</td><td class="text-center bg-primary/5 font-semibold">10</td><td class="text-center">Unlimited</td></tr>
          <tr class="bg-base-200/50"><td colspan="4" class="font-semibold text-xs uppercase tracking-wide text-base-content/50 py-2">Advanced Features</td></tr>
          <tr><td>Analytics</td><td class="text-center text-base-content/30">—</td><td class="text-center bg-primary/5 text-success font-bold">✓</td><td class="text-center text-success font-bold">✓</td></tr>
          <tr><td>API Access</td><td class="text-center text-base-content/30">—</td><td class="text-center bg-primary/5 text-success font-bold">✓</td><td class="text-center text-success font-bold">✓</td></tr>
          <tr><td>Custom Domain</td><td class="text-center text-base-content/30">—</td><td class="text-center bg-primary/5 text-success font-bold">✓</td><td class="text-center text-success font-bold">✓</td></tr>
          <tr><td>SSO / SAML</td><td class="text-center text-base-content/30">—</td><td class="text-center bg-primary/5 text-base-content/30">—</td><td class="text-center text-success font-bold">✓</td></tr>
          <tr class="bg-base-200/50"><td colspan="4" class="font-semibold text-xs uppercase tracking-wide text-base-content/50 py-2">Support</td></tr>
          <tr><td>Support Type</td><td class="text-center">Community</td><td class="text-center bg-primary/5 font-semibold">Email</td><td class="text-center font-semibold">Dedicated</td></tr>
          <tr><td>Response Time</td><td class="text-center text-base-content/50">Best effort</td><td class="text-center bg-primary/5 font-semibold">24h</td><td class="text-center font-semibold">1h SLA</td></tr>
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
    html: `<section class="py-20 px-6 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col lg:flex-row items-center gap-16">
      <div class="flex-1 flex justify-center">
        <div class="w-80 h-80 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl flex items-center justify-center text-8xl shadow-xl">📦</div>
      </div>
      <div class="flex-1">
        <div class="badge badge-primary mb-4">New Release</div>
        <h2 class="text-4xl font-bold mb-4">Product Pro v2.0</h2>
        <p class="text-base-content/60 text-lg mb-6">The most powerful version yet. Rebuilt from the ground up for speed, reliability, and an exceptional user experience.</p>
        <div class="space-y-3 mb-8">
          <div class="flex items-center gap-3"><span class="text-success text-lg">✓</span><span>2x faster than the previous version</span></div>
          <div class="flex items-center gap-3"><span class="text-success text-lg">✓</span><span>Works offline with full sync when reconnected</span></div>
          <div class="flex items-center gap-3"><span class="text-success text-lg">✓</span><span>Available on iOS, Android, and Web</span></div>
          <div class="flex items-center gap-3"><span class="text-success text-lg">✓</span><span>30-day money-back guarantee</span></div>
        </div>
        <div class="flex items-center gap-4 mb-6">
          <div class="text-4xl font-black">$49</div>
          <div>
            <div class="text-base-content/40 line-through text-sm">$79</div>
            <div class="badge badge-success badge-sm">38% off launch sale</div>
          </div>
        </div>
        <div class="flex gap-4">
          <a href="#" class="btn btn-primary btn-lg">Buy Now</a>
          <a href="#" class="btn btn-ghost btn-lg">Learn More</a>
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
    html: `<section class="py-20 px-6 bg-gradient-to-r from-primary to-secondary text-primary-content">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-4xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="text-xl opacity-80 mb-10 max-w-xl mx-auto">Join over 10,000 teams already using our platform. No credit card required to start your free trial.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="btn btn-secondary btn-lg">Start Free Trial</a>
      <a href="#" class="btn btn-outline border-primary-content/50 text-primary-content hover:bg-primary-content hover:text-primary btn-lg">View Pricing</a>
    </div>
    <p class="text-sm opacity-60 mt-6">14-day free trial · No credit card required · Cancel anytime</p>
  </div>
</section>`,
  },
];
