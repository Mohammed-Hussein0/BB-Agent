// Modal state variables
let currentExerciseInput = null;
let currentDayContainer = null;
let currentModalFilter = 'all';

// Open exercise picker modal to add an exercise directly to a session card
window.openExerciseModalForDay = function(container) {
    currentDayContainer = container;
    currentExerciseInput = null;
    document.getElementById('exercise-modal').classList.remove('hidden');
    document.getElementById('modal-search').value = "";
    window.setModalFilter('all', document.querySelector('.modal-filter-btn'));
};

// Open exercise picker modal to assign name to a specific input row
window.openExerciseModal = function(btn) {
    currentExerciseInput = btn.previousElementSibling;
    currentDayContainer = null;
    document.getElementById('exercise-modal').classList.remove('hidden');
    document.getElementById('modal-search').value = "";
    window.setModalFilter('all', document.querySelector('.modal-filter-btn'));
};

// Close exercise picker modal
window.closeExerciseModal = function() {
    document.getElementById('exercise-modal').classList.add('hidden');
};

// Filter exercise list category (chest, back, shoulders, etc.)
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
    
    window.filterModal();
};

// Perform filtering in the modal grid list based on category and search query
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
            <span class="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">${data.muscle}</span>
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
                window.closeExerciseModal();
            } else if (currentDayContainer) {
                window.addExercise(currentDayContainer, { name: name, muscle: data.muscle, type: data.type, sets: "3", reps: data.defaultReps || "8-12", rpe: "8" });
                
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
                window.closeExerciseModal();
            } else if (currentDayContainer) {
                window.addExercise(currentDayContainer, { name: searchVal, muscle: "", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
                
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
};

// Inline Autocomplete & Dropdown Event Listeners
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
                    <div class="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">${data.muscle}</div>
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
