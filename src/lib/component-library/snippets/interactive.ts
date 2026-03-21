import type { ComponentSnippet } from "../types";

export const interactiveSnippets: ComponentSnippet[] = [
  {
    id: "quiz-multiple-choice",
    name: "Quiz Multiple Choice",
    description: "Multiple choice quiz with immediate feedback and final score, localStorage persistence",
    category: "interactive",
    tags: ["quiz", "localStorage"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
  <div class="max-w-xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700" id="quiz-app">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Knowledge Quiz</h2>
        <div id="quiz-progress-bar" class="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
          <div id="quiz-progress-fill" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div id="quiz-container"></div>
        <div id="quiz-result" class="hidden text-center py-8">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white" id="quiz-score-text"></h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6" id="quiz-score-detail"></p>
          <button class="py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors" id="quiz-restart">Try Again</button>
        </div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const STORAGE_KEY = 'appgen-quiz-progress';
      const questions = [
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: 1 },
        { question: "Which planet is closest to the sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: 2 },
        { question: "What color do you get mixing blue and yellow?", options: ["Purple", "Orange", "Green", "Brown"], answer: 2 },
        { question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1 },
        { question: "What is the capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], answer: 3 }
      ];

      let current = 0;
      let score = 0;
      let answered = false;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const s = JSON.parse(saved);
          current = s.current || 0;
          score = s.score || 0;
        } catch(e) { /* ignore */ }
      }

      function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ current, score }));
      }

      function updateProgress() {
        const pct = (current / questions.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = pct + '%';
      }

      function renderQuestion() {
        if (current >= questions.length) {
          showResult();
          return;
        }
        answered = false;
        updateProgress();
        const q = questions[current];
        const container = document.getElementById('quiz-container');
        container.innerHTML = '<p class="text-sm text-gray-400 dark:text-gray-500 mb-3">Question ' + (current + 1) + ' of ' + questions.length + '</p>' +
          '<p class="text-lg font-semibold mb-6 text-gray-900 dark:text-white">' + q.question + '</p>' +
          '<div class="space-y-3" id="options-list">' +
          q.options.map((opt, i) =>
            '<button class="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors option-btn" data-idx="' + i + '">' + opt + '</button>'
          ).join('') +
          '</div>';
        container.querySelectorAll('.option-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            if (answered) return;
            answered = true;
            const chosen = parseInt(this.dataset.idx, 10);
            const correct = q.answer;
            container.querySelectorAll('.option-btn').forEach((b, i) => {
              b.disabled = true;
              if (i === correct) {
                b.classList.add('bg-teal-100', 'border-teal-300', 'text-teal-800', 'dark:bg-teal-500/20', 'dark:border-teal-900', 'dark:text-teal-300');
              } else if (i === chosen && chosen !== correct) {
                b.classList.add('bg-red-100', 'border-red-300', 'text-red-800', 'dark:bg-red-500/20', 'dark:border-red-900', 'dark:text-red-300');
              }
            });
            if (chosen === correct) score++;
            saveProgress();
            setTimeout(() => { current++; saveProgress(); renderQuestion(); }, 1200);
          });
        });
      }

      function showResult() {
        localStorage.removeItem(STORAGE_KEY);
        document.getElementById('quiz-container').classList.add('hidden');
        const resultEl = document.getElementById('quiz-result');
        resultEl.classList.remove('hidden');
        document.getElementById('quiz-score-text').textContent = score + ' / ' + questions.length + ' Correct';
        const pct = Math.round((score / questions.length) * 100);
        document.getElementById('quiz-score-detail').textContent =
          pct >= 80 ? 'Excellent work! You really know your stuff.' :
          pct >= 60 ? 'Good job! A bit more practice and you\'ll ace it.' :
          'Keep studying — you\'ll get there!';
        document.getElementById('quiz-progress-fill').style.width = '100%';
        document.getElementById('quiz-restart').addEventListener('click', function() {
          current = 0; score = 0;
          resultEl.classList.add('hidden');
          document.getElementById('quiz-container').classList.remove('hidden');
          renderQuestion();
        });
      }

      renderQuestion();
    })();
  </script>
