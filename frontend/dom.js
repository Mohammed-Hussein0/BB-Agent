// DOM References
let daysContainer;
let dayTemplate;
let exerciseTemplate;

// Safely initialize DOM references once the page loads
document.addEventListener('DOMContentLoaded', () => {
    daysContainer = document.getElementById('days-container');
    dayTemplate = document.getElementById('day-template');
    exerciseTemplate = document.getElementById('exercise-template');

    // Bootstrap application with some filler days
    const pushDay = window.addDay("Push Day");
    if (pushDay) {
        window.addExercise(pushDay, { name: "Barbell Bench Press", muscle: "chest", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        window.addExercise(pushDay, { name: "Overhead Press (OHP)", muscle: "shoulders", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        window.addExercise(pushDay, { name: "Tricep Rope Pushdown", muscle: "triceps", type: "isolation", sets: "3", reps: "12-15", rpe: "9" });
    }

    const pullDay = window.addDay("Pull Day");
    if (pullDay) {
        window.addExercise(pullDay, { name: "Lat Pulldown", muscle: "back", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        window.addExercise(pullDay, { name: "Barbell Row", muscle: "back", type: "compound", sets: "3", reps: "8-12", rpe: "8" });
        window.addExercise(pullDay, { name: "Incline Dumbbell Curl", muscle: "biceps", type: "isolation", sets: "3", reps: "12-15", rpe: "9" });
    }
});

// Load a predefined routine template into the workspace
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

// Add a Day Card to the DOM
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
};

// Add an Exercise Row to a Day Card
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
};

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
