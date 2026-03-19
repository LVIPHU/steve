import type { ComponentSnippet } from "../types";

export const heroSnippets: ComponentSnippet[] = [
  {
    id: "hero-centered",
    name: "Hero Centered",
    description: "Full-width centered hero with headline, subtitle, and CTA buttons",
    category: "hero",
    tags: ["hero", "cta"],
    priority: 1,
    domain_hints: ["landing"],
    min_score: 1,
    fallback: true,
    fallback_for: ["landing", "generic", "blog"],
    html: `<section class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="text-5xl font-bold">Welcome to Your Site</h1>
      <p class="py-6 text-lg text-base-content/70">Build something amazing. Your product description goes here to explain the value proposition clearly and concisely.</p>
      <div class="flex gap-4 justify-center">
        <a href="#" class="btn btn-primary btn-lg">Get Started</a>
        <a href="#" class="btn btn-outline btn-lg">Learn More</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-split",
    name: "Hero Split Layout",
    description: "Two-column hero with text on left, image placeholder on right",
    category: "hero",
    tags: ["hero", "features"],
    priority: 1,
    domain_hints: ["portfolio"],
    min_score: 1,
    fallback: true,
    fallback_for: ["portfolio"],
    html: `<section class="hero min-h-screen bg-base-100">
  <div class="hero-content flex-col lg:flex-row gap-12 max-w-6xl mx-auto px-6">
    <div class="flex-1">
      <div class="badge badge-primary mb-4">Available for Work</div>
      <h1 class="text-5xl font-bold leading-tight">Hi, I'm <span class="text-primary">Your Name</span></h1>
      <p class="py-6 text-lg text-base-content/70">Full-stack developer specializing in building exceptional digital experiences. Passionate about clean code and user-centered design.</p>
      <div class="flex gap-4">
        <a href="#projects" class="btn btn-primary">View Work</a>
        <a href="#contact" class="btn btn-ghost">Contact Me</a>
      </div>
    </div>
    <div class="flex-1 flex justify-center">
      <div class="w-72 h-72 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl">👤</div>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-minimal",
    name: "Hero Minimal",
    description: "Clean minimal hero with large typography and single CTA",
    category: "hero",
    tags: ["hero"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-24 px-6 max-w-4xl mx-auto text-center">
  <span class="badge badge-outline badge-lg mb-6">New Feature Released</span>
  <h1 class="text-6xl font-black tracking-tight mb-6">Make it <span class="text-primary">simple</span></h1>
  <p class="text-xl text-base-content/60 max-w-xl mx-auto mb-10">Less is more. Focus on what matters and strip away the noise. Your users will thank you.</p>
  <a href="#" class="btn btn-primary btn-lg px-10">Start Now &rarr;</a>
</section>`,
  },
  {
    id: "hero-dashboard",
    name: "Hero Dashboard Header",
    description: "Dashboard top header with stats summary and quick actions",
    category: "hero",
    tags: ["hero", "stats"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: true,
    fallback_for: ["dashboard"],
    html: `<section class="bg-base-200 px-6 py-8">
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-base-content/60 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-ghost btn-sm">Export</button>
        <button class="btn btn-primary btn-sm">+ New</button>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="stat bg-base-100 rounded-box p-4">
        <div class="stat-title text-sm">Total Users</div>
        <div class="stat-value text-2xl">1,240</div>
        <div class="stat-desc text-success">↑ 12% this month</div>
      </div>
      <div class="stat bg-base-100 rounded-box p-4">
        <div class="stat-title text-sm">Revenue</div>
        <div class="stat-value text-2xl">$4.8k</div>
        <div class="stat-desc text-success">↑ 8% this month</div>
      </div>
      <div class="stat bg-base-100 rounded-box p-4">
        <div class="stat-title text-sm">Active Sessions</div>
        <div class="stat-value text-2xl">342</div>
        <div class="stat-desc">Right now</div>
      </div>
      <div class="stat bg-base-100 rounded-box p-4">
        <div class="stat-title text-sm">Conversion</div>
        <div class="stat-value text-2xl">3.2%</div>
        <div class="stat-desc text-error">↓ 1% this week</div>
      </div>
    </div>
  </div>
</section>`,
  },
];
