import type { ComponentSnippet } from "../types";

export const cardsSnippets: ComponentSnippet[] = [
  {
    id: "card-basic",
    name: "Card Basic",
    description: "Standard content card with image, title, and action",
    category: "cards",
    tags: ["cards"],
    priority: 1,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: true,
    fallback_for: ["portfolio"],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">Featured Work</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 h-48 rounded-t-xl flex items-center justify-center text-5xl">🎨</div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Project Title</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">A brief description of what this project is about and the problem it solves.</p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">React</span>
            <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">TypeScript</span>
          </div>
          <div class="flex justify-end mt-4">
            <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">View Project</a>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 h-48 rounded-t-xl flex items-center justify-center text-5xl">🛠️</div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Another Project</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Built with modern technologies to deliver a seamless user experience.</p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Next.js</span>
            <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Tailwind</span>
          </div>
          <div class="flex justify-end mt-4">
            <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">View Project</a>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 h-48 rounded-t-xl flex items-center justify-center text-5xl">📱</div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Mobile App</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Cross-platform mobile application with native performance and smooth animations.</p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">React Native</span>
          </div>
          <div class="flex justify-end mt-4">
            <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors">View Project</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "card-stat",
    name: "Card Stats",
    description: "Dashboard stat cards showing KPI metrics with trend indicators",
    category: "cards",
    tags: ["cards", "stats"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: true,
    fallback_for: ["dashboard"],
    html: `<section class="py-8 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
          <span class="text-2xl">💰</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">$24,563</div>
        <div class="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-2">
          <span>↑</span><span>+12.5% vs last month</span>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">New Users</span>
          <span class="text-2xl">👥</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">1,482</div>
        <div class="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-2">
          <span>↑</span><span>+8.2% vs last month</span>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">Active Projects</span>
          <span class="text-2xl">📋</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">38</div>
        <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>—</span><span>No change</span>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">Churn Rate</span>
          <span class="text-2xl">📉</span>
        </div>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">2.4%</div>
        <div class="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-2">
          <span>↓</span><span>-0.3% vs last month</span>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "card-profile",
    name: "Card Profile",
    description: "Team member or user profile cards with avatar and bio",
    category: "cards",
    tags: ["cards"],
    priority: 2,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet the Team</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl mx-auto mb-4">👩‍💻</div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Sarah Chen</h3>
        <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-3">Lead Engineer</span>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">10 years of experience building scalable systems. Passionate about clean architecture.</p>
        <div class="flex gap-3 justify-center">
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Twitter</a>
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div class="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl mx-auto mb-4">👨‍🎨</div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Marcus Rivera</h3>
        <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 mb-3">Design Lead</span>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Former FAANG designer. Creates experiences users love and return to.</p>
        <div class="flex gap-3 justify-center">
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Dribbble</a>
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center dark:bg-gray-800 dark:border-gray-700">
        <div class="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl mx-auto mb-4">🧑‍💼</div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Alex Johnson</h3>
        <span class="inline-flex items-center py-0.5 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 mb-3">Product Manager</span>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Bridges the gap between business goals and technical solutions.</p>
        <div class="flex gap-3 justify-center">
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Twitter</a>
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "card-pricing",
    name: "Card Pricing",
    description: "Pricing plan cards with features list and CTA",
    category: "cards",
    tags: ["cards", "pricing"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Simple Pricing</h2>
    <p class="text-center text-gray-600 dark:text-gray-400 mb-12">No hidden fees. Cancel anytime.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Free</h3>
        <div class="text-4xl font-black text-gray-900 dark:text-white my-4">$0<span class="text-lg font-normal text-gray-500 dark:text-gray-400">/mo</span></div>
        <ul class="space-y-3 text-sm mb-6">
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> 3 projects</li>
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> 1 GB storage</li>
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> Community support</li>
          <li class="flex gap-2 text-gray-400 dark:text-gray-600"><span>✗</span> Analytics</li>
        </ul>
        <a href="#" class="block w-full py-2.5 px-4 text-center text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Get Started</a>
      </div>
      <div class="bg-blue-600 border border-blue-600 rounded-xl shadow-lg p-6 scale-105 relative">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center py-0.5 px-3 rounded-full text-xs font-semibold bg-white text-blue-600">Popular</span>
        <h3 class="text-xl font-bold text-white mb-1">Pro</h3>
        <div class="text-4xl font-black text-white my-4">$29<span class="text-lg font-normal text-blue-200">/mo</span></div>
        <ul class="space-y-3 text-sm mb-6 text-blue-100">
          <li class="flex gap-2"><span>✓</span> Unlimited projects</li>
          <li class="flex gap-2"><span>✓</span> 50 GB storage</li>
          <li class="flex gap-2"><span>✓</span> Email support</li>
          <li class="flex gap-2"><span>✓</span> Advanced analytics</li>
        </ul>
        <a href="#" class="block w-full py-2.5 px-4 text-center text-sm font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors">Start Free Trial</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Enterprise</h3>
        <div class="text-4xl font-black text-gray-900 dark:text-white my-4">$99<span class="text-lg font-normal text-gray-500 dark:text-gray-400">/mo</span></div>
        <ul class="space-y-3 text-sm mb-6">
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> Unlimited everything</li>
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> 1 TB storage</li>
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> Dedicated support</li>
          <li class="flex gap-2 text-gray-700 dark:text-gray-300"><span class="text-green-500">✓</span> Custom integrations</li>
        </ul>
        <a href="#" class="block w-full py-2.5 px-4 text-center text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">Contact Sales</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "card-expandable",
    name: "Card with Preline Collapse",
    description: "Expandable cards using Preline collapse pattern for additional details",
    category: "cards",
    tags: ["cards"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Services</h2>
    <div class="space-y-4">
      <div class="bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 flex items-start justify-between gap-4">
          <div class="flex gap-4 items-start">
            <div class="text-3xl">🎨</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">UI/UX Design</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Beautiful, user-centered interfaces that drive engagement.</p>
            </div>
          </div>
          <button data-hs-collapse="#service-1-details" aria-expanded="false" aria-controls="service-1-details" class="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" aria-label="Expand details">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>
        <div id="service-1-details" class="hs-collapse hidden overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-6 pt-0 border-t border-gray-100 dark:border-gray-700">
            <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex gap-2"><span class="text-blue-500">•</span> User research &amp; personas</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> Wireframing &amp; prototyping</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> Design system creation</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> Usability testing</li>
            </ul>
            <a href="#" class="mt-4 inline-flex py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Learn More</a>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 flex items-start justify-between gap-4">
          <div class="flex gap-4 items-start">
            <div class="text-3xl">💻</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Web Development</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Full-stack solutions built with modern technologies.</p>
            </div>
          </div>
          <button data-hs-collapse="#service-2-details" aria-expanded="false" aria-controls="service-2-details" class="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors" aria-label="Expand details">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>
        <div id="service-2-details" class="hs-collapse hidden overflow-hidden transition-[height] duration-300">
          <div class="px-6 pb-6 pt-0 border-t border-gray-100 dark:border-gray-700">
            <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex gap-2"><span class="text-blue-500">•</span> React / Next.js applications</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> REST &amp; GraphQL APIs</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> Database design</li>
              <li class="flex gap-2"><span class="text-blue-500">•</span> Performance optimization</li>
            </ul>
            <a href="#" class="mt-4 inline-flex py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "card-hover-overlay",
    name: "Card with Hover Overlay",
    description: "Image cards with hover overlay revealing additional information",
    category: "cards",
    tags: ["cards"],
    priority: 3,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">Portfolio</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="group relative overflow-hidden rounded-xl shadow-sm">
        <div class="h-64 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-6xl">🌐</div>
        <div class="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
          <h3 class="text-xl font-bold text-white mb-2">E-Commerce Platform</h3>
          <p class="text-gray-300 text-sm mb-4">Full-stack online store with cart and payment integration.</p>
          <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors">View Case Study</a>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-xl shadow-sm">
        <div class="h-64 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-6xl">📊</div>
        <div class="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
          <h3 class="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
          <p class="text-gray-300 text-sm mb-4">Real-time data visualization with Chart.js and WebSockets.</p>
          <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors">View Case Study</a>
        </div>
      </div>
      <div class="group relative overflow-hidden rounded-xl shadow-sm">
        <div class="h-64 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-6xl">📱</div>
        <div class="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
          <h3 class="text-xl font-bold text-white mb-2">Mobile Banking App</h3>
          <p class="text-gray-300 text-sm mb-4">Secure financial management with biometric authentication.</p>
          <a href="#" class="py-2 px-4 text-sm font-medium rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors">View Case Study</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
];
