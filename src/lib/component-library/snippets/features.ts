import type { ComponentSnippet } from "../types";

export const featuresSnippets: ComponentSnippet[] = [
  {
    id: "features-3col",
    name: "Features 3-Column Cards",
    description: "Three-column grid of feature cards with icons and descriptions",
    category: "features",
    tags: ["features", "cards"],
    priority: 1,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "generic"],
    html: `<section class="py-20 px-6 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14">
      <h2 class="text-4xl font-bold">Everything You Need</h2>
      <p class="mt-4 text-lg text-base-content/60 max-w-xl mx-auto">Powerful features built for modern teams. Simple enough for everyone, powerful enough for power users.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body items-center text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="card-title">Lightning Fast</h3>
          <p class="text-base-content/60">Optimized for performance. Built to handle thousands of requests without breaking a sweat.</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body items-center text-center">
          <div class="text-4xl mb-4">🔒</div>
          <h3 class="card-title">Secure by Default</h3>
          <p class="text-base-content/60">Enterprise-grade security baked in. Your data is protected with industry-standard encryption.</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body items-center text-center">
          <div class="text-4xl mb-4">🎯</div>
          <h3 class="card-title">Easy to Use</h3>
          <p class="text-base-content/60">Intuitive interface designed for everyone. Get started in minutes, not hours.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-icon-list",
    name: "Features Icon List",
    description: "Vertical list of features with icons and descriptions",
    category: "features",
    tags: ["features"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold mb-12">Why Choose Us</h2>
    <div class="space-y-8">
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">🚀</div>
        <div>
          <h3 class="text-xl font-semibold mb-2">Fast Onboarding</h3>
          <p class="text-base-content/60">Get up and running in under 5 minutes. No complex setup required — just sign up and start building.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-2xl">🤝</div>
        <div>
          <h3 class="text-xl font-semibold mb-2">Team Collaboration</h3>
          <p class="text-base-content/60">Work together in real-time. Share projects, leave comments, and track changes across your entire team.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-2xl">📊</div>
        <div>
          <h3 class="text-xl font-semibold mb-2">Advanced Analytics</h3>
          <p class="text-base-content/60">Understand your data with beautiful charts and insights. Make data-driven decisions with confidence.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-2xl">🔄</div>
        <div>
          <h3 class="text-xl font-semibold mb-2">Auto Sync</h3>
          <p class="text-base-content/60">Your data is always up to date across all devices. Never worry about stale information again.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-alternating",
    name: "Features Alternating",
    description: "Alternating left/right feature blocks with image and text",
    category: "features",
    tags: ["features"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-base-100">
  <div class="max-w-5xl mx-auto space-y-20">
    <div class="flex flex-col lg:flex-row items-center gap-12">
      <div class="flex-1">
        <div class="badge badge-primary mb-4">Feature 01</div>
        <h3 class="text-3xl font-bold mb-4">Built for Speed</h3>
        <p class="text-base-content/60 text-lg mb-6">Our platform is engineered for performance. Every millisecond counts and we obsess over it so you don't have to.</p>
        <a href="#" class="btn btn-primary">Learn More</a>
      </div>
      <div class="flex-1 bg-base-200 rounded-2xl h-64 flex items-center justify-center text-6xl">⚡</div>
    </div>
    <div class="flex flex-col lg:flex-row-reverse items-center gap-12">
      <div class="flex-1">
        <div class="badge badge-secondary mb-4">Feature 02</div>
        <h3 class="text-3xl font-bold mb-4">Secure & Compliant</h3>
        <p class="text-base-content/60 text-lg mb-6">SOC2 Type II certified. GDPR compliant. Your security and privacy are our top priorities, always.</p>
        <a href="#" class="btn btn-secondary">Learn More</a>
      </div>
      <div class="flex-1 bg-base-200 rounded-2xl h-64 flex items-center justify-center text-6xl">🔒</div>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-comparison",
    name: "Features Comparison Table",
    description: "Side-by-side feature comparison table for pricing tiers",
    category: "features",
    tags: ["features", "pricing"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">Compare Plans</h2>
    <div class="overflow-x-auto">
      <table class="table bg-base-100 rounded-xl shadow-sm">
        <thead>
          <tr>
            <th class="text-base">Feature</th>
            <th class="text-center">Free</th>
            <th class="text-center text-primary">Pro</th>
            <th class="text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Projects</td>
            <td class="text-center">3</td>
            <td class="text-center font-semibold">Unlimited</td>
            <td class="text-center">Unlimited</td>
          </tr>
          <tr>
            <td>Team Members</td>
            <td class="text-center">1</td>
            <td class="text-center font-semibold">Up to 10</td>
            <td class="text-center">Unlimited</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td class="text-center">1 GB</td>
            <td class="text-center font-semibold">50 GB</td>
            <td class="text-center">1 TB</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td class="text-center">—</td>
            <td class="text-center font-semibold">✓</td>
            <td class="text-center">✓ Advanced</td>
          </tr>
          <tr>
            <td>Support</td>
            <td class="text-center">Community</td>
            <td class="text-center font-semibold">Email</td>
            <td class="text-center">Dedicated</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
];
