import type { ComponentSnippet } from "../types";

export const notificationsSnippets: ComponentSnippet[] = [
  {
    id: "notifications-toast",
    name: "Toast Notification",
    description: "Top-right corner toast notification with Preline data-hs-remove-element dismiss",
    category: "notifications",
    tags: ["notifications", "alerts"],
    priority: 2,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<div class="relative min-h-32 bg-white dark:bg-gray-900 p-6 font-sans">
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm" id="toast-container">
    <div id="toast-success" class="flex items-center p-4 rounded-xl bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 gap-3">
      <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">Saved successfully</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your changes have been saved.</p>
      </div>
      <button type="button" class="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-hs-remove-element="#toast-success">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div id="toast-error" class="flex items-center p-4 rounded-xl bg-white border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 gap-3">
      <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">Upload failed</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">File size exceeds the 10MB limit.</p>
      </div>
      <button type="button" class="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-hs-remove-element="#toast-error">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
</div>`,
  },
  {
    id: "notifications-alert-strip",
    name: "Dismissible Alert Strip",
    description: "Full-width dismissible alert strip in color variants",
    category: "notifications",
    tags: ["alerts", "notifications"],
    priority: 2,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<div class="space-y-2 font-sans">
  <div id="strip-info" class="flex items-center justify-between py-3 px-4 bg-blue-50 border-b border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
    <div class="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
      <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
      <span><strong>System maintenance</strong> scheduled for Sunday 2AM - 4AM UTC. Expect brief downtime.</span>
    </div>
    <button type="button" class="ml-4 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0" data-hs-remove-element="#strip-info">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  <div id="strip-warning" class="flex items-center justify-between py-3 px-4 bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
    <div class="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
      <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      <span>Your free trial expires in <strong>3 days</strong>. <a href="#" class="underline font-medium">Upgrade now</a> to keep access.</span>
    </div>
    <button type="button" class="ml-4 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0" data-hs-remove-element="#strip-warning">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
</div>`,
  },
  {
    id: "notifications-dropdown",
    name: "Notification Dropdown",
    description: "Notification bell with dropdown list using Preline hs-dropdown",
    category: "notifications",
    tags: ["notifications", "dropdown"],
    priority: 3,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-lg mx-auto flex justify-end">
    <div class="hs-dropdown relative inline-flex">
      <button type="button" class="hs-dropdown-toggle relative py-2.5 px-3 inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" id="notif-dropdown-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
      </button>
      <div class="hs-dropdown-menu hidden absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10" aria-labelledby="notif-dropdown-btn">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span class="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
          <button type="button" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700">
          <div class="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-sm shrink-0">💬</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">New comment on your post</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">Sarah replied: "Great article! Really helpful..."</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">2 min ago</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-sm shrink-0">✅</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">Task completed</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Deploy to production finished successfully.</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-sm shrink-0">⚠️</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">Storage almost full</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You've used 90% of your storage quota.</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <a href="#" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all notifications</a>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "notifications-cookie-consent",
    name: "Cookie Consent Banner",
    description: "Cookie consent banner fixed at the bottom of the page",
    category: "notifications",
    tags: ["cookie", "banner"],
    priority: 3,
    domain_hints: ["landing", "blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<div id="cookie-banner" class="fixed bottom-0 inset-x-0 z-50 py-4 px-6 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 font-sans">
  <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex items-start gap-3">
      <span class="text-2xl shrink-0">🍪</span>
      <div>
        <p class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">We use cookies</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">We use cookies to improve your experience. By continuing, you agree to our <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Cookie Policy</a>.</p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button type="button" class="py-2 px-4 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-hs-remove-element="#cookie-banner">Decline</button>
      <button type="button" class="py-2 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" data-hs-remove-element="#cookie-banner">Accept All</button>
    </div>
  </div>
</div>
<section class="py-24 px-6 bg-white dark:bg-gray-900 pb-24 font-sans">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Cookie Consent Banner</h2>
    <p class="text-gray-500 dark:text-gray-400">The cookie consent banner appears fixed at the bottom of the page.</p>
  </div>
</section>`,
  },
  {
    id: "notifications-announcement",
    name: "Announcement Bar",
    description: "Dismissible announcement bar at the top of the page",
    category: "notifications",
    tags: ["banner", "notifications"],
    priority: 2,
    domain_hints: ["landing", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<div id="announcement-bar" class="flex items-center justify-between py-2 px-4 bg-blue-600 dark:bg-blue-700 font-sans">
  <div class="flex-1 text-center">
    <p class="text-sm text-white font-medium">🎉 New feature: AI-powered templates are now available! <a href="#" class="underline hover:no-underline font-bold">Learn more</a></p>
  </div>
  <button type="button" class="ml-4 text-white/70 hover:text-white transition-colors shrink-0" data-hs-remove-element="#announcement-bar" aria-label="Dismiss">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
  </button>
</div>
<section class="py-16 px-6 bg-white dark:bg-gray-900 font-sans">
  <div class="max-w-2xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Announcement Bar</h2>
    <p class="text-gray-500 dark:text-gray-400">The announcement bar sits at the top of the page and can be dismissed.</p>
  </div>
</section>`,
  },
  {
    id: "notifications-feed",
    name: "Notification Feed",
    description: "In-app notification feed list with read/unread states",
    category: "notifications",
    tags: ["notifications", "feed"],
    priority: 3,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
      <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">4 new</span>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
      <div class="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-sm shrink-0">👤</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 dark:text-white"><strong>Alex Kim</strong> mentioned you in a comment.</p>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">5 minutes ago</p>
        </div>
        <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0"></div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-sm shrink-0">🚀</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 dark:text-white">Your project <strong>Dashboard v2</strong> was successfully deployed.</p>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">30 minutes ago</p>
        </div>
        <div class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0"></div>
      </div>
      <div class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-sm shrink-0">💬</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 dark:text-gray-300">New reply in <strong>General</strong> channel.</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-sm shrink-0">📊</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 dark:text-gray-300">Weekly analytics report is ready.</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "notifications-empty-state",
    name: "Empty State",
    description: "Empty state placeholder with icon, message, and CTA button",
    category: "notifications",
    tags: ["empty-state"],
    priority: 3,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-sm mx-auto text-center">
    <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-9 h-9 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
    </div>
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No notifications yet</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">When you get notifications, they'll show up here. Stay tuned!</p>
    <a href="#" class="py-2.5 px-6 inline-flex items-center justify-center text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">Explore Features</a>
  </div>
</section>`,
  },
];
