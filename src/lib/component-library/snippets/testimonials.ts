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
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Our Customers Say</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl text-blue-600 dark:text-blue-400 mb-4">"</div>
        <p class="text-gray-600 dark:text-gray-300 italic mb-6">This product completely transformed how our team works. We've saved hours every week and our output quality has never been better.</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">JD</div>
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Jane Doe</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">CEO, Startup Inc</div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl text-indigo-600 dark:text-indigo-400 mb-4">"</div>
        <p class="text-gray-600 dark:text-gray-300 italic mb-6">Incredibly easy to use and the support team is outstanding. Switched from a competitor and never looked back. Highly recommend.</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">MS</div>
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Mike Smith</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">CTO, Tech Corp</div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl text-violet-600 dark:text-violet-400 mb-4">"</div>
        <p class="text-gray-600 dark:text-gray-300 italic mb-6">The analytics features alone are worth the price. Finally I can understand what's actually happening with our data in real time.</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">AL</div>
          <div>
            <div class="font-semibold text-gray-900 dark:text-white">Amy Lee</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Data Lead, Big Co</div>
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
    html: `<section class="py-20 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">Loved by thousands</h2>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-12">Don't take our word for it.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">"Game changer for our workflow. The automation saves us 10+ hours a week."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">👨</div>
          <div>
            <div class="font-medium text-sm text-gray-900 dark:text-white">Tom Wilson</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Product Manager</div>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">"Best investment we made this year. ROI was visible within the first month."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">👩</div>
          <div>
            <div class="font-medium text-sm text-gray-900 dark:text-white">Lisa Park</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Growth Marketer</div>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center gap-1 text-amber-400 mb-3">★★★★☆</div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">"Really powerful tool. The learning curve is minimal and the docs are excellent."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">🧑</div>
          <div>
            <div class="font-medium text-sm text-gray-900 dark:text-white">Chris Brown</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Indie Developer</div>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">"Support is incredible. Got a response within minutes on a Sunday evening. Impressed."</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">👩‍💼</div>
          <div>
            <div class="font-medium text-sm text-gray-900 dark:text-white">Rachel Kim</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Operations Director</div>
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
    html: `<section class="py-24 px-6 bg-blue-600 dark:bg-blue-700">
  <div class="max-w-4xl mx-auto text-center">
    <div class="text-7xl text-white/30 mb-6">"</div>
    <blockquote class="text-2xl md:text-3xl font-light leading-relaxed mb-10 text-white">
      Switching to this platform was the best decision we made this year. Our team velocity doubled and our customers are happier than ever.
    </blockquote>
    <div class="flex items-center justify-center gap-4">
      <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl">👨‍💼</div>
      <div class="text-left">
        <div class="font-bold text-lg text-white">David Chen</div>
        <div class="text-white/70">Co-founder &amp; CEO, ScaleUp Co</div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonial-with-stars",
    name: "Testimonial With Stars",
    description: "Testimonial section with star rating summary and individual reviews",
    category: "testimonials",
    tags: ["testimonials"],
    priority: 2,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">4.9 out of 5 stars</h2>
      <div class="flex justify-center gap-1 text-amber-400 text-3xl mb-2">★★★★★</div>
      <p class="text-gray-500 dark:text-gray-400">Based on 1,240 verified reviews</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">"Absolutely brilliant. Saved our agency countless hours and the clients love the results."</p>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">SJ</div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Sarah Johnson</div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">"The onboarding experience was seamless. Had our team up and running in under an hour."</p>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">MK</div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Marcus King</div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex gap-1 text-amber-400 mb-3">★★★★★</div>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">"I've tried many similar tools. None compare in terms of quality, speed, and reliability."</p>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">EP</div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Elena Patel</div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonial-avatar-group",
    name: "Testimonial Avatar Group",
    description: "Compact testimonial with stacked avatar group and social proof numbers",
    category: "testimonials",
    tags: ["testimonials"],
    priority: 2,
    domain_hints: ["landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-4xl mx-auto text-center">
    <div class="flex justify-center mb-4">
      <div class="flex -space-x-3">
        <div class="w-10 h-10 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">AB</div>
        <div class="w-10 h-10 rounded-full bg-violet-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">CD</div>
        <div class="w-10 h-10 rounded-full bg-teal-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">EF</div>
        <div class="w-10 h-10 rounded-full bg-amber-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">GH</div>
        <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold">+99</div>
      </div>
    </div>
    <div class="flex justify-center gap-1 text-amber-400 mb-3">★★★★★</div>
    <p class="text-gray-900 dark:text-white font-semibold text-lg mb-1">Trusted by 10,000+ teams</p>
    <p class="text-gray-500 dark:text-gray-400 text-sm">Join teams at Stripe, Notion, Linear and more who rely on us daily.</p>
  </div>
</section>`,
  },
];
