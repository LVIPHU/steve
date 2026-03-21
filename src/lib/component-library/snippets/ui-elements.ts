import type { ComponentSnippet } from "../types";

export const uiElementsSnippets: ComponentSnippet[] = [
  {
    id: "ui-elements-alerts",
    name: "Alert Banners",
    description: "Alert banners in success/warning/error/info variants with Preline dismiss",
    category: "ui-elements",
    tags: ["alerts", "notifications"],
    priority: 2,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-2xl mx-auto space-y-4">
    <div class="flex items-center p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-800/20 dark:border-teal-700" role="alert">
      <svg class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 me-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      <span class="text-sm text-teal-800 dark:text-teal-300 flex-1 font-medium">Your account has been saved successfully.</span>
      <button type="button" class="ms-auto text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-200 transition-colors" data-hs-remove-element="#alert-success">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div id="alert-success" class="flex items-center p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-800/20 dark:border-blue-700" role="alert">
      <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 me-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
      <span class="text-sm text-blue-800 dark:text-blue-300 flex-1 font-medium">A new software update is available. See what's new.</span>
      <button type="button" class="ms-auto text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors" data-hs-remove-element="#alert-success">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="flex items-center p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-800/20 dark:border-amber-700" role="alert">
      <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 me-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      <span class="text-sm text-amber-800 dark:text-amber-300 flex-1 font-medium">Warning: Your subscription expires in 3 days.</span>
      <button type="button" class="ms-auto text-amber-500 hover:text-amber-700 dark:text-amber-400 transition-colors" data-hs-remove-element="#alert-warning">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="flex items-center p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-800/20 dark:border-red-700" role="alert">
      <svg class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 me-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
      <span class="text-sm text-red-800 dark:text-red-300 flex-1 font-medium">Error: Payment failed. Please update your billing details.</span>
      <button type="button" class="ms-auto text-red-500 hover:text-red-700 dark:text-red-400 transition-colors" data-hs-remove-element="#alert-error">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
</section>`,
  },
  {
    id: "ui-elements-badges",
    name: "Badge Collection",
    description: "Badge collection with color variants and sizes",
    category: "ui-elements",
    tags: ["badges"],
    priority: 3,
    domain_hints: ["saas", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Badges</h2>
    <div class="space-y-6">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Filled</p>
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400">Primary</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400">Success</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">Warning</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">Danger</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Neutral</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400">Purple</span>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Outlined</p>
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400">Primary</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium border border-teal-300 text-teal-700 dark:border-teal-600 dark:text-teal-400">Success</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium border border-amber-300 text-amber-700 dark:border-amber-600 dark:text-amber-400">Warning</span>
          <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400">Danger</span>
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">With dot indicator</p>
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-400"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Active</span>
          <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"><span class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></span>Inactive</span>
          <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pending</span>
        </div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "ui-elements-breadcrumb",
    name: "Breadcrumb Navigation",
    description: "Breadcrumb navigation with separator icons",
    category: "ui-elements",
    tags: ["navigation", "breadcrumb"],
    priority: 3,
    domain_hints: ["blog", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-8 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <nav class="flex items-center gap-1 text-sm mb-6" aria-label="Breadcrumb">
      <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
      <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Products</a>
      <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Electronics</a>
      <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      <span class="text-gray-900 dark:text-white font-medium" aria-current="page">Pro Headphones X200</span>
    </nav>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pro Headphones X200</h1>
    <p class="text-gray-500 dark:text-gray-400">Premium audio with active noise cancellation.</p>
  </div>
</section>`,
  },
  {
    id: "ui-elements-pagination",
    name: "Pagination",
    description: "Pagination bar with prev/next buttons and page numbers",
    category: "ui-elements",
    tags: ["pagination", "navigation"],
    priority: 3,
    domain_hints: ["blog", "ecommerce"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <nav class="flex items-center justify-center gap-1" aria-label="Pagination">
      <button type="button" class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none transition-colors" disabled>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Prev
      </button>
      <button type="button" class="py-2 px-3.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">1</button>
      <button type="button" class="py-2 px-3.5 text-sm font-medium rounded-lg bg-blue-600 text-white">2</button>
      <button type="button" class="py-2 px-3.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">3</button>
      <span class="py-2 px-2 text-sm text-gray-400 dark:text-gray-500">...</span>
      <button type="button" class="py-2 px-3.5 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">10</button>
      <button type="button" class="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </nav>
  </div>
</section>`,
  },
  {
    id: "ui-elements-progress",
    name: "Progress Indicators",
    description: "Linear progress bars with labels and colors",
    category: "ui-elements",
    tags: ["progress"],
    priority: 3,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Progress</h2>
    <div class="space-y-5">
      <div>
        <div class="flex justify-between mb-1.5"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Profile completion</span><span class="text-sm font-semibold text-blue-600 dark:text-blue-400">75%</span></div>
        <div class="flex w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-blue-600 rounded-full transition-all duration-500" style="width:75%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1.5"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Storage used</span><span class="text-sm font-semibold text-teal-600 dark:text-teal-400">42%</span></div>
        <div class="flex w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-teal-500 rounded-full" style="width:42%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1.5"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">CPU load</span><span class="text-sm font-semibold text-amber-600 dark:text-amber-400">88%</span></div>
        <div class="flex w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-amber-500 rounded-full" style="width:88%"></div></div>
      </div>
      <div>
        <div class="flex justify-between mb-1.5"><span class="text-sm font-medium text-gray-700 dark:text-gray-300">Memory</span><span class="text-sm font-semibold text-red-600 dark:text-red-400">95%</span></div>
        <div class="flex w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"><div class="h-full bg-red-500 rounded-full" style="width:95%"></div></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "ui-elements-spinners",
    name: "Spinners and Loading",
    description: "CSS spinner and skeleton loading states",
    category: "ui-elements",
    tags: ["loading"],
    priority: 4,
    domain_hints: ["saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-8">Loading States</h2>
    <div class="flex flex-wrap gap-8 items-center mb-10">
      <div class="flex items-center gap-3">
        <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full dark:border-blue-400"></div>
        <span class="text-sm text-gray-600 dark:text-gray-300">Loading...</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="animate-spin w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full dark:border-indigo-400" style="border-width:3px"></div>
        <span class="text-sm text-gray-600 dark:text-gray-300">Processing</span>
      </div>
      <button type="button" class="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white opacity-70 cursor-not-allowed" disabled>
        <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
        Submitting...
      </button>
    </div>
    <div class="space-y-3">
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Skeleton loading</p>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-3/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-5/6"></div>
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-4/6"></div>
    </div>
  </div>
</section>`,
  },
  {
    id: "ui-elements-toggles",
    name: "Toggle Switches",
    description: "Toggle switch collection with vanilla JS state tracking",
    category: "ui-elements",
    tags: ["toggle", "form"],
    priority: 4,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
    <div class="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
      <div class="flex items-center justify-between p-4">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Email notifications</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer toggle-switch" checked>
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>
      <div class="flex items-center justify-between p-4">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Push notifications</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Get notified in the browser</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer toggle-switch">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>
      <div class="flex items-center justify-between p-4">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Marketing emails</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Promotions and product news</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer toggle-switch" checked>
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "ui-elements-tooltips",
    name: "Tooltip Examples",
    description: "Tooltip examples on various UI elements",
    category: "ui-elements",
    tags: ["tooltip"],
    priority: 4,
    domain_hints: ["saas", "dashboard"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-8">Tooltips</h2>
    <div class="flex flex-wrap items-center gap-6">
      <div class="hs-tooltip inline-block">
        <button type="button" class="hs-tooltip-toggle py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Hover me
          <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity absolute z-10 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg shadow-sm dark:bg-gray-700" role="tooltip">
            This is a helpful tooltip
          </span>
        </button>
      </div>
      <div class="hs-tooltip inline-block">
        <button type="button" class="hs-tooltip-toggle w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Info">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
          <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity absolute z-10 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg shadow-sm dark:bg-gray-700" role="tooltip">
            Additional information here
          </span>
        </button>
      </div>
      <div class="hs-tooltip inline-block">
        <a href="#" class="hs-tooltip-toggle text-blue-600 dark:text-blue-400 text-sm underline hover:no-underline">
          What is this?
          <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition-opacity absolute z-10 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg shadow-sm dark:bg-gray-700 max-w-xs" role="tooltip">
            Click to learn more about how this feature works.
          </span>
        </a>
      </div>
    </div>
  </div>
</section>`,
  },
];
