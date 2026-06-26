// 1. Declare variables globally so all functions can access them
let daysContainer;
let dayTemplate;
let exerciseTemplate;

const EXERCISE_DATABASE = {
    "Barbell Bench Press": { muscle: "chest", type: "compound" },
    "Incline Dumbbell Bench Press": { muscle: "chest", type: "compound" },
    "Cable Crossover": { muscle: "chest", type: "isolation" },
    "Pec Deck Fly": { muscle: "chest", type: "isolation" },
    
    "Lat Pulldown": { muscle: "back", type: "compound" },
    "Barbell Row": { muscle: "back", type: "compound" },
    "Pull-up": { muscle: "back", type: "compound" },
    "Seated Cable Row": { muscle: "back", type: "compound" },
    
    "Overhead Press (OHP)": { muscle: "shoulders", type: "compound" },
    "Dumbbell Lateral Raise": { muscle: "shoulders", type: "isolation" },
    "Face Pulls": { muscle: "shoulders", type: "compound" },
    "Seated Dumbbell Press": { muscle: "shoulders", type: "compound" },
    
    "Barbell Back Squat": { muscle: "quads", type: "compound" },
    "Leg Press": { muscle: "quads", type: "compound" },
    "Leg Extension": { muscle: "quads", type: "isolation" },
    "Bulgarian Split Squat": { muscle: "quads", type: "compound" },
    
    "Romanian Deadlift (RDL)": { muscle: "hamstrings/glutes", type: "compound" },
    "Conventional Deadlift": { muscle: "hamstrings/glutes", type: "compound" },
    "Seated Leg Curl": { muscle: "hamstrings/glutes", type: "isolation" },
    "Barbell Hip Thrust": { muscle: "hamstrings/glutes", type: "compound" },
    
    "Cable Crunch": { muscle: "core", type: "isolation" },
    "Hanging Leg Raise": { muscle: "core", type: "isolation" },
    "Plank": { muscle: "core", type: "isolation", defaultReps: "60s" },
    "Ab Wheel Rollout": { muscle: "core", type: "isolation" },
    
    "Standing Calf Raise": { muscle: "calves", type: "isolation" },
    "Seated Calf Raise": { muscle: "calves", type: "isolation" },
    "Leg Press Calf Raise": { muscle: "calves", type: "isolation" },
    "Seated Wall Sit": { muscle: "quads", type: "compound", defaultReps: "60s" },
    
    "Incline Dumbbell Curl": { muscle: "biceps", type: "isolation" },
    "Barbell Bicep Curl": { muscle: "biceps", type: "isolation" },
    "Tricep Rope Pushdown": { muscle: "triceps", type: "isolation" },
    "Skullcrushers": { muscle: "triceps", type: "isolation" }
};

