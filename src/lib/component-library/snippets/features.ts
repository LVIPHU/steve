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
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Everything You Need</h2>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">Powerful features built for modern teams. Simple enough for everyone, powerful enough for power users.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl mb-4">⚡</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
        <p class="text-gray-600 dark:text-gray-400">Optimized for performance. Built to handle thousands of requests without breaking a sweat.</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl mb-4">🔒</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure by Default</h3>
        <p class="text-gray-600 dark:text-gray-400">Enterprise-grade security baked in. Your data is protected with industry-standard encryption.</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl mb-4">🎯</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h3>
        <p class="text-gray-600 dark:text-gray-400">Intuitive interface designed for everyone. Get started in minutes, not hours.</p>
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
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-12">Why Choose Us</h2>
    <div class="space-y-8">
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">🚀</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast Onboarding</h3>
          <p class="text-gray-600 dark:text-gray-400">Get up and running in under 5 minutes. No complex setup required — just sign up and start building.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl">🤝</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
          <p class="text-gray-600 dark:text-gray-400">Work together in real-time. Share projects, leave comments, and track changes across your entire team.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">📊</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Advanced Analytics</h3>
          <p class="text-gray-600 dark:text-gray-400">Understand your data with beautiful charts and insights. Make data-driven decisions with confidence.</p>
        </div>
      </div>
      <div class="flex gap-6 items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl">🔄</div>
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Auto Sync</h3>
          <p class="text-gray-600 dark:text-gray-400">Your data is always up to date across all devices. Never worry about stale information again.</p>
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
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto space-y-20">
    <div class="flex flex-col lg:flex-row items-center gap-12">
      <div class="flex-1">
        <span class="inline-flex items-center gap-x-2 py-1 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-4">Feature 01</span>
        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for Speed</h3>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">Our platform is engineered for performance. Every millisecond counts and we obsess over it so you don't have to.</p>
        <a href="#" class="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">Learn More</a>
      </div>
      <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 flex items-center justify-center text-6xl">⚡</div>
    </div>
    <div class="flex flex-col lg:flex-row-reverse items-center gap-12">
      <div class="flex-1">
        <span class="inline-flex items-center gap-x-2 py-1 px-3 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 mb-4">Feature 02</span>
        <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Secure &amp; Compliant</h3>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">SOC2 Type II certified. GDPR compliant. Your security and privacy are our top priorities, always.</p>
        <a href="#" class="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none transition-colors">Learn More</a>
      </div>
      <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 flex items-center justify-center text-6xl">🔒</div>
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
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Compare Plans</h2>
    <div class="overflow-x-auto">
      <table class="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-4 px-6 text-base text-gray-900 dark:text-white">Feature</th>
            <th class="text-center py-4 px-6 text-gray-700 dark:text-gray-300">Free</th>
            <th class="text-center py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Pro</th>
            <th class="text-center py-4 px-6 text-gray-700 dark:text-gray-300">Enterprise</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr>
            <td class="py-4 px-6 text-gray-700 dark:text-gray-300">Projects</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">3</td>
            <td class="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Unlimited</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">Unlimited</td>
          </tr>
          <tr>
            <td class="py-4 px-6 text-gray-700 dark:text-gray-300">Team Members</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">1</td>
            <td class="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Up to 10</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">Unlimited</td>
          </tr>
          <tr>
            <td class="py-4 px-6 text-gray-700 dark:text-gray-300">Storage</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">1 GB</td>
            <td class="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">50 GB</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">1 TB</td>
          </tr>
          <tr>
            <td class="py-4 px-6 text-gray-700 dark:text-gray-300">Analytics</td>
            <td class="text-center py-4 px-6 text-gray-400">—</td>
            <td class="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">✓</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">✓ Advanced</td>
          </tr>
          <tr>
            <td class="py-4 px-6 text-gray-700 dark:text-gray-300">Support</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">Community</td>
            <td class="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">Email</td>
            <td class="text-center py-4 px-6 text-gray-600 dark:text-gray-400">Dedicated</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-tabs",
    name: "Features with Tabs",
    description: "Tabbed feature sections with Preline data-hs-tab for category filtering",
    category: "features",
    tags: ["features"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-10">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Built for Every Use Case</h2>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Select your role to see the most relevant features.</p>
    </div>
    <nav class="flex justify-center gap-2 mb-10" role="tablist" aria-label="Feature tabs">
      <button data-hs-tab="#tab-developers" aria-selected="true" aria-controls="tab-developers" role="tab" class="py-2 px-5 text-sm font-medium rounded-full bg-blue-600 text-white focus:outline-none">Developers</button>
      <button data-hs-tab="#tab-designers" aria-selected="false" aria-controls="tab-designers" role="tab" class="py-2 px-5 text-sm font-medium rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none transition-colors">Designers</button>
      <button data-hs-tab="#tab-managers" aria-selected="false" aria-controls="tab-managers" role="tab" class="py-2 px-5 text-sm font-medium rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none transition-colors">Managers</button>
    </nav>
    <div id="tab-developers" role="tabpanel" aria-labelledby="tab-developers-btn">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">🔧</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">REST API</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Full-featured REST API with OpenAPI docs and SDKs for every major language.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">⚙️</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Webhooks</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Real-time event notifications. Build reactive integrations with ease.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">🧪</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Testing Sandbox</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Isolated test environment with seed data. Deploy with confidence.</p>
        </div>
      </div>
    </div>
    <div id="tab-designers" role="tabpanel" aria-labelledby="tab-designers-btn" class="hidden">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">🎨</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Design System</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Complete Figma kit with all components and design tokens.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">🖼️</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Asset Library</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Thousands of icons, illustrations, and stock photos ready to use.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">✨</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Prototype Mode</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Click-through prototypes with interactive animations and transitions.</p>
        </div>
      </div>
    </div>
    <div id="tab-managers" role="tabpanel" aria-labelledby="tab-managers-btn" class="hidden">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">📊</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Real-time dashboards with custom KPIs and automated reports.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">👥</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Team Management</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Role-based permissions, audit logs, and SSO for enterprise teams.</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
          <div class="text-3xl mb-3">📋</div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Project Tracking</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Milestones, timelines, and resource allocation in one view.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-faq-accordion",
    name: "Features FAQ Accordion",
    description: "Frequently asked questions using Preline accordion pattern",
    category: "features",
    tags: ["features"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Everything you need to know. Can't find the answer? <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Contact us</a>.</p>
    </div>
    <div class="hs-accordion-group space-y-3">
      <div class="hs-accordion active bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700" id="faq-acc-1">
        <button class="hs-accordion-toggle w-full py-5 px-6 inline-flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white" aria-expanded="true" aria-controls="faq-acc-collapse-1">
          How does the free trial work?
          <svg class="shrink-0 size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-acc-collapse-1" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="faq-acc-1">
          <div class="pb-5 px-6 text-gray-600 dark:text-gray-400">You get 14 days of full Pro access, no credit card required. After the trial, you can choose to continue with a paid plan or downgrade to our free tier.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700" id="faq-acc-2">
        <button class="hs-accordion-toggle w-full py-5 px-6 inline-flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white" aria-expanded="false" aria-controls="faq-acc-collapse-2">
          Can I cancel my subscription anytime?
          <svg class="shrink-0 size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-acc-collapse-2" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="faq-acc-2">
          <div class="pb-5 px-6 text-gray-600 dark:text-gray-400">Yes, absolutely. Cancel anytime from your account settings with no cancellation fees. You retain access until the end of your billing period.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700" id="faq-acc-3">
        <button class="hs-accordion-toggle w-full py-5 px-6 inline-flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white" aria-expanded="false" aria-controls="faq-acc-collapse-3">
          Do you offer discounts for non-profits?
          <svg class="shrink-0 size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-acc-collapse-3" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="faq-acc-3">
          <div class="pb-5 px-6 text-gray-600 dark:text-gray-400">Yes! We offer a 50% discount for registered non-profits and educational institutions. Contact our support team with proof of status to apply.</div>
        </div>
      </div>
      <div class="hs-accordion bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700" id="faq-acc-4">
        <button class="hs-accordion-toggle w-full py-5 px-6 inline-flex items-center justify-between text-left font-semibold text-gray-900 dark:text-white" aria-expanded="false" aria-controls="faq-acc-collapse-4">
          What payment methods do you accept?
          <svg class="shrink-0 size-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div id="faq-acc-collapse-4" class="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="faq-acc-4">
          <div class="pb-5 px-6 text-gray-600 dark:text-gray-400">We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans. All payments are processed securely via Stripe.</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
];
