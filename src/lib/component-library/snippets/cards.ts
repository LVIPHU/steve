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
    html: `<section class="py-16 px-6 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-10">Featured Work</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-primary/20 to-secondary/20 h-48 flex items-center justify-center text-5xl">🎨</figure>
        <div class="card-body">
          <h3 class="card-title">Project Title</h3>
          <p class="text-base-content/60 text-sm">A brief description of what this project is about and the problem it solves.</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            <span class="badge badge-outline badge-sm">React</span>
            <span class="badge badge-outline badge-sm">TypeScript</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="#" class="btn btn-primary btn-sm">View Project</a>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-secondary/20 to-accent/20 h-48 flex items-center justify-center text-5xl">🛠️</figure>
        <div class="card-body">
          <h3 class="card-title">Another Project</h3>
          <p class="text-base-content/60 text-sm">Built with modern technologies to deliver a seamless user experience.</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            <span class="badge badge-outline badge-sm">Next.js</span>
            <span class="badge badge-outline badge-sm">Tailwind</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="#" class="btn btn-primary btn-sm">View Project</a>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <figure class="bg-gradient-to-br from-accent/20 to-primary/20 h-48 flex items-center justify-center text-5xl">📱</figure>
        <div class="card-body">
          <h3 class="card-title">Mobile App</h3>
          <p class="text-base-content/60 text-sm">Cross-platform mobile application with native performance and smooth animations.</p>
          <div class="flex gap-2 mt-2 flex-wrap">
            <span class="badge badge-outline badge-sm">React Native</span>
          </div>
          <div class="card-actions justify-end mt-4">
            <a href="#" class="btn btn-primary btn-sm">View Project</a>
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
    html: `<section class="py-8 px-6 bg-base-200">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-base-content/60">Total Revenue</span>
            <span class="text-2xl">💰</span>
          </div>
          <div class="text-3xl font-bold">$24,563</div>
          <div class="flex items-center gap-1 text-sm text-success mt-1">
            <span>↑</span><span>+12.5% vs last month</span>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-base-content/60">New Users</span>
            <span class="text-2xl">👥</span>
          </div>
          <div class="text-3xl font-bold">1,482</div>
          <div class="flex items-center gap-1 text-sm text-success mt-1">
            <span>↑</span><span>+8.2% vs last month</span>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-base-content/60">Active Projects</span>
            <span class="text-2xl">📋</span>
          </div>
          <div class="text-3xl font-bold">38</div>
          <div class="flex items-center gap-1 text-sm text-base-content/50 mt-1">
            <span>—</span><span>No change</span>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-base-content/60">Churn Rate</span>
            <span class="text-2xl">📉</span>
          </div>
          <div class="text-3xl font-bold">2.4%</div>
          <div class="flex items-center gap-1 text-sm text-success mt-1">
            <span>↓</span><span>-0.3% vs last month</span>
          </div>
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
    html: `<section class="py-16 px-6 bg-base-100">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">Meet the Team</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card bg-base-200 shadow-sm text-center">
        <div class="card-body items-center">
          <div class="avatar mb-4">
            <div class="w-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl">👩‍💻</div>
          </div>
          <h3 class="card-title">Sarah Chen</h3>
          <div class="badge badge-primary badge-sm mb-3">Lead Engineer</div>
          <p class="text-base-content/60 text-sm">10 years of experience building scalable systems. Passionate about clean architecture.</p>
          <div class="flex gap-3 mt-4">
            <a href="#" class="btn btn-ghost btn-xs">Twitter</a>
            <a href="#" class="btn btn-ghost btn-xs">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm text-center">
        <div class="card-body items-center">
          <div class="avatar mb-4">
            <div class="w-20 rounded-full bg-secondary/20 flex items-center justify-center text-3xl">👨‍🎨</div>
          </div>
          <h3 class="card-title">Marcus Rivera</h3>
          <div class="badge badge-secondary badge-sm mb-3">Design Lead</div>
          <p class="text-base-content/60 text-sm">Former FAANG designer. Creates experiences users love and return to.</p>
          <div class="flex gap-3 mt-4">
            <a href="#" class="btn btn-ghost btn-xs">Dribbble</a>
            <a href="#" class="btn btn-ghost btn-xs">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm text-center">
        <div class="card-body items-center">
          <div class="avatar mb-4">
            <div class="w-20 rounded-full bg-accent/20 flex items-center justify-center text-3xl">🧑‍💼</div>
          </div>
          <h3 class="card-title">Alex Johnson</h3>
          <div class="badge badge-accent badge-sm mb-3">Product Manager</div>
          <p class="text-base-content/60 text-sm">Bridges the gap between business goals and technical solutions.</p>
          <div class="flex gap-3 mt-4">
            <a href="#" class="btn btn-ghost btn-xs">Twitter</a>
            <a href="#" class="btn btn-ghost btn-xs">LinkedIn</a>
          </div>
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
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
    <p class="text-center text-base-content/60 mb-12">No hidden fees. Cancel anytime.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h3 class="card-title">Free</h3>
          <div class="text-4xl font-black my-4">$0<span class="text-lg font-normal text-base-content/50">/mo</span></div>
          <ul class="space-y-2 text-sm mb-6">
            <li class="flex gap-2"><span class="text-success">✓</span> 3 projects</li>
            <li class="flex gap-2"><span class="text-success">✓</span> 1 GB storage</li>
            <li class="flex gap-2"><span class="text-success">✓</span> Community support</li>
            <li class="flex gap-2"><span class="text-base-content/30">✗</span> <span class="text-base-content/50">Analytics</span></li>
          </ul>
          <a href="#" class="btn btn-outline btn-block">Get Started</a>
        </div>
      </div>
      <div class="card bg-primary text-primary-content shadow-lg scale-105">
        <div class="card-body">
          <div class="badge badge-secondary mb-2 self-start">Popular</div>
          <h3 class="card-title">Pro</h3>
          <div class="text-4xl font-black my-4">$29<span class="text-lg font-normal opacity-70">/mo</span></div>
          <ul class="space-y-2 text-sm mb-6 opacity-90">
            <li class="flex gap-2"><span>✓</span> Unlimited projects</li>
            <li class="flex gap-2"><span>✓</span> 50 GB storage</li>
            <li class="flex gap-2"><span>✓</span> Email support</li>
            <li class="flex gap-2"><span>✓</span> Advanced analytics</li>
          </ul>
          <a href="#" class="btn btn-secondary btn-block">Start Free Trial</a>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h3 class="card-title">Enterprise</h3>
          <div class="text-4xl font-black my-4">$99<span class="text-lg font-normal text-base-content/50">/mo</span></div>
          <ul class="space-y-2 text-sm mb-6">
            <li class="flex gap-2"><span class="text-success">✓</span> Unlimited everything</li>
            <li class="flex gap-2"><span class="text-success">✓</span> 1 TB storage</li>
            <li class="flex gap-2"><span class="text-success">✓</span> Dedicated support</li>
            <li class="flex gap-2"><span class="text-success">✓</span> Custom integrations</li>
          </ul>
          <a href="#" class="btn btn-outline btn-block">Contact Sales</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
];
