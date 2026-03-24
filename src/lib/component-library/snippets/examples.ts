import type { ComponentSnippet } from "../types";

export const exampleSnippets: ComponentSnippet[] = [
  {
    id: "example-landing-saas",
    name: "Complete SaaS Landing Page",
    description: "Production-ready landing page: sticky navbar, hero with gradient, 3-col features, pricing table, testimonials, CTA, footer",
    category: "example",
    tags: ["landing", "hero", "navbar", "features", "pricing", "testimonials", "cta", "footer", "saas"],
    priority: 0,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: true,
    fallback_for: ["landing"],
    html: `<!-- GOLDEN EXAMPLE: SaaS Landing Page — adapt structure & quality -->
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Name</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --color-primary: #6366f1; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

  <!-- Navbar -->
  <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="index" class="text-xl font-bold text-indigo-600">ProductName</a>
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
        <a href="#pricing" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</a>
        <a href="#" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">Get Started</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="py-24 lg:py-32 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8">
        Now in public beta
      </span>
      <h1 class="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
        Build something <span class="text-indigo-600">amazing</span> today
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        The all-in-one platform that helps you ship faster, collaborate better, and grow your business.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#" class="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
          Start for free
        </a>
        <a href="#" class="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-indigo-400 transition-colors text-lg">
          See demo
        </a>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="py-24 bg-white dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Powerful features built for modern teams</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Built for performance from the ground up. No compromises on speed or reliability.</p>
        </div>
        <div class="group p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure by Default</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Enterprise-grade security with end-to-end encryption and compliance built in.</p>
        </div>
        <div class="group p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Powerful Analytics</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Real-time insights and dashboards that help you make smarter decisions.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, transparent pricing</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">No hidden fees. Cancel anytime.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
          <div class="flex items-end gap-1 mb-6"><span class="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span><span class="text-gray-500 mb-1">/mo</span></div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Up to 3 projects</li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Basic analytics</li>
          </ul>
          <a href="#" class="block w-full py-3 text-center border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-indigo-400 transition-colors">Get started</a>
        </div>
        <div class="p-8 bg-indigo-600 rounded-2xl border border-indigo-600 shadow-2xl shadow-indigo-200 dark:shadow-none relative">
          <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">POPULAR</span>
          <h3 class="text-lg font-bold text-white mb-2">Pro</h3>
          <div class="flex items-end gap-1 mb-6"><span class="text-4xl font-extrabold text-white">$29</span><span class="text-indigo-200 mb-1">/mo</span></div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-indigo-100"><svg class="w-4 h-4 text-indigo-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Unlimited projects</li>
            <li class="flex items-center gap-2 text-sm text-indigo-100"><svg class="w-4 h-4 text-indigo-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Advanced analytics</li>
            <li class="flex items-center gap-2 text-sm text-indigo-100"><svg class="w-4 h-4 text-indigo-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Priority support</li>
          </ul>
          <a href="#" class="block w-full py-3 text-center bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Start free trial</a>
        </div>
        <div class="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
          <div class="flex items-end gap-1 mb-6"><span class="text-4xl font-extrabold text-gray-900 dark:text-white">$99</span><span class="text-gray-500 mb-1">/mo</span></div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Everything in Pro</li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Custom integrations</li>
          </ul>
          <a href="#" class="block w-full py-3 text-center border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-indigo-400 transition-colors">Contact sales</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-24 bg-indigo-600">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
      <p class="text-xl text-indigo-200 mb-10">Join thousands of teams already using ProductName</p>
      <a href="#" class="inline-block px-10 py-4 bg-white text-indigo-700 rounded-xl font-bold hover:bg-gray-50 transition-colors text-lg shadow-xl">
        Start free trial
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-16 bg-gray-900 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div class="col-span-2 md:col-span-1">
          <div class="text-xl font-bold text-white mb-4">ProductName</div>
          <p class="text-sm leading-relaxed">Building the future, one feature at a time.</p>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
          <ul class="space-y-3 text-sm"><li><a href="#" class="hover:text-white transition-colors">Features</a></li><li><a href="#" class="hover:text-white transition-colors">Pricing</a></li></ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul class="space-y-3 text-sm"><li><a href="#" class="hover:text-white transition-colors">About</a></li><li><a href="#" class="hover:text-white transition-colors">Blog</a></li></ul>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul class="space-y-3 text-sm"><li><a href="#" class="hover:text-white transition-colors">Docs</a></li><li><a href="#" class="hover:text-white transition-colors">Contact</a></li></ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-sm text-center">© 2026 ProductName. All rights reserved.</div>
    </div>
  </footer>
</body>
</html>`
  },
  {
    id: "example-portfolio",
    name: "Complete Portfolio Page",
    description: "Professional portfolio: sticky navbar, hero with bio, skills grid, projects showcase, contact form, footer",
    category: "example",
    tags: ["portfolio", "hero", "navbar", "skills", "projects", "contact", "footer"],
    priority: 0,
    domain_hints: ["portfolio"],
    min_score: 0,
    fallback: true,
    fallback_for: ["portfolio"],
    html: `<!-- GOLDEN EXAMPLE: Portfolio Page — adapt structure & quality -->
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jane Doe — Designer</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

  <!-- Navbar -->
  <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <span class="text-xl font-bold">Jane Doe</span>
      <div class="hidden md:flex items-center gap-8">
        <a href="#about" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</a>
        <a href="#work" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Work</a>
        <a href="#contact" class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Hire me</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section id="about" class="py-24 lg:py-32">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
      <div class="flex-1">
        <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">Product Designer</p>
        <h1 class="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Hi, I'm Jane.<br>I design <span class="text-indigo-600">things that matter.</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
          5 years of experience crafting user-centered digital products for startups and enterprise companies.
        </p>
        <div class="flex gap-4">
          <a href="#work" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">View my work</a>
          <a href="#contact" class="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-indigo-400 transition-colors">Get in touch</a>
        </div>
      </div>
      <div class="w-72 h-72 lg:w-80 lg:h-80 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-600 flex-shrink-0 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/50"></div>
    </div>
  </section>

  <!-- Skills -->
  <section class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold mb-8">Skills & Tools</h2>
      <div class="flex flex-wrap gap-3">
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">Figma</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">User Research</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">Prototyping</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">Design Systems</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">React</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">Tailwind CSS</span>
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium">Accessibility</span>
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section id="work" class="py-24">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">Selected Work</h2>
        <p class="text-xl text-gray-600 dark:text-gray-400">Recent projects I'm proud of</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <a href="#" class="group block overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div class="h-56 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 group-hover:scale-105 transition-transform duration-300"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">FinTech Dashboard</h3>
              <span class="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">Case study</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Redesigned the core analytics dashboard, increasing user engagement by 40%</p>
          </div>
        </a>
        <a href="#" class="group block overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div class="h-56 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 group-hover:scale-105 transition-transform duration-300"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">E-commerce Redesign</h3>
              <span class="text-xs px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-medium">UX Research</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">End-to-end redesign of checkout flow, reducing cart abandonment by 25%</p>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-24 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-4xl font-bold mb-4">Let's work together</h2>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-10">Have a project in mind? I'd love to hear about it.</p>
      <form class="text-left space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label><input type="text" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name"></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label><textarea rows="4" class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Tell me about your project"></textarea></div>
        <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Send message</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 bg-gray-900 text-gray-400 text-sm text-center">
    <p>© 2026 Jane Doe. Built with care.</p>
  </footer>
</body>
</html>`
  },
  {
    id: "example-blog",
    name: "Complete Blog / Content Site",
    description: "Clean blog layout: navbar, hero with search, featured article, article grid, newsletter signup, footer",
    category: "example",
    tags: ["blog", "hero", "navbar", "articles", "newsletter", "footer", "content"],
    priority: 0,
    domain_hints: ["blog"],
    min_score: 0,
    fallback: true,
    fallback_for: ["blog"],
    html: `<!-- GOLDEN EXAMPLE: Blog / Content Site — adapt structure & quality -->
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Daily Brief</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3 { font-family: 'Merriweather', serif; }
  </style>
</head>
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

  <!-- Navbar -->
  <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="index" class="text-xl font-bold" style="font-family: 'Merriweather', serif;">The Daily Brief</a>
      <div class="hidden md:flex items-center gap-6">
        <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Technology</a>
        <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Design</a>
        <a href="#" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Culture</a>
        <a href="#" class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Subscribe</a>
      </div>
    </div>
  </nav>

  <!-- Featured Article -->
  <section class="py-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-10 items-center">
        <div class="flex-1">
          <span class="inline-block px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4">Featured</span>
          <h1 class="text-3xl lg:text-4xl font-bold mb-4 leading-tight">The Rise of AI-Generated Design: What It Means for Creatives</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">As AI tools become increasingly capable of generating visual content, designers must adapt their skills and find new ways to stay relevant in a rapidly evolving landscape.</p>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex-shrink-0"></div>
            <div><p class="text-sm font-semibold">Sarah Chen</p><p class="text-xs text-gray-500">March 24, 2026 · 8 min read</p></div>
          </div>
        </div>
        <div class="w-full lg:w-96 h-56 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 rounded-2xl flex-shrink-0"></div>
      </div>
    </div>
  </section>

  <!-- Article Grid -->
  <section class="py-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold mb-10">Latest Articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article class="group">
          <div class="h-44 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl mb-4 overflow-hidden"><div class="w-full h-full group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"></div></div>
          <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Technology</span>
          <h3 class="text-lg font-bold mt-1 mb-2 leading-snug group-hover:text-indigo-600 transition-colors"><a href="#">Understanding Web Performance in 2026</a></h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">Core Web Vitals have changed. Here's what you need to know to keep your sites fast.</p>
          <p class="text-xs text-gray-400">Mar 22 · 5 min read</p>
        </article>
        <article class="group">
          <div class="h-44 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl mb-4"></div>
          <span class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Design</span>
          <h3 class="text-lg font-bold mt-1 mb-2 leading-snug group-hover:text-indigo-600 transition-colors"><a href="#">Design Systems That Scale</a></h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">Building component libraries that grow with your team and stay consistent over time.</p>
          <p class="text-xs text-gray-400">Mar 20 · 7 min read</p>
        </article>
        <article class="group">
          <div class="h-44 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 rounded-xl mb-4"></div>
          <span class="text-xs font-semibold text-violet-600 uppercase tracking-wider">Culture</span>
          <h3 class="text-lg font-bold mt-1 mb-2 leading-snug group-hover:text-indigo-600 transition-colors"><a href="#">Remote Work 3 Years Later</a></h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">What we've learned about distributed teams, async communication, and work-life integration.</p>
          <p class="text-xs text-gray-400">Mar 18 · 6 min read</p>
        </article>
      </div>
    </div>
  </section>

  <!-- Newsletter -->
  <section class="py-20 bg-gray-900 text-white">
    <div class="max-w-2xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-4">Stay in the loop</h2>
      <p class="text-gray-400 mb-8">Get the best articles delivered to your inbox every week.</p>
      <form class="flex gap-3 max-w-md mx-auto">
        <input type="email" placeholder="your@email.com" class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500">
        <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap">Subscribe</button>
      </form>
      <p class="text-xs text-gray-500 mt-4">No spam. Unsubscribe anytime.</p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 bg-gray-900 border-t border-gray-800 text-gray-400 text-sm text-center">
    <p>© 2026 The Daily Brief. All rights reserved.</p>
  </footer>
</body>
</html>`
  },
];
