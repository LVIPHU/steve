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
    html: `<section class="py-16 px-6 bg-base-200">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-10">Skills & Expertise</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold mb-4 text-primary">Frontend</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1"><span>React / Next.js</span><span class="text-base-content/50">Expert</span></div>
            <progress class="progress progress-primary w-full" value="95" max="100"></progress>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span>TypeScript</span><span class="text-base-content/50">Advanced</span></div>
            <progress class="progress progress-primary w-full" value="85" max="100"></progress>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span>CSS / Tailwind</span><span class="text-base-content/50">Expert</span></div>
            <progress class="progress progress-primary w-full" value="90" max="100"></progress>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4 text-secondary">Backend</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1"><span>Node.js</span><span class="text-base-content/50">Advanced</span></div>
            <progress class="progress progress-secondary w-full" value="80" max="100"></progress>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span>PostgreSQL</span><span class="text-base-content/50">Intermediate</span></div>
            <progress class="progress progress-secondary w-full" value="70" max="100"></progress>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-1"><span>Python</span><span class="text-base-content/50">Intermediate</span></div>
            <progress class="progress progress-secondary w-full" value="65" max="100"></progress>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10">
      <h3 class="text-lg font-semibold mb-4">Technologies</h3>
      <div class="flex flex-wrap gap-2">
        <span class="badge badge-outline">Docker</span>
        <span class="badge badge-outline">AWS</span>
        <span class="badge badge-outline">Git</span>
        <span class="badge badge-outline">GraphQL</span>
        <span class="badge badge-outline">Redis</span>
        <span class="badge badge-outline">Figma</span>
        <span class="badge badge-outline">Vitest</span>
        <span class="badge badge-outline">CI/CD</span>
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
    html: `<section class="py-16 px-6 bg-base-100">
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold">Selected Projects</h2>
      <a href="#" class="btn btn-ghost btn-sm">All Projects &rarr;</a>
    </div>
    <div class="space-y-10">
      <div class="card lg:card-side bg-base-200 shadow-sm">
        <figure class="lg:w-72 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-6xl min-h-48">🚀</figure>
        <div class="card-body">
          <div class="flex items-start justify-between">
            <h3 class="card-title text-xl">SaaS Platform</h3>
            <span class="badge badge-success badge-sm">Live</span>
          </div>
          <p class="text-base-content/60 mb-4">A full-stack SaaS application built for teams. Includes real-time collaboration, role-based access control, and automated billing via Stripe.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="badge badge-outline badge-sm">Next.js</span>
            <span class="badge badge-outline badge-sm">PostgreSQL</span>
            <span class="badge badge-outline badge-sm">Stripe</span>
            <span class="badge badge-outline badge-sm">Vercel</span>
          </div>
          <div class="card-actions">
            <a href="#" class="btn btn-primary btn-sm">Live Demo</a>
            <a href="#" class="btn btn-ghost btn-sm">GitHub</a>
          </div>
        </div>
      </div>
      <div class="card lg:card-side bg-base-200 shadow-sm">
        <figure class="lg:w-72 bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center text-6xl min-h-48">📱</figure>
        <div class="card-body">
          <div class="flex items-start justify-between">
            <h3 class="card-title text-xl">Mobile App</h3>
            <span class="badge badge-info badge-sm">In Progress</span>
          </div>
          <p class="text-base-content/60 mb-4">Cross-platform mobile application with offline support, push notifications, and native camera integration. 4.8 star rating on App Store.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="badge badge-outline badge-sm">React Native</span>
            <span class="badge badge-outline badge-sm">Expo</span>
            <span class="badge badge-outline badge-sm">Firebase</span>
          </div>
          <div class="card-actions">
            <a href="#" class="btn btn-secondary btn-sm">App Store</a>
            <a href="#" class="btn btn-ghost btn-sm">GitHub</a>
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
    html: `<section class="py-16 px-6 bg-base-200">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-12">Experience</h2>
    <div class="space-y-8">
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0"></div>
          <div class="w-0.5 bg-base-300 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <div class="flex flex-wrap gap-2 items-center mb-1">
            <h3 class="text-xl font-bold">Senior Frontend Engineer</h3>
            <span class="badge badge-primary badge-sm">Current</span>
          </div>
          <div class="text-base-content/60 text-sm mb-3">Tech Startup Inc · 2022 – Present</div>
          <ul class="text-base-content/70 text-sm space-y-1 list-disc list-inside">
            <li>Led frontend architecture for 3 product lines</li>
            <li>Reduced page load time by 40% through optimization</li>
            <li>Mentored team of 4 junior developers</li>
          </ul>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-secondary mt-1 flex-shrink-0"></div>
          <div class="w-0.5 bg-base-300 flex-1 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold mb-1">Full Stack Developer</h3>
          <div class="text-base-content/60 text-sm mb-3">Agency Co · 2020 – 2022</div>
          <ul class="text-base-content/70 text-sm space-y-1 list-disc list-inside">
            <li>Delivered 15+ client projects on time and within budget</li>
            <li>Built custom CMS and e-commerce solutions</li>
          </ul>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-4 h-4 rounded-full bg-accent mt-1 flex-shrink-0"></div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-1">Junior Developer</h3>
          <div class="text-base-content/60 text-sm mb-3">Freelance · 2018 – 2020</div>
          <p class="text-base-content/70 text-sm">Worked with local businesses to establish their online presence. Built responsive websites and integrated payment gateways.</p>
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
    html: `<section class="py-16 px-6 bg-base-100" id="contact">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">Get In Touch</h2>
      <p class="text-base-content/60">Have a project in mind? Let's talk. I'll get back to you within 24 hours.</p>
    </div>
    <div class="card bg-base-200 shadow-sm">
      <div class="card-body">
        <form id="contact-form" class="space-y-6" onsubmit="return false">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control">
              <label class="label"><span class="label-text font-medium">Name</span></label>
              <input type="text" placeholder="Jane Doe" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-medium">Email</span></label>
              <input type="email" placeholder="jane@example.com" class="input input-bordered w-full" required />
            </div>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Subject</span></label>
            <input type="text" placeholder="Project inquiry" class="input input-bordered w-full" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text font-medium">Message</span></label>
            <textarea class="textarea textarea-bordered w-full h-32" placeholder="Tell me about your project..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block" id="contact-submit">Send Message</button>
          <div id="contact-feedback" class="hidden alert alert-success">
            <span>Message sent! I'll get back to you soon.</span>
          </div>
        </form>
      </div>
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
];
