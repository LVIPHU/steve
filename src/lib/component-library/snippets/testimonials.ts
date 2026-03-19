import type { ComponentSnippet } from "../types";

export const testimonialsSnippets: ComponentSnippet[] = [
  {
    id: "testimonial-quotes",
    name: "Testimonial Quotes",
    description: "Grid of quote testimonials with name and role",
    category: "testimonials",
    tags: ["testimonials"],
    priority: 1,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <div class="text-4xl text-primary mb-4">"</div>
          <p class="text-base-content/70 italic mb-6">This product completely transformed how our team works. We've saved hours every week and our output quality has never been better.</p>
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10 text-sm font-bold flex items-center justify-center">JD</div>
            </div>
            <div>
              <div class="font-semibold">Jane Doe</div>
              <div class="text-sm text-base-content/50">CEO, Startup Inc</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <div class="text-4xl text-secondary mb-4">"</div>
          <p class="text-base-content/70 italic mb-6">Incredibly easy to use and the support team is outstanding. Switched from a competitor and never looked back. Highly recommend.</p>
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-secondary text-secondary-content rounded-full w-10 text-sm font-bold flex items-center justify-center">MS</div>
            </div>
            <div>
              <div class="font-semibold">Mike Smith</div>
              <div class="text-sm text-base-content/50">CTO, Tech Corp</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <div class="text-4xl text-accent mb-4">"</div>
          <p class="text-base-content/70 italic mb-6">The analytics features alone are worth the price. Finally I can understand what's actually happening with our data in real time.</p>
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-accent text-accent-content rounded-full w-10 text-sm font-bold flex items-center justify-center">AL</div>
            </div>
            <div>
              <div class="font-semibold">Amy Lee</div>
              <div class="text-sm text-base-content/50">Data Lead, Big Co</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonial-avatar-grid",
    name: "Testimonial Avatar Grid",
    description: "Masonry-style testimonial grid with avatars and star ratings",
    category: "testimonials",
    tags: ["testimonials"],
    priority: 2,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-4">Loved by thousands</h2>
    <p class="text-center text-base-content/60 mb-12">Don't take our word for it.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center gap-1 text-warning mb-3">★★★★★</div>
          <p class="text-base-content/70 mb-4">"Game changer for our workflow. The automation saves us 10+ hours a week."</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl">👨</div>
            <div><div class="font-medium text-sm">Tom Wilson</div><div class="text-xs text-base-content/50">Product Manager</div></div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center gap-1 text-warning mb-3">★★★★★</div>
          <p class="text-base-content/70 mb-4">"Best investment we made this year. ROI was visible within the first month."</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl">👩</div>
            <div><div class="font-medium text-sm">Lisa Park</div><div class="text-xs text-base-content/50">Growth Marketer</div></div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center gap-1 text-warning mb-3">★★★★☆</div>
          <p class="text-base-content/70 mb-4">"Really powerful tool. The learning curve is minimal and the docs are excellent."</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl">🧑</div>
            <div><div class="font-medium text-sm">Chris Brown</div><div class="text-xs text-base-content/50">Indie Developer</div></div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <div class="flex items-center gap-1 text-warning mb-3">★★★★★</div>
          <p class="text-base-content/70 mb-4">"Support is incredible. Got a response within minutes on a Sunday evening. Impressed."</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl">👩‍💼</div>
            <div><div class="font-medium text-sm">Rachel Kim</div><div class="text-xs text-base-content/50">Operations Director</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonial-featured",
    name: "Testimonial Featured",
    description: "Single large featured testimonial with prominent quote",
    category: "testimonials",
    tags: ["testimonials"],
    priority: 3,
    domain_hints: [],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-24 px-6 bg-primary text-primary-content">
  <div class="max-w-4xl mx-auto text-center">
    <div class="text-7xl opacity-30 mb-6">"</div>
    <blockquote class="text-2xl md:text-3xl font-light leading-relaxed mb-10">
      Switching to this platform was the best decision we made this year. Our team velocity doubled and our customers are happier than ever.
    </blockquote>
    <div class="flex items-center justify-center gap-4">
      <div class="w-14 h-14 rounded-full bg-primary-content/20 flex items-center justify-center text-3xl">👨‍💼</div>
      <div class="text-left">
        <div class="font-bold text-lg">David Chen</div>
        <div class="opacity-70">Co-founder & CEO, ScaleUp Co</div>
      </div>
    </div>
  </div>
</section>`,
  },
];
