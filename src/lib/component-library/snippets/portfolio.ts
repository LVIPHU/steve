import type { ComponentSnippet } from "../types";

export const portfolioSnippets: ComponentSnippet[] = [
  {
    id: "skills-grid",
    name: "Skills Grid",
    description: "Grid display of technical skills with proficiency levels",
    category: "portfolio",
    tags: ["skills"],
    priority: 1,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Skills &amp; Expertise</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Frontend</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">React / Next.js</span><span class="text-gray-400 dark:text-gray-500">Expert</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full" style="width:95%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">TypeScript</span><span class="text-gray-400 dark:text-gray-500">Advanced</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full" style="width:85%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">CSS / Tailwind</span><span class="text-gray-400 dark:text-gray-500">Expert</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full" style="width:90%"></div></div>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Backend</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">Node.js</span><span class="text-gray-400 dark:text-gray-500">Advanced</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-indigo-600 rounded-full" style="width:80%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">PostgreSQL</span><span class="text-gray-400 dark:text-gray-500">Intermediate</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-indigo-600 rounded-full" style="width:70%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span class="text-gray-900 dark:text-white">Python</span><span class="text-gray-400 dark:text-gray-500">Intermediate</span></div>
            <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-indigo-600 rounded-full" style="width:65%"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Technologies</h3>
      <div class="flex flex-wrap gap-2">
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Docker</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">AWS</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Git</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">GraphQL</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Redis</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Figma</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">Vitest</span>
        <span class="py-1 px-3 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">CI/CD</span>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "projects-showcase",
    name: "Projects Showcase",
    description: "Featured projects section with detailed cards and tech stack badges",
    category: "portfolio",
    tags: ["projects", "cards"],
    priority: 1,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Selected Projects</h2>
      <a href="#" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">All Projects &rarr;</a>
    </div>
    <div class="space-y-10">
      <div class="flex flex-col lg:flex-row bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div class="lg:w-72 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-6xl min-h-48">🚀</div>
        <div class="p-6 flex-1">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">SaaS Platform</h3>
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">Live</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-4">A full-stack SaaS application built for teams. Includes real-time collaboration, role-based access control, and automated billing via Stripe.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">Next.js</span>
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">PostgreSQL</span>
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">Stripe</span>
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">Vercel</span>
          </div>
          <div class="flex gap-3">
            <a href="#" class="py-2 px-4 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Live Demo</a>
            <a href="#" class="py-2 px-4 inline-flex items-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
      <div class="flex flex-col lg:flex-row bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div class="lg:w-72 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center text-6xl min-h-48">📱</div>
        <div class="p-6 flex-1">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Mobile App</h3>
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">In Progress</span>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Cross-platform mobile application with offline support, push notifications, and native camera integration. 4.8 star rating on App Store.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">React Native</span>
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">Expo</span>
            <span class="py-0.5 px-2 rounded border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">Firebase</span>
          </div>
          <div class="flex gap-3">
            <a href="#" class="py-2 px-4 inline-flex items-center text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">App Store</a>
            <a href="#" class="py-2 px-4 inline-flex items-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "career-timeline",
    name: "Career Timeline",
    description: "Work experience and education timeline for portfolio/CV pages",
    category: "portfolio",
    tags: ["timeline"],
    priority: 2,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Experience</h2>
    <div class="space-y-8">
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
          <div class="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <div class="flex flex-wrap gap-2 items-center mb-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</h3>
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Current</span>
          </div>
          <div class="text-gray-500 dark:text-gray-400 text-sm mb-3">Tech Startup Inc · 2022 – Present</div>
          <ul class="text-gray-600 dark:text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Led frontend architecture for 3 product lines</li>
            <li>Reduced page load time by 40% through optimization</li>
            <li>Mentored team of 4 junior developers</li>
          </ul>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-indigo-600 dark:bg-indigo-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
          <div class="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold mb-1 text-gray-900 dark:text-white">Full Stack Developer</h3>
          <div class="text-gray-500 dark:text-gray-400 text-sm mb-3">Agency Co · 2020 – 2022</div>
          <ul class="text-gray-600 dark:text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Delivered 15+ client projects on time and within budget</li>
            <li>Built custom CMS and e-commerce solutions</li>
          </ul>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-violet-600 dark:bg-violet-500 mt-1 flex-shrink-0 ring-4 ring-white dark:ring-gray-900"></div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-1 text-gray-900 dark:text-white">Junior Developer</h3>
          <div class="text-gray-500 dark:text-gray-400 text-sm mb-3">Freelance · 2018 – 2020</div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">Worked with local businesses to establish their online presence. Built responsive websites and integrated payment gateways.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Clean contact form with name, email, and message fields",
    category: "portfolio",
    tags: ["contact"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900" id="contact">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get In Touch</h2>
      <p class="text-gray-500 dark:text-gray-400">Have a project in mind? Let's talk. I'll get back to you within 24 hours.</p>
    </div>
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <form id="contact-form" class="space-y-6" onsubmit="return false">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input type="text" placeholder="Jane Doe" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" placeholder="jane@example.com" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
          <input type="text" placeholder="Project inquiry" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea class="w-full h-32 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell me about your project..."></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" id="contact-submit">Send Message</button>
        <div id="contact-feedback" class="hidden rounded-lg p-4 bg-teal-100 border border-teal-300 text-teal-800 dark:bg-teal-500/20 dark:border-teal-900 dark:text-teal-300 text-sm">
          Message sent! I'll get back to you soon.
        </div>
      </form>
    </div>
  </div>
  <script>
    (function() {
      document.getElementById('contact-form').addEventListener('submit', function() {
        const btn = document.getElementById('contact-submit');
        const fb = document.getElementById('contact-feedback');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        setTimeout(function() {
          btn.classList.add('hidden');
          fb.classList.remove('hidden');
        }, 800);
      });
    })();
  </script>
</section>`,
  },
  {
    id: "portfolio-tabs-filter",
    name: "Portfolio Filter Tabs",
    description: "Portfolio project grid with Preline tab filter by type",
    category: "portfolio",
    tags: ["projects", "cards"],
    priority: 2,
    domain_hints: ["portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Work</h2>
    <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav class="flex gap-x-1" data-hs-tabs>
        <button type="button" class="py-3 px-4 text-sm font-medium border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500" data-hs-tab="#portfolio-panel-all" id="portfolio-tab-all">All</button>
        <button type="button" class="py-3 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" data-hs-tab="#portfolio-panel-web" id="portfolio-tab-web">Web</button>
        <button type="button" class="py-3 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" data-hs-tab="#portfolio-panel-mobile" id="portfolio-tab-mobile">Mobile</button>
      </nav>
    </div>
    <div id="portfolio-panel-all">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-4xl">🌐</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">SaaS Dashboard</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Web app</p></div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center text-4xl">📱</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">Fitness Tracker</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Mobile app</p></div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center text-4xl">🛒</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">E-commerce Store</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Web app</p></div>
        </div>
      </div>
    </div>
    <div id="portfolio-panel-web" class="hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-4xl">🌐</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">SaaS Dashboard</h3></div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center text-4xl">🛒</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">E-commerce Store</h3></div>
        </div>
      </div>
    </div>
    <div id="portfolio-panel-mobile" class="hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div class="h-40 bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center text-4xl">📱</div>
          <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">Fitness Tracker</h3></div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "portfolio-lightbox",
    name: "Portfolio Gallery Lightbox",
    description: "Image gallery grid with Preline modal overlay lightbox",
    category: "portfolio",
    tags: ["gallery", "images"],
    priority: 2,
    domain_hints: ["portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Gallery</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#gallery-modal">
        <div class="flex items-center justify-center h-full text-4xl">🖼️</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-violet-100 to-pink-200 dark:from-violet-900/30 dark:to-pink-900/30 rounded-xl overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#gallery-modal">
        <div class="flex items-center justify-center h-full text-4xl">🎨</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#gallery-modal">
        <div class="flex items-center justify-center h-full text-4xl">📸</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
    </div>
  </div>
  <div id="gallery-modal" class="hs-overlay hidden fixed inset-0 z-50 overflow-x-hidden overflow-y-auto flex items-center justify-center">
    <div class="hs-overlay-backdrop fixed inset-0 bg-black/70" data-hs-overlay-backdrop></div>
    <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Project Preview</h3>
        <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-hs-overlay="#gallery-modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center text-6xl">🖼️</div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Project description goes here. Built with React, Node.js, and PostgreSQL.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "portfolio-masonry",
    name: "Portfolio Masonry Grid",
    description: "Masonry-style portfolio grid with varying card heights",
    category: "portfolio",
    tags: ["projects", "gallery"],
    priority: 3,
    domain_hints: ["portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Creative Work</h2>
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <div class="break-inside-avoid bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="h-52 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-5xl">🚀</div>
        <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">SaaS Platform</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Full-stack web application with real-time features.</p></div>
      </div>
      <div class="break-inside-avoid bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="h-36 bg-gradient-to-br from-violet-100 to-pink-200 dark:from-violet-900/30 dark:to-pink-900/30 flex items-center justify-center text-5xl">🎨</div>
        <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">Brand Identity</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete visual identity design system.</p></div>
      </div>
      <div class="break-inside-avoid bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="h-64 bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900/30 dark:to-emerald-900/30 flex items-center justify-center text-5xl">📱</div>
        <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">Mobile App</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Cross-platform app with 50K+ downloads.</p></div>
      </div>
      <div class="break-inside-avoid bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="h-44 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-5xl">🛒</div>
        <div class="p-4"><h3 class="font-bold text-gray-900 dark:text-white">E-commerce</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">High-converting online store redesign.</p></div>
      </div>
    </div>
  </div>
</section>`,
  },
];
