import type { ComponentSnippet } from "../types";

export const formsSnippets: ComponentSnippet[] = [
  {
    id: "forms-contact",
    name: "Contact Form",
    description: "Contact form with name, email, and message fields",
    category: "forms",
    tags: ["contact-form", "form"],
    priority: 1,
    domain_hints: ["landing", "portfolio", "business"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h2>
      <p class="text-gray-500 dark:text-gray-400">We'll get back to you within 24 hours.</p>
    </div>
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <form class="space-y-5" onsubmit="return false" id="contact-form-main">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First name</label>
            <input type="text" placeholder="Jane" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last name</label>
            <input type="text" placeholder="Doe" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
          <input type="email" placeholder="jane@example.com" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
          <input type="text" placeholder="How can we help?" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
          <textarea rows="4" placeholder="Tell us more..." class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Send Message</button>
      </form>
    </div>
  </div>
</section>`,
  },
  {
    id: "forms-newsletter",
    name: "Newsletter Signup",
    description: "Newsletter signup with email field and submit button",
    category: "forms",
    tags: ["newsletter", "form"],
    priority: 2,
    domain_hints: ["blog", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Stay in the Loop</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Get the latest updates, articles, and resources delivered straight to your inbox.</p>
    <form class="flex flex-col sm:flex-row gap-3" onsubmit="return false" id="newsletter-form">
      <input type="email" placeholder="Enter your email address" class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <button type="submit" class="py-2.5 px-6 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0">Subscribe</button>
    </form>
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">No spam, ever. Unsubscribe at any time.</p>
  </div>
</section>`,
  },
  {
    id: "forms-multi-step",
    name: "Multi-Step Registration",
    description: "Multi-step registration form using Preline data-hs-stepper",
    category: "forms",
    tags: ["form", "stepper"],
    priority: 3,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Create Account</h2>
    <div data-hs-stepper>
      <ul class="relative flex flex-row gap-x-2 mb-8">
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 1}'>
          <span class="min-w-7 min-h-7 inline-flex items-center gap-x-2 text-xs">
            <span class="size-7 flex justify-center items-center rounded-full bg-gray-100 font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-completed:bg-blue-600 hs-stepper-completed:text-white">
              <span class="hs-stepper-active:hidden hs-stepper-completed:hidden">1</span>
              <svg class="hidden shrink-0 size-3 hs-stepper-completed:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Account</span>
          </span>
          <div class="w-full h-px flex-1 bg-gray-200 dark:bg-gray-700 hs-stepper-completed:bg-blue-600 group-last:hidden"></div>
        </li>
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 2}'>
          <span class="min-w-7 min-h-7 inline-flex items-center gap-x-2 text-xs">
            <span class="size-7 flex justify-center items-center rounded-full bg-gray-100 font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-completed:bg-blue-600 hs-stepper-completed:text-white">
              <span class="hs-stepper-active:hidden hs-stepper-completed:hidden">2</span>
              <svg class="hidden shrink-0 size-3 hs-stepper-completed:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Profile</span>
          </span>
          <div class="w-full h-px flex-1 bg-gray-200 dark:bg-gray-700 hs-stepper-completed:bg-blue-600 group-last:hidden"></div>
        </li>
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group" data-hs-stepper-nav-item='{"index": 3}'>
          <span class="min-w-7 min-h-7 inline-flex items-center gap-x-2 text-xs">
            <span class="size-7 flex justify-center items-center rounded-full bg-gray-100 font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white">3</span>
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200">Done</span>
          </span>
        </li>
      </ul>
      <div>
        <div data-hs-stepper-content-item='{"index": 1}'>
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
        <div data-hs-stepper-content-item='{"index": 2}' class="hidden">
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input type="text" placeholder="Jane Doe" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company (optional)</label>
              <input type="text" placeholder="Acme Inc." class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
        </div>
        <div data-hs-stepper-content-item='{"index": 3}' class="hidden">
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center dark:bg-gray-800 dark:border-gray-700">
            <div class="text-5xl mb-4">🎉</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Welcome aboard. Check your email for a confirmation link.</p>
          </div>
        </div>
        <div class="mt-5 flex justify-between">
          <button type="button" class="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none transition-colors" data-hs-stepper-back-btn>Back</button>
          <button type="button" class="py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" data-hs-stepper-next-btn>
            <span class="[.hs-stepper-last-step-active_&]:hidden">Next</span>
            <span class="hidden [.hs-stepper-last-step-active_&]:inline-flex">Finish</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "forms-login",
    name: "Login Form",
    description: "Clean login form with email and password",
    category: "forms",
    tags: ["form", "auth"],
    priority: 3,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <form class="space-y-4" onsubmit="return false">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
          <input type="email" placeholder="you@example.com" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <input type="password" placeholder="••••••••" class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded">
            <span class="text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
        </div>
        <button type="submit" class="w-full py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Sign in</button>
      </form>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Don't have an account? <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign up</a></p>
    </div>
  </div>
</section>`,
  },
  {
    id: "forms-feedback",
    name: "Feedback Rating Form",
    description: "Feedback form with 5-star rating using vanilla JS",
    category: "forms",
    tags: ["form", "rating"],
    priority: 3,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Share Your Feedback</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">How was your experience with us?</p>
      <div class="mb-6">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Overall rating</p>
        <div class="flex gap-2" id="star-rating">
          <button type="button" class="text-3xl text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors star-btn" data-val="1">★</button>
          <button type="button" class="text-3xl text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors star-btn" data-val="2">★</button>
          <button type="button" class="text-3xl text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors star-btn" data-val="3">★</button>
          <button type="button" class="text-3xl text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors star-btn" data-val="4">★</button>
          <button type="button" class="text-3xl text-gray-300 dark:text-gray-600 hover:text-amber-400 transition-colors star-btn" data-val="5">★</button>
        </div>
        <p id="rating-label" class="text-sm text-gray-400 dark:text-gray-500 mt-2">Click to rate</p>
      </div>
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comments</label>
        <textarea rows="4" placeholder="Tell us what you think..." class="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
      </div>
      <button type="button" class="w-full py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Submit Feedback</button>
    </div>
  </div>
  <script>
    (function() {
      const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      let selected = 0;
      const stars = document.querySelectorAll('.star-btn');
      const label = document.getElementById('rating-label');
      stars.forEach(function(s) {
        s.addEventListener('mouseenter', function() {
          const v = parseInt(s.dataset.val, 10);
          stars.forEach(function(b, i) {
            b.style.color = i < v ? '#f59e0b' : '';
          });
        });
        s.addEventListener('mouseleave', function() {
          stars.forEach(function(b, i) {
            b.style.color = i < selected ? '#f59e0b' : '';
          });
        });
        s.addEventListener('click', function() {
          selected = parseInt(s.dataset.val, 10);
          label.textContent = labels[selected - 1];
          stars.forEach(function(b, i) {
            b.style.color = i < selected ? '#f59e0b' : '';
          });
        });
      });
    })();
  </script>
</section>`,
  },
  {
    id: "forms-subscribe-inline",
    name: "Inline Subscribe Form",
    description: "Compact inline email subscribe form with validation hint",
    category: "forms",
    tags: ["newsletter", "form"],
    priority: 2,
    domain_hints: ["blog", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6 bg-blue-600 dark:bg-blue-700">
  <div class="max-w-3xl mx-auto">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h3 class="text-xl font-bold text-white mb-1">Get weekly updates</h3>
        <p class="text-white/70 text-sm">Join 5,000+ readers. No spam, ever.</p>
      </div>
      <form class="flex gap-2 w-full md:w-auto" onsubmit="return false">
        <input type="email" placeholder="your@email.com" class="flex-1 md:w-64 px-4 py-2.5 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-white/50" required>
        <button type="submit" class="py-2.5 px-5 text-sm font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors shrink-0">Subscribe</button>
      </form>
    </div>
  </div>
</section>`,
  },
  {
    id: "forms-file-upload",
    name: "File Upload Zone",
    description: "Drag-and-drop styled file upload zone",
    category: "forms",
    tags: ["form", "upload"],
    priority: 4,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Files</h2>
    <div id="drop-zone" class="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 dark:hover:border-blue-500 dark:hover:bg-blue-900/10 transition-colors">
      <div class="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
      </div>
      <p class="text-gray-700 dark:text-gray-300 font-medium mb-1">Drop files here or <span class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" id="browse-link">browse</span></p>
      <p class="text-sm text-gray-400 dark:text-gray-500">PNG, JPG, PDF up to 10MB</p>
      <input type="file" class="hidden" id="file-input" multiple accept=".png,.jpg,.jpeg,.pdf">
    </div>
    <div id="file-list" class="mt-4 space-y-2"></div>
  </div>
  <script>
    (function() {
      const zone = document.getElementById('drop-zone');
      const input = document.getElementById('file-input');
      const list = document.getElementById('file-list');
      document.getElementById('browse-link').addEventListener('click', function() { input.click(); });
      ['dragover', 'dragenter'].forEach(function(ev) {
        zone.addEventListener(ev, function(e) { e.preventDefault(); zone.classList.add('border-blue-500', 'bg-blue-50/40'); });
      });
      ['dragleave', 'drop'].forEach(function(ev) {
        zone.addEventListener(ev, function(e) { e.preventDefault(); zone.classList.remove('border-blue-500', 'bg-blue-50/40'); });
      });
      zone.addEventListener('drop', function(e) { handleFiles(e.dataTransfer.files); });
      input.addEventListener('change', function() { handleFiles(input.files); });
      function handleFiles(files) {
        Array.from(files).forEach(function(f) {
          const el = document.createElement('div');
          el.className = 'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm';
          el.innerHTML = '<span class="text-blue-600 dark:text-blue-400">📄</span><span class="flex-1 text-gray-700 dark:text-gray-300 truncate">' + f.name + '</span><span class="text-gray-400 dark:text-gray-500">' + (f.size / 1024).toFixed(1) + ' KB</span>';
          list.appendChild(el);
        });
      }
    })();
  </script>
</section>`,
  },
  {
    id: "forms-search",
    name: "Search Form",
    description: "Search form with icon and filter dropdown",
    category: "forms",
    tags: ["search", "form"],
    priority: 3,
    domain_hints: ["blog", "ecommerce", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search</h2>
    <div class="relative flex gap-2">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
        </div>
        <input type="text" placeholder="Search articles, products..." class="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="hs-dropdown relative inline-flex">
        <button type="button" class="hs-dropdown-toggle py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors" id="search-filter-btn">
          Filter
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="hs-dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10" aria-labelledby="search-filter-btn">
          <div class="p-1">
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">All Categories</a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Technology</a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Design</a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">Business</a>
          </div>
        </div>
      </div>
      <button type="button" class="py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Search</button>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <span class="text-xs text-gray-500 dark:text-gray-400">Popular:</span>
      <button type="button" class="text-xs py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">React</button>
      <button type="button" class="text-xs py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">TypeScript</button>
      <button type="button" class="text-xs py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Tailwind CSS</button>
    </div>
  </div>
</section>`,
  },
];
