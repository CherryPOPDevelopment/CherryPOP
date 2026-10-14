/* Adventure Guide Builder — shared across Recommendations and Discussion pages */
(function () {
  // ── Data from server ──────────────────────────────────────────
  const dataEl = document.getElementById('guidePlacesData');
  if (!dataEl) return;
  const ALL_PLACES = JSON.parse(dataEl.textContent || '[]');

  // ── Scoring maps (pos = boost, neg = penalty) ─────────────────
  const VIBE = {
    lively:   { pos: ['Bar', 'Entertainment', 'Speakeasy'],                              neg: ['Library', 'Cafe'] },
    chill:    { pos: ['Cafe', 'Restaurant', 'Library', 'Shop', 'Market'],                neg: ['Bar', 'Entertainment'] },
    romantic: { pos: ['Restaurant', 'Speakeasy', 'Bar', 'Experience'],                   neg: [] },
    adventure:{ pos: ['Tour', 'Experience', 'Gym', 'Entertainment', 'Market'],           neg: ['Library'] },
    foodie:   { pos: ['Restaurant', 'Cafe', 'Bar', 'Market', 'Speakeasy', 'Grocery Store'], neg: [] },
    cultural: { pos: ['Library', 'Tour', 'Experience', 'Entertainment', 'Shop', 'Market'], neg: [] }
  };
  const TIME = {
    morning:   { pos: ['Cafe', 'Grocery Store', 'Market', 'Gym', 'Library', 'Shop'],    neg: ['Bar', 'Speakeasy'] },
    afternoon: { pos: ['Restaurant', 'Shop', 'Mall', 'Market', 'Tour', 'Experience', 'Library'], neg: [] },
    evening:   { pos: ['Bar', 'Speakeasy', 'Entertainment', 'Restaurant'],               neg: ['Cafe', 'Gym', 'Library'] },
    flexible:  { pos: [], neg: [] }
  };
  const GROUP = {
    solo:          { pos: ['Cafe', 'Library', 'Gym', 'Shop', 'Market'],                  neg: [] },
    couple:        { pos: ['Restaurant', 'Speakeasy', 'Bar', 'Tour', 'Experience'],      neg: [] },
    friends_small: { pos: ['Bar', 'Entertainment', 'Restaurant', 'Experience', 'Tour'],  neg: [] },
    friends_large: { pos: ['Bar', 'Entertainment', 'Restaurant', 'Mall'],                neg: [] },
    family_kids:   { pos: ['Mall', 'Market', 'Restaurant', 'Library', 'Shop', 'Gym'],   neg: ['Bar', 'Speakeasy'] },
    family_teens:  { pos: ['Entertainment', 'Mall', 'Shop', 'Tour', 'Experience', 'Restaurant'], neg: [] },
    seniors:       { pos: ['Cafe', 'Restaurant', 'Library', 'Market', 'Shop', 'Tour'],  neg: ['Gym', 'Entertainment'] }
  };
  const BUDGET = {
    budget:   { pos: ['Cafe', 'Market', 'Grocery Store', 'Library', 'Gym', 'Shop'],     neg: ['Speakeasy'] },
    midrange: { pos: ['Restaurant', 'Bar', 'Mall', 'Tour', 'Experience', 'Shop'],       neg: [] },
    splurge:  { pos: ['Speakeasy', 'Entertainment', 'Restaurant', 'Tour', 'Experience'], neg: [] }
  };
  const INTEREST = {
    food:          ['Restaurant', 'Cafe', 'Bar', 'Speakeasy', 'Market', 'Grocery Store'],
    shopping:      ['Shop', 'Mall', 'Market'],
    entertainment: ['Entertainment', 'Experience', 'Tour'],
    outdoors:      ['Gym', 'Tour', 'Experience', 'Market'],
    culture:       ['Library', 'Tour', 'Experience', 'Entertainment', 'Shop', 'Market'],
    local:         ['Market', 'Cafe', 'Shop', 'Bar', 'Restaurant', 'Experience']
  };
  const SPECIAL_PENALTY = {
    quiet:          ['Bar', 'Entertainment', 'Speakeasy'],
    no_alcohol:     ['Bar', 'Speakeasy'],
    kids_activities:['Bar', 'Speakeasy']
  };
  const DURATION_STOPS = { activity: 1, half_day: 3, full_day: 5 };

  // ── State ─────────────────────────────────────────────────────
  let guideItems = [];
  let activeCategory = '';
  let chipSearchQuery = '';
  let currentItinerary = null;
  let guideTemplate = 'standard';

  // ── Element refs ──────────────────────────────────────────────
  const dropzone     = document.getElementById('guideDropzone');
  const dropzoneList = document.getElementById('guideDropzoneList');
  const placeholder  = document.getElementById('guideDropzonePlaceholder');
  const dzActions    = document.getElementById('guideDropzoneActions');
  const nameInput    = document.getElementById('guideNameInput');
  const printBtn     = document.getElementById('guidePrintBtn');
  const clearBtn     = document.getElementById('guideClearBtn');
  const surpriseBtn  = document.getElementById('guideSurpriseBtn');
  const quizBtn      = document.getElementById('guideQuizBtn');
  const quizOverlay  = document.getElementById('guideQuizOverlay');
  const quizClose    = document.getElementById('guideQuizClose');
  const quizCancel   = document.getElementById('guideQuizCancel');
  const quizForm      = document.getElementById('guideQuizForm');
  const quizError     = document.getElementById('quizError');
  const quizResultsEl = document.getElementById('quizResults');
  const quizUseGuide  = document.getElementById('quizUseGuide');
  const quizRetry     = document.getElementById('quizRetry');
  const sourceChips   = document.getElementById('guideSourceChips');
  const stopCounter  = document.getElementById('guideStopCount');
  const templateSelect = document.getElementById('guideTemplateSelect');
  const toggleBtn = document.getElementById('guideToggleBtn');
  const guideBody = document.getElementById('adventureGuideBody');
  const guestNameInput = document.getElementById('guideGuestNameInput');
  const dateInput = document.getElementById('guideDateInput');
  const notesInput = document.getElementById('guideNotesInput');
  const timelineBtn = document.getElementById('guideTimelineBtn');

  if (!dropzone || !sourceChips) return;

  // ── Dropdown toggle ──────────────────────────────────────────
  const TOGGLE_STORAGE_KEY = 'sovaGuideExpanded';
  function setGuideExpanded(expanded) {
    if (!toggleBtn || !guideBody) return;
    toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    guideBody.hidden = !expanded;
    guideBody.classList.toggle('open', expanded);
    try {
      localStorage.setItem(TOGGLE_STORAGE_KEY, expanded ? '1' : '0');
    } catch (error) {
      // Ignore storage availability errors.
    }
  }

  if (toggleBtn && guideBody) {
    let savedExpanded = false;
    try {
      savedExpanded = localStorage.getItem(TOGGLE_STORAGE_KEY) === '1';
    } catch (error) {
      savedExpanded = false;
    }
    setGuideExpanded(savedExpanded);
    toggleBtn.addEventListener('click', () => {
      const currentlyExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      setGuideExpanded(!currentlyExpanded);
    });
  }

  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // ── Helpers ───────────────────────────────────────────────────
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function stars(rating) {
    const r = parseFloat(rating);
    if (!r) return '';
    const full = Math.min(5, Math.round(r));
    return '\u2605'.repeat(full) + '\u2606'.repeat(Math.max(0, 5 - full));
  }

  // ── Chip filter ───────────────────────────────────────────
  function initChipFilters() {
    const categories = [...new Set(ALL_PLACES.map((p) => p.category).filter(Boolean))].sort();
    const filterEl = document.getElementById('guideCategoryFilter');
    if (filterEl) {
      const allBtn = makeFilterPill('All', true, () => { activeCategory = ''; filterChips(); setActivePill(allBtn); });
      filterEl.appendChild(allBtn);
      categories.forEach((cat) => {
        const btn = makeFilterPill(cat, false, () => { activeCategory = cat; filterChips(); setActivePill(btn); });
        filterEl.appendChild(btn);
      });
    }
    const searchEl = document.getElementById('guideChipSearch');
    if (searchEl) {
      searchEl.addEventListener('input', () => { chipSearchQuery = searchEl.value.toLowerCase(); filterChips(); });
    }
  }
  function makeFilterPill(label, active, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-cat-pill' + (active ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }
  function setActivePill(activeBtn) {
    const filterEl = document.getElementById('guideCategoryFilter');
    if (filterEl) filterEl.querySelectorAll('.guide-cat-pill').forEach((b) => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }
  function filterChips() {
    const chips = sourceChips.querySelectorAll('.guide-chip');
    let visible = 0;
    chips.forEach((chip) => {
      const matchCat = !activeCategory || chip.dataset.placeCategory === activeCategory;
      const matchSearch = !chipSearchQuery || chip.dataset.placeTitle.toLowerCase().includes(chipSearchQuery);
      chip.hidden = !matchCat || !matchSearch;
      if (!chip.hidden) visible++;
    });
    const noResult = document.getElementById('guideChipNoResults');
    if (noResult) noResult.hidden = visible > 0;
  }

  // ── Drop zone render ──────────────────────────────────────────
  const TIME_BUCKET_LABELS = {
    morning: '\uD83C\uDF05 Morning', afternoon: '\u2600\uFE0F Afternoon',
    evening: '\uD83C\uDF19 Evening', flexible: '\uD83D\uDD50 Any Time'
  };
  function getTimeBucket(item) {
    if (item.slot) {
      const s = item.slot.toLowerCase();
      if (s.includes('breakfast')) return 'morning';
      if (s.includes('lunch'))     return 'afternoon';
      if (s.includes('dinner'))    return 'evening';
    }
    const cat = item.category || '';
    if (['Cafe', 'Grocery Store', 'Market', 'Gym'].includes(cat))                            return 'morning';
    if (['Shop', 'Mall', 'Tour', 'Experience', 'Library', 'Restaurant'].includes(cat))       return 'afternoon';
    if (['Bar', 'Speakeasy', 'Entertainment'].includes(cat))                                  return 'evening';
    return 'flexible';
  }
  function makeSlotHeaderLi(label, extraClass) {
    const li = document.createElement('li');
    li.className = 'guide-slot-label' + (extraClass ? ' ' + extraClass : '');
    li.setAttribute('aria-hidden', 'true');
    li.textContent = label;
    return li;
  }
  function makeItemLi(item, idx) {
    const li = document.createElement('li');
    li.className = 'guide-dzitem';
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-idx', idx);
    const ratingStr = item.rating
      ? `<span class="guide-dzitem-stars" aria-label="Rating ${escHtml(String(item.rating))}/5">${escHtml(stars(item.rating))}</span>`
      : '';
    li.innerHTML = `
      <span class="guide-dzitem-num">${idx + 1}</span>
      <span class="guide-dzitem-info">
        <strong>${escHtml(item.title)}</strong>
        <span class="guide-dzitem-meta">
          <span class="badge-status badge-category-soft">${escHtml(item.category)}</span>
          ${ratingStr}
        </span>
        ${item.location ? `<small class="muted-text">${escHtml(item.location)}</small>` : ''}
      </span>
      <button type="button" class="guide-dzitem-remove" aria-label="Remove ${escHtml(item.title)}">&times;</button>`;
    li.querySelector('.guide-dzitem-remove').addEventListener('click', () => {
      guideItems.splice(idx, 1);
      renderDropzone();
    });
    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('dz-reorder', String(idx));
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
    return li;
  }
  function renderDropzone() {
    dropzoneList.innerHTML = '';
    if (stopCounter) {
      stopCounter.textContent = guideItems.length > 0
        ? `${guideItems.length} stop${guideItems.length !== 1 ? 's' : ''}`
        : '';
    }
    if (guideItems.length === 0) {
      placeholder.hidden = false;
      dzActions.hidden = true;
      return;
    }
    placeholder.hidden = true;
    dzActions.hidden = false;

    if (guideTemplate === 'time_of_day') {
      const buckets = { morning: [], afternoon: [], evening: [], flexible: [] };
      guideItems.forEach((item, idx) => buckets[getTimeBucket(item)].push({ item, idx }));
      ['morning', 'afternoon', 'evening', 'flexible'].forEach((key) => {
        if (buckets[key].length === 0) return;
        dropzoneList.appendChild(makeSlotHeaderLi(TIME_BUCKET_LABELS[key], 'guide-time-header'));
        buckets[key].forEach(({ item, idx }) => dropzoneList.appendChild(makeItemLi(item, idx)));
      });
    } else {
      guideItems.forEach((item, idx) => {
        if (item.slot) dropzoneList.appendChild(makeSlotHeaderLi(item.slot, ''));
        dropzoneList.appendChild(makeItemLi(item, idx));
      });
    }
  }

  function addToGuide(place) {
    if (guideItems.find((p) => p.id === place.id)) return;
    guideItems.push({ id: place.id, title: place.title, category: place.category, location: place.location || '', rating: place.rating || '', slot: null });
    renderDropzone();
  }

  function assignTimelineSlots() {
    if (!guideItems.length) return;

    const defaultSlots = [
      '\ud83c\udf05 Breakfast',
      '\ud83c\udf24 Morning Stop',
      '\u2600\ufe0f Lunch',
      '\ud83c\udf1e Afternoon Stop',
      '\ud83c\udf19 Dinner',
      '\ud83c\udf06 Evening Option'
    ];

    guideItems = guideItems.map((item, idx) => {
      const assignedSlot = defaultSlots[idx] || `\ud83d\udccd Optional Stop ${idx + 1}`;
      return {
        ...item,
        slot: assignedSlot
      };
    });

    guideTemplate = 'standard';
    if (templateSelect) {
      templateSelect.value = 'standard';
    }
    renderDropzone();
  }

  if (timelineBtn) {
    timelineBtn.addEventListener('click', assignTimelineSlots);
  }

  // ── Scoring helpers ───────────────────────────────────────────
  function calcScore(p, answers) {
    let score = 0;
    const cat = p.category || '';
    if (VIBE[answers.vibe]) {
      if (VIBE[answers.vibe].pos.includes(cat)) score += 3;
      if (VIBE[answers.vibe].neg.includes(cat)) score -= 3;
    }
    if (TIME[answers.time_of_day]) {
      if (TIME[answers.time_of_day].pos.includes(cat)) score += 2;
      if (TIME[answers.time_of_day].neg.includes(cat)) score -= 2;
    }
    if (GROUP[answers.group]) {
      if (GROUP[answers.group].pos.includes(cat)) score += 2;
      if (GROUP[answers.group].neg.includes(cat)) score -= 4;
    }
    if (BUDGET[answers.budget]) {
      if (BUDGET[answers.budget].pos.includes(cat)) score += 2;
      if (BUDGET[answers.budget].neg.includes(cat)) score -= 2;
    }
    (answers.interests || []).forEach((interest) => {
      if (INTEREST[interest] && INTEREST[interest].includes(cat)) score += 1;
    });
    (answers.special || []).forEach((s) => {
      if (SPECIAL_PENALTY[s] && SPECIAL_PENALTY[s].includes(cat)) score -= 5;
    });
    score += (parseFloat(p.rating) || 0) / 5;
    return score;
  }

  function scoreAndBuild(answers, maxOverride) {
    const maxStops = maxOverride || DURATION_STOPS[answers.duration] || 4;
    const scored = ALL_PLACES
      .map((p) => ({ ...p, _score: calcScore(p, answers) }))
      .sort((a, b) => b._score - a._score || (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    const picked = [];
    const usedCats = new Set();
    for (const p of scored) {
      if (picked.length >= maxStops) break;
      if (p._score <= -3) break;
      if (!usedCats.has(p.category) || picked.length < Math.ceil(maxStops / 2)) {
        picked.push(p); usedCats.add(p.category);
      }
    }
    for (const p of scored) {
      if (picked.length >= maxStops) break;
      if (!picked.find((x) => x.id === p.id)) picked.push(p);
    }
    return picked.slice(0, maxStops);
  }

  // ── Itinerary builder ─────────────────────────────────────────
  function buildItinerary(answers) {
    const dur = answers.duration || 'half_day';
    const vibeL = { lively: 'Lively', chill: 'Chill', romantic: 'Romantic', adventure: 'Active', foodie: 'Foodie', cultural: 'Cultural' };
    const timeL = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', flexible: 'All-Day' };
    const durL  = { activity: 'Activity', half_day: 'Half-Day Guide', full_day: 'Full Day' };
    const guideName = [vibeL[answers.vibe], timeL[answers.time_of_day], durL[dur]].filter(Boolean).join(' ');

    const scored = ALL_PLACES
      .map((p) => ({ ...p, _score: calcScore(p, answers) }))
      .sort((a, b) => b._score - a._score || (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));

    if (dur === 'activity') {
      const pick = scored.find((p) => p._score > -3) || scored[0];
      return { duration: dur, name: guideName, stops: pick ? [{ slot: null, place: pick }] : [] };
    }

    if (dur === 'half_day') {
      const picks = [];
      const usedCats = new Set();
      for (const p of scored) {
        if (picks.length >= 3) break;
        if (p._score <= -3) continue;
        if (!usedCats.has(p.category) || picks.length < 2) { picks.push(p); usedCats.add(p.category); }
      }
      for (const p of scored) {
        if (picks.length >= 3) break;
        if (!picks.find((x) => x.id === p.id)) picks.push(p);
      }
      return { duration: dur, name: guideName, stops: picks.slice(0, 3).map((p) => ({ slot: null, place: p })) };
    }

    // full_day: Breakfast → Activity → Lunch → Activity → Dinner
    const BREAKFAST_CATS = ['Cafe', 'Restaurant', 'Market', 'Grocery Store'];
    const LUNCH_CATS     = ['Restaurant', 'Cafe', 'Market', 'Bar'];
    const DINNER_CATS    = ['Restaurant', 'Speakeasy', 'Bar'];
    const ACTIVITY_CATS  = ['Entertainment', 'Tour', 'Experience', 'Shop', 'Mall', 'Gym', 'Library'];
    const usedIds = new Set();
    function pickFrom(preferCats) {
      for (const p of scored) {
        if (!usedIds.has(p.id) && preferCats.includes(p.category)) { usedIds.add(p.id); return p; }
      }
      for (const p of scored) {
        if (!usedIds.has(p.id)) { usedIds.add(p.id); return p; }
      }
      return null;
    }
    const breakfast = pickFrom(BREAKFAST_CATS);
    const act1      = pickFrom(ACTIVITY_CATS);
    const lunch     = pickFrom(LUNCH_CATS);
    const act2      = pickFrom(ACTIVITY_CATS);
    const dinner    = pickFrom(DINNER_CATS);
    const slots = [
      { slot: '\uD83C\uDF05 Breakfast', place: breakfast },
      { slot: '\uD83C\uDFAF Activity',  place: act1 },
      { slot: '\u2600\uFE0F Lunch',      place: lunch },
      { slot: '\uD83C\uDFAD Activity',   place: act2 },
      { slot: '\uD83C\uDF19 Dinner',     place: dinner },
    ].filter((s) => s.place);
    return { duration: dur, name: guideName, stops: slots };
  }

  // ── Render quiz results (inline in modal) ─────────────────────
  function renderQuizResults(itinerary) {
    const content = document.getElementById('quizResultsContent');
    if (!content) return;
    const durLabel = { activity: 'Your recommended activity', half_day: 'Your half-day itinerary', full_day: 'Your full-day adventure' };
    let html = '<h3 class="quiz-result-title">' + escHtml(itinerary.name) + '</h3>';
    html += '<p class="quiz-result-label">' + escHtml(durLabel[itinerary.duration] || 'Your guide') + ':</p>';
    if (itinerary.duration === 'full_day') {
      html += '<div class="quiz-result-timeline">';
      itinerary.stops.forEach(function (s) {
        const p = s.place;
        html += '<div class="quiz-timeline-slot">'
          + '<div class="quiz-timeline-label">' + escHtml(s.slot) + '</div>'
          + '<div class="quiz-result-card">'
          + '<strong>' + escHtml(p.title) + '</strong>'
          + '<span class="badge-status badge-category-soft">' + escHtml(p.category) + '</span>'
          + (p.rating ? '<span class="guide-dzitem-stars">' + escHtml(stars(p.rating)) + '</span>' : '')
          + (p.location ? '<small class="muted-text">&#128205; ' + escHtml(p.location) + '</small>' : '')
          + '</div></div>';
      });
      html += '</div>';
    } else {
      html += '<ol class="quiz-result-list">';
      itinerary.stops.forEach(function (s) {
        const p = s.place;
        html += '<li class="quiz-result-card">'
          + '<strong>' + escHtml(p.title) + '</strong>'
          + '<span class="badge-status badge-category-soft">' + escHtml(p.category) + '</span>'
          + (p.rating ? '<span class="guide-dzitem-stars">' + escHtml(stars(p.rating)) + '</span>' : '')
          + (p.location ? '<small class="muted-text">&#128205; ' + escHtml(p.location) + '</small>' : '')
          + '</li>';
      });
      html += '</ol>';
    }
    content.innerHTML = html;
  }

  // ── Drag-and-drop: chips → dropzone ──────────────────────────
  sourceChips.addEventListener('dragstart', (e) => {
    const chip = e.target.closest('.guide-chip');
    if (!chip) return;
    e.dataTransfer.setData('chip-id', chip.dataset.placeId);
    chip.classList.add('dragging');
  });
  sourceChips.addEventListener('dragend', (e) => {
    const chip = e.target.closest('.guide-chip');
    if (chip) chip.classList.remove('dragging');
  });

  sourceChips.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const chip = e.target.closest('.guide-chip');
      if (!chip) return;
      e.preventDefault();
      const place = ALL_PLACES.find((p) => String(p.id) === chip.dataset.placeId);
      if (place) addToGuide(place);
    }
  });

  sourceChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.guide-chip');
    if (!chip) return;
    const place = ALL_PLACES.find((p) => String(p.id) === chip.dataset.placeId);
    if (place) addToGuide(place);
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');

    const reorderIdx = e.dataTransfer.getData('dz-reorder');
    if (reorderIdx !== '') {
      const from = parseInt(reorderIdx, 10);
      const toEl = e.target.closest('[data-idx]');
      const to = toEl ? parseInt(toEl.dataset.idx, 10) : guideItems.length - 1;
      if (from !== to && !Number.isNaN(to)) {
        const [moved] = guideItems.splice(from, 1);
        guideItems.splice(to, 0, moved);
        renderDropzone();
      }
      return;
    }

    const chipId = e.dataTransfer.getData('chip-id');
    if (!chipId) return;
    const place = ALL_PLACES.find((p) => String(p.id) === chipId);
    if (place) addToGuide(place);
  });

  // ── Surprise Me ───────────────────────────────────────────────
  surpriseBtn.addEventListener('click', () => {
    if (ALL_PLACES.length === 0) return;
    guideItems = [];
    const shuffled = [...ALL_PLACES].sort(() => Math.random() - 0.5);
    const usedCats = new Set();
    for (const p of shuffled) {
      if (guideItems.length >= 4) break;
      if (!usedCats.has(p.category)) {
        guideItems.push({ id: p.id, title: p.title, category: p.category, location: p.location || '', rating: p.rating || '' });
        usedCats.add(p.category);
      }
    }
    if (guideItems.length < 3) {
      for (const p of shuffled) {
        if (guideItems.length >= 4) break;
        if (!guideItems.find((g) => g.id === p.id)) {
          guideItems.push({ id: p.id, title: p.title, category: p.category, location: p.location || '', rating: p.rating || '' });
        }
      }
    }
    renderDropzone();
    nameInput.value = "Today's Surprise Adventure";
  });

  // ── Quiz ──────────────────────────────────────────────────────
  function openQuiz() {
    if (!quizOverlay) return;
    quizOverlay.hidden = false;
    document.body.classList.add('quiz-open');
    if (quizForm) quizForm.hidden = false;
    if (quizResultsEl) quizResultsEl.hidden = true;
    const firstInput = quizOverlay.querySelector('input[type="radio"],input[type="checkbox"]');
    if (firstInput) firstInput.focus();
  }
  function closeQuiz() {
    quizOverlay.hidden = true;
    document.body.classList.remove('quiz-open');
  }

  if (quizBtn) quizBtn.addEventListener('click', openQuiz);
  if (quizClose) quizClose.addEventListener('click', closeQuiz);
  if (quizCancel) quizCancel.addEventListener('click', closeQuiz);
  if (quizOverlay) {
    quizOverlay.addEventListener('click', (e) => { if (e.target === quizOverlay) closeQuiz(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quizOverlay && !quizOverlay.hidden) closeQuiz();
  });

  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(quizForm);
      const answers = {
        vibe:        data.get('vibe'),
        time_of_day: data.get('time_of_day'),
        group:       data.get('group'),
        duration:    data.get('duration'),
        budget:      data.get('budget'),
        interests:   data.getAll('interests'),
        special:     data.getAll('special')
      };
      if (!answers.vibe || !answers.time_of_day || !answers.group) {
        if (quizError) { quizError.textContent = 'Please answer at least the first three questions.'; quizError.hidden = false; }
        return;
      }
      if (quizError) quizError.hidden = true;
      currentItinerary = buildItinerary(answers);
      renderQuizResults(currentItinerary);
      quizForm.hidden = true;
      if (quizResultsEl) quizResultsEl.hidden = false;
    });
  }

  // ── Use This Guide ────────────────────────────────────────────
  if (quizUseGuide) {
    quizUseGuide.addEventListener('click', () => {
      if (!currentItinerary) return;
      setGuideExpanded(true);
      guideItems = currentItinerary.stops.map(({ slot, place }) => ({
        id: place.id, title: place.title, category: place.category,
        location: place.location || '', rating: place.rating || '', slot: slot || null
      }));
      nameInput.value = currentItinerary.name;
      renderDropzone();
      closeQuiz();
      if (quizForm) { quizForm.hidden = false; quizForm.reset(); }
      if (quizResultsEl) quizResultsEl.hidden = true;
    });
  }

  // ── Change Answers ────────────────────────────────────────────
  if (quizRetry) {
    quizRetry.addEventListener('click', () => {
      if (quizForm) quizForm.hidden = false;
      if (quizResultsEl) quizResultsEl.hidden = true;
    });
  }

  // ── Print guide ───────────────────────────────────────────────
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Guest Day Itinerary';
      const guestName = guestNameInput ? guestNameInput.value.trim() : '';
      const planDate = dateInput && dateInput.value ? dateInput.value : '';
      const notes = notesInput ? notesInput.value.trim() : '';
      let rows = '';
      if (guideTemplate === 'time_of_day') {
        const buckets = { morning: [], afternoon: [], evening: [], flexible: [] };
        guideItems.forEach((item) => buckets[getTimeBucket(item)].push(item));
        ['morning', 'afternoon', 'evening', 'flexible'].forEach((key) => {
          if (buckets[key].length === 0) return;
          rows += `<div class="slot-header">${escHtml(TIME_BUCKET_LABELS[key])}</div>`;
          buckets[key].forEach((item) => {
            rows += `<li><strong>${escHtml(item.title)}</strong><span class="badge">${escHtml(item.category)}</span>${item.rating ? `<span class="stars">${escHtml(stars(item.rating))}</span>` : ''}${item.location ? `<div class="loc">&#128205; ${escHtml(item.location)}</div>` : ''}</li>`;
          });
        });
      } else {
        let lastSlot = null;
        guideItems.forEach((item) => {
          if (item.slot && item.slot !== lastSlot) {
            rows += `<div class="slot-header">${escHtml(item.slot)}</div>`;
            lastSlot = item.slot;
          }
          rows += `<li><strong>${escHtml(item.title)}</strong><span class="badge">${escHtml(item.category)}</span>${item.rating ? `<span class="stars">${escHtml(stars(item.rating))}</span>` : ''}${item.location ? `<div class="loc">&#128205; ${escHtml(item.location)}</div>` : ''}</li>`;
        });
      }
      const win = window.open('', '_blank', 'width=640,height=700');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
        <title>${escHtml(name)}</title>
        <style>
          body{font-family:Georgia,serif;padding:40px;max-width:520px;margin:auto;color:#1e293b}
          h1{font-size:1.5rem;margin-bottom:4px}.subtitle{color:#64748b;font-size:.9rem;margin-bottom:20px}
          ol{padding-left:0;list-style:none}li{margin:8px 0 8px 12px;line-height:1.5}
          .slot-header{font-weight:700;color:#0369a1;margin:20px 0 4px;font-size:1rem;border-bottom:1px solid #bfdbfe;padding-bottom:4px}
          .badge{background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:999px;font-size:.78rem;margin-left:6px}
          .stars{color:#f59e0b;margin-left:4px;font-size:.85rem}
          .loc{color:#64748b;font-size:.85rem;margin-top:3px}
          .meta{margin:0 0 8px;color:#334155;font-size:.92rem}
          .notes{margin-top:16px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
          .notes h3{margin:0 0 6px;font-size:1rem;color:#0f172a}
          .notes p{margin:0;color:#475569;white-space:pre-wrap}
          .footer{margin-top:32px;color:#94a3b8;font-size:.78rem;border-top:1px solid #e2e8f0;padding-top:12px}
          @media print{body{padding:20px}}
        </style></head><body>
        <h1>${escHtml(name)}</h1>
        <p class="subtitle">Prepared by your SOVA Scoop concierge team</p>
        ${guestName ? `<p class="meta"><strong>Guest:</strong> ${escHtml(guestName)}</p>` : ''}
        ${planDate ? `<p class="meta"><strong>Date:</strong> ${escHtml(planDate)}</p>` : ''}
        <ol>${rows}</ol>
        ${notes ? `<section class="notes"><h3>Guest Notes</h3><p>${escHtml(notes)}</p></section>` : ''}
        <div class="footer">SOVA Scoop &nbsp;|&nbsp; Printed on ${new Date().toLocaleDateString()}</div>
        </body></html>`);
      win.document.close();
      win.focus();
      win.print();
    });
  }

  // ── Clear guide ───────────────────────────────────────────────
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      guideItems = [];
      nameInput.value = '';
      if (notesInput) notesInput.value = '';
      renderDropzone();
    });
  }

  // ── Init ──────────────────────────────────────────────────────
  if (templateSelect) {
    templateSelect.addEventListener('change', () => {
      guideTemplate = templateSelect.value;
      renderDropzone();
    });
  }
  initChipFilters();
  renderDropzone();
})();