</section>`,
  },
  {
    id: "flashcard-flip",
    name: "Flashcard Flip",
    description: "CSS 3D flip flashcards with swipe/drag navigation and localStorage progress",
    category: "interactive",
    tags: ["flip-cards", "flip-animation", "localStorage", "drag", "prev-next-nav"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
  <div class="max-w-lg mx-auto">
    <h2 class="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Flashcards</h2>
    <p class="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">Click to flip • Swipe or use arrows to navigate</p>
    <div class="flex items-center justify-center gap-4 mb-6">
      <button id="fc-prev" class="w-8 h-8 inline-flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">&#8592;</button>
      <span id="fc-counter" class="text-sm text-gray-500 dark:text-gray-400">1 / 5</span>
      <button id="fc-next" class="w-8 h-8 inline-flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">&#8594;</button>
    </div>
    <div id="fc-wrapper" style="perspective: 1000px; height: 220px;" class="cursor-pointer select-none">
      <div id="fc-card" style="width:100%; height: 220px; transform-style: preserve-3d; transition: transform 0.5s; position: relative;">
        <div class="fc-front" style="backface-visibility: hidden; position: absolute; inset: 0; border-radius: 1rem;">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl h-full flex items-center justify-center p-8">
            <div class="text-center">
              <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 mb-3">FRONT</span>
              <p id="fc-front-text" class="text-xl font-semibold text-gray-900 dark:text-white"></p>
            </div>
          </div>
        </div>
        <div class="fc-back" style="backface-visibility: hidden; transform: rotateY(180deg); position: absolute; inset: 0; border-radius: 1rem;">
          <div class="bg-blue-600 dark:bg-blue-700 shadow-lg rounded-2xl h-full flex items-center justify-center p-8">
            <div class="text-center">
              <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-white/20 text-white mb-3">BACK</span>
              <p id="fc-back-text" class="text-xl font-semibold text-white"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="fc-progress-wrap" class="mt-6">
      <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
        <span>Progress</span>
        <span id="fc-progress-text">0 seen</span>
      </div>
      <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
        <div id="fc-progress-bar" class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width:0%"></div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const STORAGE_KEY = 'appgen-flashcard-seen';
      const cards = [
        { front: "What is React?", back: "A JavaScript library for building user interfaces." },
        { front: "What is useState?", back: "A React Hook to add state to functional components." },
        { front: "What is JSX?", back: "A syntax extension that lets you write HTML-like code in JavaScript." },
        { front: "What is a prop?", back: "Data passed from a parent component to a child component." },
        { front: "What is useEffect?", back: "A React Hook for side effects like fetching data or subscriptions." }
      ];

      let current = 0;
      let flipped = false;
      const seen = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

      const cardEl = document.getElementById('fc-card');
      const frontText = document.getElementById('fc-front-text');
      const backText = document.getElementById('fc-back-text');
      const counter = document.getElementById('fc-counter');
      const progressBar = document.getElementById('fc-progress-bar');
      const progressText = document.getElementById('fc-progress-text');
      const wrapper = document.getElementById('fc-wrapper');

      function render() {
        const c = cards[current];
        frontText.textContent = c.front;
        backText.textContent = c.back;
        counter.textContent = (current + 1) + ' / ' + cards.length;
        flipped = false;
        cardEl.style.transform = 'rotateY(0deg)';
        seen.add(current);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
        progressBar.style.width = ((seen.size / cards.length) * 100) + '%';
        progressText.textContent = seen.size + ' seen';
      }

      function flip() {
        flipped = !flipped;
        cardEl.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      }

      function goNext() { current = (current + 1) % cards.length; render(); }
      function goPrev() { current = (current - 1 + cards.length) % cards.length; render(); }

      wrapper.addEventListener('click', flip);
      document.getElementById('fc-next').addEventListener('click', function(e) { e.stopPropagation(); goNext(); });
      document.getElementById('fc-prev').addEventListener('click', function(e) { e.stopPropagation(); goPrev(); });

      // Swipe / drag
      let startX = 0;
      let isDragging = false;
      function onDragStart(x) { startX = x; isDragging = true; }
      function onDragEnd(x) {
        if (!isDragging) return;
        isDragging = false;
        const diff = x - startX;
        if (Math.abs(diff) > 50) { diff < 0 ? goNext() : goPrev(); }
      }
      wrapper.addEventListener('mousedown', function(e) { onDragStart(e.clientX); });
      window.addEventListener('mouseup', function(e) { onDragEnd(e.clientX); });
      wrapper.addEventListener('touchstart', function(e) { onDragStart(e.touches[0].clientX); }, { passive: true });
      wrapper.addEventListener('touchend', function(e) { onDragEnd(e.changedTouches[0].clientX); });

      render();
    })();
  </script>
</section>`,
  },
  {
    id: "step-timer",
    name: "Step Timer",
    description: "Step-by-step list with individual countdown timers per step, Start/Pause/Reset",
    category: "interactive",
    tags: ["steps", "timer", "countdown", "recipe"],
    priority: 1,
    domain_hints: ["blog", "dashboard"],
    min_score: 1,
    fallback: true,
    fallback_for: ["blog"],
    html: `<section class="py-10 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Step-by-Step Guide</h2>
    <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">Each step has its own timer. Run them simultaneously if needed.</p>
    <div class="space-y-4" id="steps-container">
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700" data-step="0" data-duration="300">
        <div class="p-4">
          <div class="flex items-start gap-4">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 flex-shrink-0 mt-1 font-bold">1</span>
            <div class="flex-1">
              <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Preparation</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Gather all ingredients and tools. Preheat oven to 180°C.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-blue-600 dark:text-blue-400 timer-display">05:00</span>
                <button class="py-1 px-3 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors start-btn">Start</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors pause-btn hidden">Pause</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors reset-btn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700" data-step="1" data-duration="600">
        <div class="p-4">
          <div class="flex items-start gap-4">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400 flex-shrink-0 mt-1 font-bold">2</span>
            <div class="flex-1">
              <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Main Process</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Follow the main steps carefully. Don't rush this stage.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 timer-display">10:00</span>
                <button class="py-1 px-3 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors start-btn">Start</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors pause-btn hidden">Pause</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors reset-btn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700" data-step="2" data-duration="120">
        <div class="p-4">
          <div class="flex items-start gap-4">
            <span class="inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400 flex-shrink-0 mt-1 font-bold">3</span>
            <div class="flex-1">
              <h3 class="font-semibold mb-1 text-gray-900 dark:text-white">Finishing</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Let rest before serving. This step is crucial for best results.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-violet-600 dark:text-violet-400 timer-display">02:00</span>
                <button class="py-1 px-3 text-xs font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors start-btn">Start</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors pause-btn hidden">Pause</button>
                <button class="py-1 px-3 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors reset-btn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return m + ':' + s;
      }

      document.querySelectorAll('[data-step]').forEach(function(stepEl) {
        const duration = parseInt(stepEl.dataset.duration, 10);
        let remaining = duration;
        let interval = null;
        const display = stepEl.querySelector('.timer-display');
        const startBtn = stepEl.querySelector('.start-btn');
        const pauseBtn = stepEl.querySelector('.pause-btn');
        const resetBtn = stepEl.querySelector('.reset-btn');

        display.textContent = formatTime(remaining);

        startBtn.addEventListener('click', function() {
          if (interval) return;
          startBtn.classList.add('hidden');
          pauseBtn.classList.remove('hidden');
          interval = setInterval(function() {
            remaining--;
            display.textContent = formatTime(remaining);
            if (remaining <= 0) {
              clearInterval(interval);
              interval = null;
              pauseBtn.classList.add('hidden');
              startBtn.classList.remove('hidden');
              startBtn.disabled = true;
              display.textContent = 'Done!';
            }
          }, 1000);
        });

        pauseBtn.addEventListener('click', function() {
          clearInterval(interval);
          interval = null;
          pauseBtn.classList.add('hidden');
          startBtn.classList.remove('hidden');
        });

        resetBtn.addEventListener('click', function() {
          clearInterval(interval);
          interval = null;
          remaining = duration;
          display.textContent = formatTime(remaining);
          startBtn.disabled = false;
          startBtn.classList.remove('hidden');
          pauseBtn.classList.add('hidden');
        });
      });
    })();
  </script>
</section>`,
  },
  {
    id: "calculator-basic",
    name: "Calculator Basic",
    description: "Simple calculator with Tailwind button layout",
    category: "interactive",
    tags: ["calculator"],
    priority: 2,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-64">
  <div class="bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 w-72">
    <div class="p-4">
      <div class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-4 text-right">
        <div id="calc-expr" class="text-sm text-gray-400 dark:text-gray-500 min-h-5 break-all"></div>
        <div id="calc-display" class="text-3xl font-mono font-bold mt-1 break-all text-gray-900 dark:text-white">0</div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button class="col-span-2 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" id="calc-clear">AC</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" id="calc-sign">+/-</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors calc-op" data-op="/">÷</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="7">7</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="8">8</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="9">9</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors calc-op" data-op="*">×</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="4">4</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="5">5</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="6">6</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors calc-op" data-op="-">−</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="1">1</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="2">2</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="3">3</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors calc-op" data-op="+">+</button>
        <button class="col-span-2 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-num" data-num="0">0</button>
        <button class="py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors calc-dot">.</button>
        <button class="py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" id="calc-equals">=</button>
      </div>
    </div>
  </div>
  <script>
    (function() {
      let display = document.getElementById('calc-display');
      let expr = document.getElementById('calc-expr');
      let current = '0';
      let prev = '';
      let op = '';
      let justCalc = false;

      function updateDisplay() { display.textContent = current; }

      document.querySelectorAll('.calc-num').forEach(b => {
        b.addEventListener('click', function() {
          const n = this.dataset.num;
          if (justCalc) { current = n; justCalc = false; }
          else current = current === '0' ? n : current + n;
          updateDisplay();
        });
      });

      document.querySelector('.calc-dot').addEventListener('click', function() {
        if (!current.includes('.')) { current += '.'; updateDisplay(); }
      });

      document.querySelectorAll('.calc-op').forEach(b => {
        b.addEventListener('click', function() {
          if (prev && op && !justCalc) {
            const r = eval(prev + op + current);
            prev = String(r); current = String(r);
          } else { prev = current; }
          op = this.dataset.op;
          expr.textContent = prev + ' ' + this.textContent;
          justCalc = true;
        });
      });

      document.getElementById('calc-equals').addEventListener('click', function() {
        if (!prev || !op) return;
        try {
          const result = eval(prev + op + current);
          expr.textContent = prev + ' ' + op + ' ' + current + ' =';
          current = String(result);
          prev = ''; op = '';
          justCalc = true;
          updateDisplay();
        } catch(e) { current = 'Error'; updateDisplay(); }
      });

      document.getElementById('calc-clear').addEventListener('click', function() {
        current = '0'; prev = ''; op = ''; justCalc = false;
        expr.textContent = ''; updateDisplay();
      });

      document.getElementById('calc-sign').addEventListener('click', function() {
        current = String(parseFloat(current) * -1);
        updateDisplay();
      });
    })();
  </script>
</section>`,
  },
  {
    id: "progress-tracker",
    name: "Progress Tracker",
    description: "Checklist with localStorage persistence and progress bar",
    category: "interactive",
    tags: ["progress", "localStorage", "checklist"],
    priority: 2,
    domain_hints: ["blog", "dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-100 dark:bg-gray-900">
  <div class="max-w-lg mx-auto">
    <div class="bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-1 text-gray-900 dark:text-white">Progress Tracker</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Track your tasks. Progress is saved automatically.</p>
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-500 dark:text-gray-400">Completion</span>
            <span id="pt-pct" class="font-bold text-blue-600 dark:text-blue-400">0%</span>
          </div>
          <div class="flex w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div id="pt-bar" class="h-full bg-blue-600 rounded-full transition-all duration-300" style="width:0%"></div>
          </div>
        </div>
        <div class="space-y-2" id="pt-list">
          <label class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded pt-item" data-id="task-1">
            <span class="flex-1 text-sm text-gray-900 dark:text-white">Research and planning phase</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded pt-item" data-id="task-2">
            <span class="flex-1 text-sm text-gray-900 dark:text-white">Design mockups and wireframes</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded pt-item" data-id="task-3">
            <span class="flex-1 text-sm text-gray-900 dark:text-white">Development and implementation</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded pt-item" data-id="task-4">
            <span class="flex-1 text-sm text-gray-900 dark:text-white">Testing and quality assurance</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded pt-item" data-id="task-5">
            <span class="flex-1 text-sm text-gray-900 dark:text-white">Launch and deployment</span>
          </label>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="py-1.5 px-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" id="pt-reset">Reset All</button>
        </div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const STORAGE_KEY = 'appgen-progress-tracker';
      const items = document.querySelectorAll('.pt-item');
      const bar = document.getElementById('pt-bar');
      const pct = document.getElementById('pt-pct');

      function load() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        items.forEach(function(item) {
          item.checked = !!saved[item.dataset.id];
        });
      }

      function save() {
        const data = {};
        items.forEach(function(item) { data[item.dataset.id] = item.checked; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      function updateBar() {
        const checked = Array.from(items).filter(i => i.checked).length;
        const total = items.length;
        const p = total ? Math.round((checked / total) * 100) : 0;
        bar.style.width = p + '%';
        pct.textContent = p + '%';
      }

      items.forEach(function(item) {
        item.addEventListener('change', function() { save(); updateBar(); });
      });

      document.getElementById('pt-reset').addEventListener('click', function() {
        items.forEach(function(item) { item.checked = false; });
        localStorage.removeItem(STORAGE_KEY);
        updateBar();
      });

      load();
      updateBar();
    })();
  </script>
</section>`,
  },
  {
    id: "interactive-stepper",
    name: "Multi-Step Stepper Wizard",
    description: "Multi-step registration or onboarding wizard using Preline data-hs-stepper",
    category: "interactive",
    tags: ["steps", "form"],
    priority: 2,
    domain_hints: ["saas", "landing"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-2xl mx-auto">
    <div id="stepper-wizard">
      <ul class="relative flex flex-row gap-x-2 mb-8">
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1" data-step="1">
          <span class="min-w-7 min-h-7 inline-flex items-center text-xs align-middle">
            <span class="step-circle size-7 flex justify-center items-center flex-shrink-0 bg-blue-600 text-white font-medium rounded-full">
              <span class="step-num hidden">1</span>
              <svg class="step-check shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="ms-2 text-sm font-medium text-gray-800 dark:text-gray-200">Account</span>
          </span>
          <div class="step-connector w-full h-px flex-1 bg-blue-600"></div>
        </li>
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1" data-step="2">
          <span class="min-w-7 min-h-7 inline-flex items-center text-xs align-middle">
            <span class="step-circle size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium rounded-full">
              <span class="step-num">2</span>
              <svg class="step-check hidden shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="ms-2 text-sm font-medium text-gray-800 dark:text-gray-200">Profile</span>
          </span>
          <div class="step-connector w-full h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
        </li>
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1" data-step="3">
          <span class="min-w-7 min-h-7 inline-flex items-center text-xs align-middle">
            <span class="step-circle size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium rounded-full">
              <span class="step-num">3</span>
              <svg class="step-check hidden shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span class="ms-2 text-sm font-medium text-gray-800 dark:text-gray-200">Done</span>
          </span>
        </li>
      </ul>
      <div>
        <div class="step-panel" data-panel="1">
          <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create your account</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" placeholder="you@example.com" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" placeholder="••••••••" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>
          </div>
        </div>
        <div class="step-panel hidden" data-panel="2">
          <div class="bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tell us about yourself</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" placeholder="Jane Doe" class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>Product Manager</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="step-panel hidden" data-panel="3">
          <div class="bg-white border border-gray-200 rounded-xl p-6 text-center dark:bg-gray-800 dark:border-gray-700">
            <div class="text-5xl mb-4">🎉</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all set!</h3>
            <p class="text-gray-500 dark:text-gray-400">Your account has been created. Welcome aboard!</p>
          </div>
        </div>
        <div class="mt-5 flex justify-between items-center">
          <button type="button" id="stepper-wizard-back" class="py-2 px-4 inline-flex items-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none transition-colors" disabled>Back</button>
          <button type="button" id="stepper-wizard-next" class="py-2.5 px-5 inline-flex items-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  var stepper = document.getElementById('stepper-wizard');
  if (!stepper) return;
  var totalSteps = 3;
  var current = 1;
  function updateStepper() {
    var navItems = stepper.querySelectorAll('[data-step]');
    navItems.forEach(function(li) {
      var idx = parseInt(li.getAttribute('data-step'), 10);
      var circle = li.querySelector('.step-circle');
      var num = li.querySelector('.step-num');
      var check = li.querySelector('.step-check');
      var connector = li.querySelector('.step-connector');
      if (idx < current) {
        circle.className = 'step-circle size-7 flex justify-center items-center flex-shrink-0 bg-blue-600 text-white font-medium rounded-full';
        if (num) num.classList.add('hidden');
        if (check) check.classList.remove('hidden');
        if (connector) { connector.classList.remove('bg-gray-200', 'dark:bg-gray-700'); connector.classList.add('bg-blue-600'); }
      } else if (idx === current) {
        circle.className = 'step-circle size-7 flex justify-center items-center flex-shrink-0 bg-blue-600 text-white font-medium rounded-full';
        if (num) num.classList.remove('hidden');
        if (check) check.classList.add('hidden');
        if (connector) { connector.classList.remove('bg-blue-600'); connector.classList.add('bg-gray-200', 'dark:bg-gray-700'); }
      } else {
        circle.className = 'step-circle size-7 flex justify-center items-center flex-shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-medium rounded-full';
        if (num) num.classList.remove('hidden');
        if (check) check.classList.add('hidden');
        if (connector) { connector.classList.remove('bg-blue-600'); connector.classList.add('bg-gray-200', 'dark:bg-gray-700'); }
      }
    });
    stepper.querySelectorAll('.step-panel').forEach(function(panel) {
      panel.classList.toggle('hidden', parseInt(panel.getAttribute('data-panel'), 10) !== current);
    });
    var backBtn = document.getElementById('stepper-wizard-back');
    var nextBtn = document.getElementById('stepper-wizard-next');
    if (backBtn) backBtn.disabled = current === 1;
    if (nextBtn) nextBtn.textContent = current === totalSteps ? 'Finish' : 'Next';
  }
  document.getElementById('stepper-wizard-next').addEventListener('click', function() {
    if (current < totalSteps) { current++; updateStepper(); }
  });
  document.getElementById('stepper-wizard-back').addEventListener('click', function() {
    if (current > 1) { current--; updateStepper(); }
  });
  updateStepper();
})();
</script>`,
  },
  {
    id: "interactive-count-up",
    name: "Count-Up Animation on Scroll",
    description: "Numbers that count up when scrolled into view using IntersectionObserver",
    category: "interactive",
    tags: ["stats", "animation"],
    priority: 3,
    domain_hints: ["landing", "saas"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-20 px-6 bg-white dark:bg-gray-900">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Our Impact in Numbers</h2>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-14">Growing every day with customers worldwide</p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl font-extrabold text-blue-600 dark:text-blue-400 count-up-number" data-target="50000" data-suffix="+" data-duration="2000">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Users</div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 count-up-number" data-target="1200" data-suffix="" data-duration="2000">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Companies</div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl font-extrabold text-violet-600 dark:text-violet-400 count-up-number" data-target="99" data-suffix="%" data-duration="1500">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Uptime</div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-4xl font-extrabold text-teal-600 dark:text-teal-400 count-up-number" data-target="4" data-suffix=" min" data-duration="1200">0</div>
        <div class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Avg setup time</div>
      </div>
    </div>
  </div>
  <script>
    (function() {
      const els = document.querySelectorAll('.count-up-number');
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = parseInt(el.dataset.duration, 10) || 2000;
          const steps = Math.min(target, 60);
          const increment = target / steps;
          const interval = duration / steps;
          let current = 0;
          const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }, interval);
        });
      }, { threshold: 0.3 });
      els.forEach(function(el) { observer.observe(el); });
    })();
  </script>
</section>`,
  },
  {
    id: "interactive-typing-hero",
    name: "Typing Animation Hero",
    description: "Hero section with a typing animation cycling through phrases using vanilla JS",
    category: "interactive",
    tags: ["hero", "animation"],
    priority: 2,
    domain_hints: ["landing", "portfolio"],
    min_score: 0,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-24 px-6 bg-white dark:bg-gray-900 text-center">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
      We build<br>
      <span class="text-blue-600 dark:text-blue-400" id="typing-text"></span><span class="animate-pulse text-blue-600 dark:text-blue-400">|</span>
    </h1>
    <p class="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">Fast, beautiful, and accessible websites that your users will love from the first click.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get started free</a>
      <a href="#" class="py-2.5 px-5 inline-flex items-center justify-center text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">See examples</a>
    </div>
  </div>
  <script>
    (function() {
      const phrases = ['amazing products.', 'stunning portfolios.', 'fast landing pages.', 'beautiful blogs.'];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      const el = document.getElementById('typing-text');
      if (!el) return;
      function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
          el.textContent = current.substring(0, charIndex - 1);
          charIndex--;
        } else {
          el.textContent = current.substring(0, charIndex + 1);
          charIndex++;
        }
        let delay = isDeleting ? 60 : 100;
        if (!isDeleting && charIndex === current.length) {
          delay = 1800;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 300;
        }
        setTimeout(type, delay);
      }
      type();
    })();
  </script>
</section>`,
  },
];