// 2. Safely initialize DOM references once the page loads
document.addEventListener('DOMContentLoaded', () => {
    daysContainer = document.getElementById('days-container');
    dayTemplate = document.getElementById('day-template');
    exerciseTemplate = document.getElementById('exercise-template');

    // Bootstrap application with some filler days
    const pushDay = addDay("Push Day");
    if (pushDay) {
        addExercise(pushDay, { name: "Barbell Bench Press", muscle: "chest", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        addExercise(pushDay, { name: "Overhead Press (OHP)", muscle: "shoulders", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        addExercise(pushDay, { name: "Tricep Rope Pushdown", muscle: "triceps", type: "isolation", sets: "3", reps: "12-15", rpe: "9" });
    }

    const pullDay = addDay("Pull Day");
    if (pullDay) {
        addExercise(pullDay, { name: "Lat Pulldown", muscle: "back", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        addExercise(pullDay, { name: "Barbell Row", muscle: "back", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        addExercise(pullDay, { name: "Incline Dumbbell Curl", muscle: "biceps", type: "isolation", sets: "3", reps: "12-15", rpe: "9" });
    }
});

// 2.5. Routine Templates Definitions & Loading Logic
const ROUTINE_TEMPLATES = {
    ppl: {
        name: "Push / Pull / Legs (PPL)",
        days: [
            {
                name: "Push Day",
                exercises: [
                    { name: "Barbell Bench Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Overhead Press (OHP)", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Incline Dumbbell Bench Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Tricep Rope Pushdown", sets: "3", reps: "12-15", rpe: "9" }
                ]
            },
            {
                name: "Pull Day",
                exercises: [
                    { name: "Lat Pulldown", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Barbell Row", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Incline Dumbbell Curl", sets: "3", reps: "12-15", rpe: "9" },
                    { name: "Face Pulls", sets: "3", reps: "12-15", rpe: "8" }
                ]
            },
            {
                name: "Leg Day",
                exercises: [
                    { name: "Barbell Back Squat", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Romanian Deadlift (RDL)", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Leg Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Standing Calf Raise", sets: "3", reps: "12-15", rpe: "9" }
                ]
            }
        ]
    },
    upper_lower: {
        name: "Upper / Lower Split",
        days: [
            {
                name: "Upper Day",
                exercises: [
                    { name: "Barbell Bench Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Lat Pulldown", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Seated Dumbbell Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Barbell Row", sets: "3", reps: "8-12", rpe: "8" }
                ]
            },
            {
                name: "Lower Day",
                exercises: [
                    { name: "Barbell Back Squat", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Romanian Deadlift (RDL)", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Bulgarian Split Squat", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Plank", sets: "3", reps: "60s", rpe: "8" }
                ]
            }
        ]
    },
    full_body: {
        name: "Full Body Split",
        days: [
            {
                name: "Full Body A",
                exercises: [
                    { name: "Barbell Back Squat", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Barbell Bench Press", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Lat Pulldown", sets: "3", reps: "8-12", rpe: "8" },
                    { name: "Cable Crunch", sets: "3", reps: "12-15", rpe: "8" }
                ]
            }
        ]
    }
};

window.loadTemplate = function(templateKey) {
    const template = ROUTINE_TEMPLATES[templateKey];
    if (!template) return;

    const hasActiveDays = document.querySelectorAll('.day-card').length > 0;
    if (hasActiveDays) {
        const confirmClear = confirm(`Loading the "${template.name}" template will clear your current workout routine. Do you want to continue?`);
        if (!confirmClear) return;
    }

    // Clear existing days
    daysContainer.innerHTML = "";

    // Set frequency input
    const freqInput = document.getElementById('frequency');
    if (freqInput) {
        freqInput.value = template.days.length;
    }

    // Add days and exercises
    template.days.forEach(day => {
        const container = window.addDay(day.name);
        if (container) {
            day.exercises.forEach(ex => {
                const dbInfo = EXERCISE_DATABASE[ex.name] || {};
                window.addExercise(container, {
                    name: ex.name,
                    muscle: dbInfo.muscle || "",
                    type: dbInfo.type || "compound",
                    sets: ex.sets,
                    reps: ex.reps,
                    rpe: ex.rpe
                });
            });
        }
    });
};

// 3. Exposed global functions that the HTML buttons can call directly
window.addDay = function(dayName = "") {
    if (!dayTemplate || !daysContainer) return null;

    const clone = dayTemplate.content.cloneNode(true);
    const dayCard = clone.querySelector('.day-card');
    
    if (dayName && typeof dayName === 'string') {
        dayCard.querySelector('.day-title').value = dayName;
    }
    
    const targetExercisesContainer = dayCard.querySelector('.exercises-container');
    
    // If called via the HTML button, dayName is an Event object, not a string
    if (typeof dayName !== 'string' || !dayName) {
        window.addExercise(targetExercisesContainer);
    }
    
    daysContainer.appendChild(clone);
    return targetExercisesContainer;
}

window.addExercise = function(container, data = null) {
    if (!exerciseTemplate || !container) return;
    
    const clone = exerciseTemplate.content.cloneNode(true);
    
    const nameInput = clone.querySelector('.ex-name');
    const muscleSelect = clone.querySelector('.ex-muscle');
    const typeSelect = clone.querySelector('.ex-type');
    
    // Disable them visually so it's clear they are inherent properties, not selections
    muscleSelect.setAttribute('disabled', 'true');
    typeSelect.setAttribute('disabled', 'true');
    muscleSelect.classList.add('opacity-50', 'cursor-not-allowed');
    typeSelect.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Auto-fill logic when user selects an exercise
    nameInput.addEventListener('input', (e) => {
        const selected = EXERCISE_DATABASE[e.target.value];
        if (selected) {
            muscleSelect.value = selected.muscle;
            typeSelect.value = selected.type;
        } else {
            // Reset if they type something unknown
            muscleSelect.value = "";
            typeSelect.value = "compound";
        }
    });
    
    if (data && typeof data === 'object') {
        if (data.name) nameInput.value = data.name;
        if (data.muscle) muscleSelect.value = data.muscle;
        if (data.type) typeSelect.value = data.type;
        if (data.sets) clone.querySelector('.ex-sets').value = data.sets;
        if (data.reps) clone.querySelector('.ex-reps').value = data.reps;
        if (data.rpe) clone.querySelector('.ex-rpe').value = data.rpe;
        
        // Hide the 60s option if it's not a plank initially
        const repsSelect = clone.querySelector('.ex-reps');
        if (repsSelect && data.name && !data.name.toLowerCase().includes('plank')) {
            const timeOpt = Array.from(repsSelect.options).find(o => o.value === '60s');
            if (timeOpt) { timeOpt.hidden = true; timeOpt.disabled = true; }
        }
    } else {
        // By default on a new empty row, hide 60s
        const repsSelect = clone.querySelector('.ex-reps');
        if (repsSelect) {
            const timeOpt = Array.from(repsSelect.options).find(o => o.value === '60s');
            if (timeOpt) { timeOpt.hidden = true; timeOpt.disabled = true; }
        }
    }
    
    container.appendChild(clone);
}

// Global listener to dynamically toggle the 60s option when the user types
document.addEventListener('input', (e) => {
    if (e.target && e.target.classList.contains('ex-name')) {
        const row = e.target.closest('.exercise-row');
        if (!row) return;
        const repsSelect = row.querySelector('.ex-reps');
        if (!repsSelect) return;
        
        const isPlank = e.target.value.toLowerCase().includes('plank');
        const timeOpt = Array.from(repsSelect.options).find(o => o.value === '60s');
        
        if (timeOpt) {
            timeOpt.hidden = !isPlank;
            timeOpt.disabled = !isPlank;
            if (!isPlank && repsSelect.value === '60s') {
                repsSelect.value = '8-12';
            }
        }
    }
});

window.isSubmitting = false;
window.lastSubmitTime = 0;

window.submitRoutine = async function() {
    if (window.isSubmitting) {
        alert("Please wait for the current analysis to complete.");
        return;
    }
    
    const now = Date.now();
    if (window.lastSubmitTime && now - window.lastSubmitTime < 10000) {
        const remaining = Math.ceil((10000 - (now - window.lastSubmitTime)) / 1000);
        alert(`Please wait ${remaining} seconds before submitting again to avoid rate limits.`);
        return;
    }

    // 1. Validate all inputs before doing anything
    let hasError = false;
    const rows = document.querySelectorAll('.exercise-row');
    
    // Clear any previous error styling
    rows.forEach(r => r.classList.remove('border', 'border-red-500'));
    
    rows.forEach(row => {
        const name = row.querySelector('.ex-name').value.trim();
        const muscle = row.querySelector('.ex-muscle').value; // Might be empty string "" if "Muscle..." is selected
        const setsVal = row.querySelector('.ex-sets').value.trim();
        const repsVal = row.querySelector('.ex-reps').value.trim();
        const rpeVal = row.querySelector('.ex-rpe').value.trim();
        
        let rowHasError = false;

        // Check for missing required data
        if (!name || !muscle || !setsVal || !repsVal) {
            rowHasError = true;
        }

        // Sets must be a positive integer
        const setsNum = parseInt(setsVal);
        if (setsVal && (isNaN(setsNum) || setsNum <= 0)) {
            rowHasError = true;
        }

        // Reps could be "8-12" or "60s", just make sure it doesn't start with a minus
        if (repsVal && repsVal.startsWith('-')) {
            rowHasError = true;
        }

        // RPE (if provided) must be between 1 and 10
        if (rpeVal) {
            const rpeNum = parseFloat(rpeVal);
            if (isNaN(rpeNum) || rpeNum < 0 || rpeNum > 10) {
                rowHasError = true;
            }
        }
        
        if (rowHasError) {
            hasError = true;
            row.classList.add('border', 'border-red-500'); // Highlight the problematic row
        }
    });

    if (hasError) {
        alert("Hold up! Some exercises have invalid data. Ensure all names/muscles are filled, sets are positive, reps aren't negative, and RPE is between 0 and 10.");
        return;
    }

    const payload = compilePayload();
    console.log("Compiled Payload for Backend:", JSON.stringify(payload, null, 2));

    const loading = document.getElementById('loading');
    const resultsPanel = document.getElementById('results-panel');
    
    loading.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    
    window.isSubmitting = true;

    try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Backend server offline.');
        const data = await response.json();
        renderResults(data);

    } catch (err) {
        console.error("Connection failed or backend returned an error:", err);
        alert("We weren't able to connect to the server or the Anthropic API. Please try again later.");
    } finally {
        loading.classList.add('hidden');
        window.isSubmitting = false;
        window.lastSubmitTime = Date.now();
    }
}

// 5. Exercise Picker Modal Logic
let currentExerciseInput = null;
let currentDayContainer = null;
let currentModalFilter = 'all';

window.openExerciseModalForDay = function(container) {
    currentDayContainer = container;
    currentExerciseInput = null;
    document.getElementById('exercise-modal').classList.remove('hidden');
    document.getElementById('modal-search').value = "";
    setModalFilter('all', document.querySelector('.modal-filter-btn'));
}

window.openExerciseModal = function(btn) {
    currentExerciseInput = btn.previousElementSibling;
    currentDayContainer = null;
    document.getElementById('exercise-modal').classList.remove('hidden');
    document.getElementById('modal-search').value = "";
    setModalFilter('all', document.querySelector('.modal-filter-btn'));
}

window.closeExerciseModal = function() {
    document.getElementById('exercise-modal').classList.add('hidden');
}

window.setModalFilter = function(filter, btnElement) {
    currentModalFilter = filter;
    
    document.querySelectorAll('.modal-filter-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'active-filter');
        b.classList.add('bg-slate-800', 'text-slate-300');
    });
    if (btnElement) {
        btnElement.classList.remove('bg-slate-800', 'text-slate-300');
        btnElement.classList.add('bg-indigo-600', 'text-white', 'active-filter');
    }
    
    filterModal();
}

window.filterModal = function() {
    const searchVal = document.getElementById('modal-search').value.toLowerCase();
    const grid = document.getElementById('modal-grid');
    grid.innerHTML = '';
    
    let hasResults = false;
    
    for (const [name, data] of Object.entries(EXERCISE_DATABASE)) {
        if (currentModalFilter !== 'all' && data.muscle !== currentModalFilter) continue;
        if (searchVal && !name.toLowerCase().includes(searchVal)) continue;
        
        hasResults = true;
        const btn = document.createElement('button');
        btn.className = "text-left bg-slate-800/50 hover:bg-indigo-600/30 border border-slate-700/50 hover:border-indigo-500/50 p-3 rounded-lg transition-colors flex flex-col";
        btn.innerHTML = `
            <span class="font-bold text-slate-200">${name}</span>
            <span class="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">${data.muscle} • ${data.type}</span>
        `;
        btn.onclick = () => {
            if (currentExerciseInput) {
                currentExerciseInput.value = name;
                
                // Automatically fill out sets/reps to match default if it's an isometric exercise
                const row = currentExerciseInput.closest('.exercise-row');
                if (row && data.defaultReps) {
                    const repsInput = row.querySelector('.ex-reps');
                    if (repsInput) repsInput.value = data.defaultReps;
                }
                
                currentExerciseInput.dispatchEvent(new Event('input'));
                closeExerciseModal();
            } else if (currentDayContainer) {
                addExercise(currentDayContainer, { name: name, muscle: data.muscle, type: data.type, sets: "3", reps: data.defaultReps || "8-12", rpe: "8" });
                
                // Visual feedback that doesn't close the modal
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<span class="font-bold text-emerald-400">Added to Day!</span>`;
                btn.classList.add('border-emerald-500');
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('border-emerald-500');
                }, 800);
            }
        };
        grid.appendChild(btn);
    }
    
    if (searchVal && !hasResults) {
        const btn = document.createElement('button');
        btn.className = "text-left bg-slate-800/50 hover:bg-emerald-600/30 border border-slate-700/50 hover:border-emerald-500/50 p-3 rounded-lg transition-colors flex flex-col sm:col-span-2";
        btn.innerHTML = `
            <span class="font-bold text-emerald-400">Use custom exercise: "${searchVal}"</span>
            <span class="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">Will be mapped to Unknown/Compound</span>
        `;
        btn.onclick = () => {
            if (currentExerciseInput) {
                currentExerciseInput.value = searchVal;
                currentExerciseInput.dispatchEvent(new Event('input'));
                closeExerciseModal();
            } else if (currentDayContainer) {
                addExercise(currentDayContainer, { name: searchVal, muscle: "", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
                
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<span class="font-bold text-emerald-400">Added Custom to Day!</span>`;
                btn.classList.add('border-emerald-500');
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('border-emerald-500');
                }, 800);
            }
        };
        grid.appendChild(btn);
    }
}

// 4. Internal Helper Functions
function compilePayload() {
    const payload = {
        routine_name: "User Workout Routine",
        days_per_week: parseInt(document.getElementById('frequency').value) || 0,
        goal: document.getElementById('goal').value,
        sessions: []
    };

    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        const dayName = card.querySelector('.day-title').value || "Unnamed Day";
        const dayData = { session_name: dayName, exercises: [] };

        const rows = card.querySelectorAll('.exercise-row');
        rows.forEach(row => {
            dayData.exercises.push({
                name: row.querySelector('.ex-name').value || "Unknown Exercise",
                muscle_group: row.querySelector('.ex-muscle').value || "Unknown",
                type: row.querySelector('.ex-type').value || "compound",
                sets: parseInt(row.querySelector('.ex-sets').value) || 0,
                reps: row.querySelector('.ex-reps').value || "8-12" // keep as string to preserve ranges like "8-12"
            });
        });
        payload.sessions.push(dayData);
    });

    return payload;
}

function parseAnthropicResponse(text) {
    // Make regex robust against markdown like **Overall Score:** 7/10
    const scoreMatch = text.match(/Overall Score[:*]*\s*([\d.]+)/i);
    const overall_score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

    let critical_flaws = [];
    const issuesMatch = text.match(/Issues[:*]*\s*([\s\S]*?)(?:Fixes:|$)/i);
    if (issuesMatch) {
        critical_flaws = issuesMatch[1].split(/\n/).map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(s => s.length > 5);
    }

    let required_adjustments = [];
    const fixesMatch = text.match(/Fixes[:*]*\s*([\s\S]*)$/i);
    if (fixesMatch) {
        required_adjustments = fixesMatch[1].split(/\n/).map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(s => s.length > 5);
    }

    if (critical_flaws.length === 0) critical_flaws = ["No critical issues detected. The routine structure looks solid."];
    if (required_adjustments.length === 0) required_adjustments = ["No required adjustments based on the current data."];

    return { overall_score, critical_flaws, required_adjustments };
}

function renderResults(data) {
    // If backend returned raw text in data.analysis, parse it. Otherwise assume mock data.
    const parsedData = data.analysis ? parseAnthropicResponse(data.analysis) : data;

    const resultsPanel = document.getElementById('results-panel');
    document.getElementById('score-tag').innerText = parsedData.overall_score;
    
    const flawsList = document.getElementById('flaws-list');
    const adjustmentsList = document.getElementById('adjustments-list');
    
    flawsList.innerHTML = parsedData.critical_flaws.map(f => `
        <li class="mb-2 list-none">
            <button onclick="elaboratePoint(this.querySelector('span.point-text').innerText)" class="text-left text-slate-300 hover:text-indigo-300 transition-colors bg-slate-800/30 p-3 rounded-lg border border-transparent hover:border-indigo-500/30 w-full group relative">
                <span class="point-text block pr-4">${f}</span>
                <span class="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2 block font-semibold">Click for AI deep dive →</span>
            </button>
        </li>
    `).join('');
    
    adjustmentsList.innerHTML = parsedData.required_adjustments.map(a => `
        <li class="mb-2 list-none">
            <button onclick="elaboratePoint(this.querySelector('span.point-text').innerText)" class="text-left text-slate-300 hover:text-emerald-300 transition-colors bg-emerald-900/10 p-3 rounded-lg border border-transparent hover:border-emerald-500/30 w-full group relative">
                <span class="point-text block pr-4">${a}</span>
                <span class="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mt-2 block font-semibold">Click for AI deep dive →</span>
            </button>
        </li>
    `).join('');
    
    resultsPanel.classList.remove('hidden');
}

// 6. Elaboration Logic
window.isElaborating = false;
window.lastElaborateTime = 0;

window.elaboratePoint = async function(pointStr) {
    if (window.isElaborating) {
        alert("Please wait for the current elaboration to complete.");
        return;
    }
    
    const now = Date.now();
    if (window.lastElaborateTime && now - window.lastElaborateTime < 10000) {
        const remaining = Math.ceil((10000 - (now - window.lastElaborateTime)) / 1000);
        alert(`Please wait ${remaining} seconds before asking again to avoid rate limits.`);
        return;
    }

    document.getElementById('elaboration-modal').classList.remove('hidden');
    document.getElementById('elaboration-title').innerText = pointStr;
    document.getElementById('elaboration-loading').classList.remove('hidden');
    document.getElementById('elaboration-content').classList.add('hidden');
    document.getElementById('elaboration-content').innerHTML = "";
    
    window.isElaborating = true;

    try {
        const response = await fetch('http://127.0.0.1:8000/elaborate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                routine: compilePayload(),
                point: pointStr
            })
        });

        if (!response.ok) throw new Error('Backend failed');
        const data = await response.json();
        
        document.getElementById('elaboration-loading').classList.add('hidden');
        document.getElementById('elaboration-content').classList.remove('hidden');
        
        // Basic Markdown Parser
        let rawText = data.elaboration;
        
        // Convert headers or bold intros to emphasized text
        rawText = rawText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-extrabold text-lg">$1</strong>');
        
        // Convert bullet points
        rawText = rawText.replace(/^[-*]\s+(.*)$/gim, '<li class="ml-5 mb-2 list-disc marker:text-indigo-500">$1</li>');
        
        const formattedHtml = rawText.split('\\n\\n').map(block => {
            if (block.includes('<li')) {
                return `<ul class="mb-5 space-y-1">${block}</ul>`;
            }
            return `<p class="mb-5 text-slate-300">${block.replace(/\\n/g, '<br>')}</p>`;
        }).join('');
        
        document.getElementById('elaboration-content').innerHTML = formattedHtml;
    } catch (e) {
        console.error("Elaboration failed:", e);
        document.getElementById('elaboration-loading').classList.add('hidden');
        document.getElementById('elaboration-content').classList.remove('hidden');
        document.getElementById('elaboration-content').innerHTML = `<p class="text-red-400">We weren't able to connect to the server or the Anthropic API. Please try again later.</p>`;
    } finally {
        window.isElaborating = false;
        window.lastElaborateTime = Date.now();
    }
}

window.closeElaborationModal = function() {
    document.getElementById('elaboration-modal').classList.add('hidden');
}

// 7. Inline Autocomplete & Dropdown Event Listeners
document.addEventListener('input', (e) => {
    if (e.target && e.target.classList.contains('ex-name')) {
        const query = e.target.value.trim().toLowerCase();
        const container = e.target.closest('.relative');
        if (!container) return;
        const dropdown = container.querySelector('.autocomplete-dropdown');
        if (!dropdown) return;

        if (!query) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            return;
        }

        // Filter EXERCISE_DATABASE for matches
        const matches = Object.keys(EXERCISE_DATABASE).filter(name => 
            name.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            dropdown.classList.add('hidden');
            dropdown.innerHTML = '';
            return;
        }

        // Render matching suggestion buttons
        dropdown.innerHTML = matches.map(name => {
            const data = EXERCISE_DATABASE[name];
            return `
                <button type="button" class="w-full text-left px-4 py-2 hover:bg-indigo-600/40 text-slate-200 text-sm border-b border-slate-800/40 last:border-0 block transition-colors focus:outline-none" data-name="${name}">
                    <div class="font-semibold">${name}</div>
                    <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">${data.muscle} • ${data.type}</div>
                </button>
            `;
        }).join('');
        dropdown.classList.remove('hidden');
    }
});

document.addEventListener('click', (e) => {
    // Check if clicked inside a suggestion button
    const btn = e.target.closest('.autocomplete-dropdown button');
    if (btn) {
        const name = btn.getAttribute('data-name');
        const container = btn.closest('.relative');
        const input = container.querySelector('.ex-name');
        const dropdown = container.querySelector('.autocomplete-dropdown');
        
        if (input && name) {
            input.value = name;
            // Dispatch input event so the listener updates muscle/type/default-reps
            input.dispatchEvent(new Event('input', { bubbles: true }));
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }
        return;
    }

    // Hide all suggestion dropdowns if clicked outside the name field
    if (e.target && !e.target.classList.contains('ex-name')) {
        document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.add('hidden'));
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.autocomplete-dropdown').forEach(d => d.classList.add('hidden'));
    }
});