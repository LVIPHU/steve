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
    html: `<section class="py-10 px-6 bg-base-200 min-h-screen">
  <div class="max-w-xl mx-auto">
    <div class="card bg-base-100 shadow-lg" id="quiz-app">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-2">Knowledge Quiz</h2>
        <div id="quiz-progress-bar" class="w-full bg-base-200 rounded-full h-2 mb-4">
          <div id="quiz-progress-fill" class="bg-primary h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div id="quiz-container"></div>
        <div id="quiz-result" class="hidden text-center py-8">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-3xl font-bold mb-2" id="quiz-score-text"></h3>
          <p class="text-base-content/60 mb-6" id="quiz-score-detail"></p>
          <button class="btn btn-primary" id="quiz-restart">Try Again</button>
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
        container.innerHTML = '<p class="text-sm text-base-content/50 mb-3">Question ' + (current + 1) + ' of ' + questions.length + '</p>' +
          '<p class="text-lg font-semibold mb-6">' + q.question + '</p>' +
          '<div class="space-y-3" id="options-list">' +
          q.options.map((opt, i) =>
            '<button class="btn btn-outline w-full justify-start text-left option-btn" data-idx="' + i + '">' + opt + '</button>'
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
              if (i === correct) b.classList.add('btn-success');
              else if (i === chosen && chosen !== correct) b.classList.add('btn-error');
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
    html: `<section class="py-10 px-6 bg-base-200 min-h-screen">
  <div class="max-w-lg mx-auto">
    <h2 class="text-2xl font-bold text-center mb-2">Flashcards</h2>
    <p class="text-center text-base-content/60 text-sm mb-6">Click to flip • Swipe or use arrows to navigate</p>
    <div class="flex items-center justify-center gap-4 mb-6">
      <button id="fc-prev" class="btn btn-circle btn-outline btn-sm">&#8592;</button>
      <span id="fc-counter" class="text-sm text-base-content/60">1 / 5</span>
      <button id="fc-next" class="btn btn-circle btn-outline btn-sm">&#8594;</button>
    </div>
    <div id="fc-wrapper" style="perspective: 1000px; height: 220px;" class="cursor-pointer select-none">
      <div id="fc-card" style="width:100%; height: 220px; transform-style: preserve-3d; transition: transform 0.5s; position: relative;">
        <div class="fc-front" style="backface-visibility: hidden; position: absolute; inset: 0; border-radius: 1rem;" class="bg-base-100 shadow-lg flex items-center justify-center p-8">
          <div class="text-center">
            <div class="badge badge-primary mb-3">FRONT</div>
            <p id="fc-front-text" class="text-xl font-semibold"></p>
          </div>
        </div>
        <div class="fc-back" style="backface-visibility: hidden; transform: rotateY(180deg); position: absolute; inset: 0; border-radius: 1rem;" class="bg-primary text-primary-content shadow-lg flex items-center justify-center p-8">
          <div class="text-center">
            <div class="badge badge-secondary mb-3">BACK</div>
            <p id="fc-back-text" class="text-xl font-semibold"></p>
          </div>
        </div>
      </div>
    </div>
    <div id="fc-progress-wrap" class="mt-6">
      <div class="flex justify-between text-xs text-base-content/50 mb-1">
        <span>Progress</span>
        <span id="fc-progress-text">0 seen</span>
      </div>
      <progress id="fc-progress-bar" class="progress progress-primary w-full" value="0" max="5"></progress>
    </div>
  </div>
  <style>
    .fc-front { background-color: hsl(var(--b1)); color: hsl(var(--bc)); }
    .fc-back { background-color: hsl(var(--p)); color: hsl(var(--pc)); }
  </style>
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
        progressBar.value = seen.size;
        progressBar.max = cards.length;
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
    tags: ["steps", "timer", "countdown"],
    priority: 1,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-base-200">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-2">Step-by-Step Guide</h2>
    <p class="text-base-content/60 text-sm mb-8">Each step has its own timer. Run them simultaneously if needed.</p>
    <div class="space-y-4" id="steps-container">
      <div class="card bg-base-100 shadow-sm" data-step="0" data-duration="300">
        <div class="card-body py-4">
          <div class="flex items-start gap-4">
            <div class="badge badge-primary badge-lg font-bold flex-shrink-0 mt-1">1</div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">Preparation</h3>
              <p class="text-sm text-base-content/60 mb-3">Gather all ingredients and tools. Preheat oven to 180°C.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-primary timer-display">05:00</span>
                <button class="btn btn-primary btn-xs start-btn">Start</button>
                <button class="btn btn-ghost btn-xs pause-btn hidden">Pause</button>
                <button class="btn btn-ghost btn-xs reset-btn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm" data-step="1" data-duration="600">
        <div class="card-body py-4">
          <div class="flex items-start gap-4">
            <div class="badge badge-secondary badge-lg font-bold flex-shrink-0 mt-1">2</div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">Main Process</h3>
              <p class="text-sm text-base-content/60 mb-3">Follow the main steps carefully. Don't rush this stage.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-secondary timer-display">10:00</span>
                <button class="btn btn-secondary btn-xs start-btn">Start</button>
                <button class="btn btn-ghost btn-xs pause-btn hidden">Pause</button>
                <button class="btn btn-ghost btn-xs reset-btn">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm" data-step="2" data-duration="120">
        <div class="card-body py-4">
          <div class="flex items-start gap-4">
            <div class="badge badge-accent badge-lg font-bold flex-shrink-0 mt-1">3</div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">Finishing</h3>
              <p class="text-sm text-base-content/60 mb-3">Let rest before serving. This step is crucial for best results.</p>
              <div class="flex items-center gap-3">
                <span class="font-mono text-xl font-bold text-accent timer-display">02:00</span>
                <button class="btn btn-accent btn-xs start-btn">Start</button>
                <button class="btn btn-ghost btn-xs pause-btn hidden">Pause</button>
                <button class="btn btn-ghost btn-xs reset-btn">Reset</button>
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
    description: "Simple calculator with DaisyUI button layout",
    category: "interactive",
    tags: ["calculator"],
    priority: 2,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-base-200 flex items-center justify-center min-h-64">
  <div class="card bg-base-100 shadow-lg w-72">
    <div class="card-body p-4">
      <div class="bg-base-200 rounded-lg p-4 mb-4 text-right">
        <div id="calc-expr" class="text-sm text-base-content/50 min-h-5 break-all"></div>
        <div id="calc-display" class="text-3xl font-mono font-bold mt-1 break-all">0</div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <button class="btn btn-ghost btn-sm col-span-2" id="calc-clear">AC</button>
        <button class="btn btn-ghost btn-sm" id="calc-sign">+/-</button>
        <button class="btn btn-primary btn-sm calc-op" data-op="/">÷</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="7">7</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="8">8</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="9">9</button>
        <button class="btn btn-primary btn-sm calc-op" data-op="*">×</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="4">4</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="5">5</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="6">6</button>
        <button class="btn btn-primary btn-sm calc-op" data-op="-">−</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="1">1</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="2">2</button>
        <button class="btn btn-outline btn-sm calc-num" data-num="3">3</button>
        <button class="btn btn-primary btn-sm calc-op" data-op="+">+</button>
        <button class="btn btn-outline btn-sm col-span-2 calc-num" data-num="0">0</button>
        <button class="btn btn-outline btn-sm calc-dot">.</button>
        <button class="btn btn-secondary btn-sm" id="calc-equals">=</button>
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
    tags: ["progress", "localStorage"],
    priority: 2,
    domain_hints: ["dashboard"],
    min_score: 1,
    fallback: false,
    fallback_for: [],
    html: `<section class="py-10 px-6 bg-base-200">
  <div class="max-w-lg mx-auto">
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-1">Progress Tracker</h2>
        <p class="text-sm text-base-content/60 mb-4">Track your tasks. Progress is saved automatically.</p>
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-base-content/60">Completion</span>
            <span id="pt-pct" class="font-bold text-primary">0%</span>
          </div>
          <progress id="pt-bar" class="progress progress-primary w-full" value="0" max="100"></progress>
        </div>
        <div class="space-y-2" id="pt-list">
          <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
            <input type="checkbox" class="checkbox checkbox-primary pt-item" data-id="task-1">
            <span class="flex-1">Research and planning phase</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
            <input type="checkbox" class="checkbox checkbox-primary pt-item" data-id="task-2">
            <span class="flex-1">Design mockups and wireframes</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
            <input type="checkbox" class="checkbox checkbox-primary pt-item" data-id="task-3">
            <span class="flex-1">Development and implementation</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
            <input type="checkbox" class="checkbox checkbox-primary pt-item" data-id="task-4">
            <span class="flex-1">Testing and quality assurance</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors">
            <input type="checkbox" class="checkbox checkbox-primary pt-item" data-id="task-5">
            <span class="flex-1">Launch and deployment</span>
          </label>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="btn btn-ghost btn-sm" id="pt-reset">Reset All</button>
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
        bar.value = p;
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
];
