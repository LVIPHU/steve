import type { ComponentSnippet } from "../types";

export const mediaSnippets: ComponentSnippet[] = [
  {
    id: "media-image-grid",
    name: "Image Grid",
    description: "Responsive image grid — 3 cols on lg, 2 on md, 1 on sm",
    category: "media",
    tags: ["gallery", "images"],
    priority: 1,
    domain_hints: ["portfolio", "blog"],
    min_score: 0,
    fallback: true,
    fallback_for: ["portfolio"],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">Gallery</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="aspect-square bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">🖼️</div>
      <div class="aspect-square bg-gradient-to-br from-violet-100 to-pink-200 dark:from-violet-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">🎨</div>
      <div class="aspect-square bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">📸</div>
      <div class="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">🌅</div>
      <div class="aspect-square bg-gradient-to-br from-rose-100 to-red-200 dark:from-rose-900/30 dark:to-red-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">🌸</div>
      <div class="aspect-square bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center text-5xl hover:scale-105 transition-transform cursor-pointer">🏞️</div>
    </div>
  </div>
</section>`,
  },
  {
    id: "media-image-caption",
    name: "Image with Caption",
    description: "Image cards with caption and metadata",
    category: "media",
    tags: ["gallery", "images"],
    priority: 2,
    domain_hints: ["portfolio", "blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">Featured Work</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <figure class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-5xl">🏙️</div>
        <figcaption class="p-4">
          <p class="font-semibold text-gray-900 dark:text-white">City Architecture Series</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Urban photography exploring geometric patterns in modern buildings.</p>
          <div class="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span>📅 March 2024</span>
            <span>·</span>
            <span>📍 New York</span>
          </div>
        </figcaption>
      </figure>
      <figure class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="aspect-video bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900/30 dark:to-emerald-900/30 flex items-center justify-center text-5xl">🌲</div>
        <figcaption class="p-4">
          <p class="font-semibold text-gray-900 dark:text-white">Nature & Landscape</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Capturing the serenity of untouched natural landscapes at golden hour.</p>
          <div class="flex items-center gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <span>📅 January 2024</span>
            <span>·</span>
            <span>📍 Pacific Northwest</span>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</section>`,
  },
  {
    id: "media-before-after",
    name: "Before/After Image Slider",
    description: "Before/After comparison slider using a range input with vanilla JS",
    category: "media",
    tags: ["gallery", "comparison"],
    priority: 3,
    domain_hints: ["portfolio", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Before &amp; After</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Drag the slider to compare results.</p>
    <div class="relative rounded-xl overflow-hidden select-none" id="ba-container" style="height:280px">
      <div class="absolute inset-0 flex items-center justify-center text-7xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" id="ba-before">🌑</div>
      <div class="absolute inset-0 flex items-center justify-center text-7xl bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 overflow-hidden" id="ba-after" style="clip-path: inset(0 50% 0 0)">🌕</div>
      <div class="absolute inset-y-0 flex items-center justify-center z-10" id="ba-divider" style="left:50%; transform:translateX(-50%)">
        <div class="w-0.5 h-full bg-white/80 dark:bg-white/60"></div>
        <div class="absolute w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700" style="top:50%;transform:translateY(-50%)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>
        </div>
      </div>
      <input type="range" min="0" max="100" value="50" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" id="ba-slider">
    </div>
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2"><span>Before</span><span>After</span></div>
  </div>
  <script>
    (function() {
      const slider = document.getElementById('ba-slider');
      const after = document.getElementById('ba-after');
      const divider = document.getElementById('ba-divider');
      if (!slider) return;
      slider.addEventListener('input', function() {
        const pct = slider.value;
        after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        divider.style.left = pct + '%';
      });
    })();
  </script>
</section>`,
  },
  {
    id: "media-video-embed",
    name: "Video Embed Placeholder",
    description: "16:9 video embed placeholder with play button overlay",
    category: "media",
    tags: ["video", "media"],
    priority: 2,
    domain_hints: ["landing", "blog"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">See It in Action</h2>
    <div class="relative aspect-video bg-gray-800 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer group" id="video-placeholder">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex flex-col items-center justify-center">
        <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
          <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <p class="text-white font-semibold text-lg">Watch Demo — 2 min</p>
        <p class="text-white/60 text-sm mt-1">See how teams use our platform</p>
      </div>
    </div>
    <p class="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">Click to watch the demo</p>
  </div>
</section>`,
  },
  {
    id: "media-gallery-lightbox",
    name: "Gallery with Lightbox",
    description: "Gallery grid with Preline data-hs-overlay modal lightbox",
    category: "media",
    tags: ["gallery", "images"],
    priority: 2,
    domain_hints: ["portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">Photo Gallery</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#lightbox-modal">
        <div class="flex items-center justify-center h-full text-3xl">🖼️</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-violet-100 to-pink-200 dark:from-violet-900/30 dark:to-pink-900/30 rounded-lg overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#lightbox-modal">
        <div class="flex items-center justify-center h-full text-3xl">🌸</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-lg overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#lightbox-modal">
        <div class="flex items-center justify-center h-full text-3xl">🏔️</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
      <button type="button" class="group relative aspect-square bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg overflow-hidden hover:opacity-90 transition-opacity" data-hs-overlay="#lightbox-modal">
        <div class="flex items-center justify-center h-full text-3xl">🌅</div>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      </button>
    </div>
  </div>
  <div id="lightbox-modal" class="hs-overlay hidden fixed inset-0 z-50 overflow-x-hidden overflow-y-auto flex items-center justify-center">
    <div class="hs-overlay-backdrop fixed inset-0 bg-black/80" data-hs-overlay-backdrop></div>
    <div class="relative max-w-3xl w-full mx-4">
      <button type="button" class="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors" data-hs-overlay="#lightbox-modal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <div class="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center text-8xl">🖼️</div>
      <p class="text-white/70 text-sm text-center mt-3">City Architecture Series · New York, 2024</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "media-audio-player",
    name: "Styled Audio Player",
    description: "Styled HTML5 audio player with custom controls appearance",
    category: "media",
    tags: ["audio", "media"],
    priority: 4,
    domain_hints: ["blog", "portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Listen Now</h2>
    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div class="flex items-center gap-4 mb-5">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎙️</div>
        <div>
          <div class="font-semibold text-gray-900 dark:text-white">Episode 42: The Future of AI</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">The Deep Dive Podcast · 38 min</div>
        </div>
      </div>
      <audio controls class="w-full rounded-lg" style="height:40px">
        <source src="#" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <div class="flex items-center justify-between mt-4 text-sm">
        <button type="button" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          Share
        </button>
        <a href="#" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download
        </a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "media-map-placeholder",
    name: "Map Placeholder with CTA",
    description: "Map placeholder section with address and CTA overlay",
    category: "media",
    tags: ["map", "contact-form"],
    priority: 3,
    domain_hints: ["landing", "business"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-0 bg-white dark:bg-gray-900">
  <div class="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center opacity-20">
      <svg class="w-full h-full" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" stroke-width="0.5"/>
        <line x1="0" y1="40" x2="200" y2="40" stroke="currentColor" stroke-width="0.5"/>
        <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" stroke-width="0.5"/>
        <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" stroke-width="0.5"/>
        <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" stroke-width="0.5"/>
        <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" stroke-width="0.5"/>
        <line x1="120" y1="0" x2="120" y2="100" stroke="currentColor" stroke-width="0.5"/>
        <line x1="160" y1="0" x2="160" y2="100" stroke="currentColor" stroke-width="0.5"/>
      </svg>
    </div>
    <div class="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 text-center">
      <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
      </div>
      <h3 class="font-bold text-gray-900 dark:text-white mb-1">Visit Our Office</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">123 Innovation Drive, San Francisco, CA 94105</p>
      <a href="#" class="py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full">Get Directions</a>
    </div>
  </div>
</section>`,
  },
  {
    id: "media-logo-cloud",
    name: "Logo Cloud",
    description: "Partner/customer logo grid with grayscale treatment",
    category: "media",
    tags: ["logos", "social-proof"],
    priority: 2,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-16 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <p class="text-center text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-8">Trusted by teams at</p>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Stripe</span>
      </div>
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Notion</span>
      </div>
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Linear</span>
      </div>
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Vercel</span>
      </div>
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Figma</span>
      </div>
      <div class="flex items-center justify-center h-10 opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60 transition-opacity grayscale">
        <span class="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-tight">Loom</span>
      </div>
    </div>
  </div>
</section>`,
  },
];
