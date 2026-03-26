import type { ComponentSnippet } from "../types";

export const educationSnippets: ComponentSnippet[] = [
  {
    id: "leaderboard-table",
    name: "Leaderboard Table",
    description: "Ranking table with scores, avatars, and medal indicators. Reads from localStorage.",
    category: "education",
    tags: ["leaderboard", "scores", "data-table", "localStorage", "dashboard"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Top performers this week</p>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Score</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Quizzes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700" id="leaderboard-body">
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
            <td class="px-6 py-4"><span class="text-2xl">🥇</span></td>
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">You</td>
            <td class="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">950</td>
            <td class="px-6 py-4 text-right text-gray-500 dark:text-gray-400">12</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  },
  {
    id: "vocabulary-list",
    name: "Vocabulary Word List",
    description: "Searchable vocabulary list with word, meaning, example, and learned status. Supports filtering.",
    category: "education",
    tags: ["vocabulary", "word-list", "data-table", "localStorage", "search"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6">
  <div class="max-w-4xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">My Vocabulary</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1"><span id="vocab-count">0</span> words saved</p>
      </div>
      <div class="relative">
        <input type="text" id="vocab-search" placeholder="Search words..."
          class="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64">
        <svg class="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
    </div>
    <div class="space-y-3" id="vocab-list">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">abundance</h3>
            <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">learned</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mt-1">a very large quantity of something</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 italic">"an abundance of natural resources"</p>
        </div>
        <button class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "add-vocabulary-form",
    name: "Add Vocabulary Form",
    description: "Form to add new vocabulary words with word, meaning, example sentence fields. Saves to localStorage.",
    category: "education",
    tags: ["vocabulary", "form", "add-data", "localStorage"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Word</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-8">Expand your vocabulary collection</p>
    <form id="add-vocab-form" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Word *</label>
        <input type="text" id="word-input" required placeholder="e.g. abundance"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meaning *</label>
        <textarea id="meaning-input" required rows="2" placeholder="e.g. a very large quantity of something"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Example Sentence</label>
        <input type="text" id="example-input" placeholder="e.g. There was an abundance of food at the party"
          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="flex gap-3">
        <button type="submit" class="flex-1 py-2.5 px-5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          Add Word
        </button>
        <button type="reset" class="py-2.5 px-5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Clear
        </button>
      </div>
    </form>
  </div>
</section>`,
  },
  {
    id: "score-summary-card",
    name: "Score Summary Card",
    description: "Personal score summary with total score, accuracy percentage, quiz count, and streak.",
    category: "education",
    tags: ["scores", "summary", "stats", "localStorage", "dashboard"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Progress</h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400" id="total-score">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Score</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <div class="text-3xl font-bold text-green-600 dark:text-green-400" id="accuracy">0%</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400" id="quiz-count">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Quizzes Taken</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <div class="text-3xl font-bold text-orange-600 dark:text-orange-400" id="streak">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Day Streak 🔥</div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "score-history-chart",
    name: "Score History Chart",
    description: "Line chart showing quiz score history over time using Chart.js. Reads from localStorage.",
    category: "education",
    tags: ["scores", "chart", "history", "localStorage", "dashboard"],
    priority: 2,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-12 px-6">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Score History</h2>
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <canvas id="score-chart" height="200"></canvas>
    </div>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const scores = JSON.parse(localStorage.getItem('appgen-quiz-scores') || '[]');
        const labels = scores.map((s, i) => 'Quiz ' + (i + 1));
        const data = scores.map(s => s.score || s.percentage || 0);
        if (typeof Chart !== 'undefined') {
          new Chart(document.getElementById('score-chart'), {
            type: 'line',
            data: { labels, datasets: [{ label: 'Score %', data, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
          });
        }
      });
    </script>
  </div>
</section>`,
  },
  {
    id: "about-team-section",
    name: "About Team Section",
    description: "Team/about section with mission statement and team member cards.",
    category: "education",
    tags: ["about", "team", "generic"],
    priority: 2,
    domain_hints: ["landing", "generic"],
    min_score: 0,
    fallback: true,
    fallback_for: ["generic"],
    html: `<section class="py-20 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">About Us</h2>
    <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
      We're passionate about making learning accessible, fun, and effective for everyone.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      <div class="text-center">
        <div class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4 flex items-center justify-center text-3xl">🎯</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Our Mission</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Make quality education available to everyone, everywhere.</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center text-3xl">💡</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Our Approach</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Interactive learning with instant feedback and progress tracking.</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-4 flex items-center justify-center text-3xl">🚀</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Our Vision</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2">A world where learning is personalized and engaging for every student.</p>
      </div>
    </div>
  </div>
</section>`,
  },
];
