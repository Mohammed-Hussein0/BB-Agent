// Submission states
window.isSubmitting = false;
window.lastSubmitTime = 0;
window.isElaborating = false;
window.lastElaborateTime = 0;

// Submit workout routine for analysis
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
};

// Elaborate on a specific point
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
};

// Close elaboration detail modal
window.closeElaborationModal = function() {
    document.getElementById('elaboration-modal').classList.add('hidden');
};

// Compile DOM states into JSON payload format
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

// Parse plaintext output from AI backend
function parseAnthropicResponse(text) {
    const scoreMatch = text.match(/Overall Score[:*]*\s*([\d.]+)/i);
    const overall_score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

    const extractSection = (name) => {
        // Matches [Name] block, captures Score and Explanation until the next block or end
        const regex = new RegExp(`\\[${name}\\][\\s\\S]*?Score[:*]*\\s*([\\d.]+)[\\s\\S]*?Explanation[:*]*\\s*([^\\n\\[]+(?:\\n(?!\\[).*)*)`, 'i');
        const match = text.match(regex);
        if (match) {
            return { 
                score: parseFloat(match[1]), 
                explanation: match[2].replace(/\*/g, '').trim() 
            };
        }
        return { score: 0, explanation: "No data provided." };
    };

    return {
        overall_score,
        dimensions: [
            { id: 'coverage', label: 'Coverage', data: extractSection('Coverage') },
            { id: 'volume', label: 'Volume Distribution', data: extractSection('Volume Distribution') },
            { id: 'recovery', label: 'Recovery Spacing', data: extractSection('Recovery Spacing') },
            { id: 'balance', label: 'Push/Pull Balance', data: extractSection('Push/Pull Balance') },
            { id: 'goalFit', label: 'Goal-Fit', data: extractSection('Goal-Fit') }
        ]
    };
}

// Render analysis response in results panel
function renderResults(data) {
    const parsedData = data.analysis ? parseAnthropicResponse(data.analysis) : data;

    const resultsPanel = document.getElementById('results-panel');
    
    // Update Score Ring Animation
    const scoreRing = document.getElementById('score-ring');
    const scoreTag = document.getElementById('score-tag-new');
    
    const score = parsedData.overall_score || 0;
    scoreTag.innerText = score.toFixed(1);
    
    // Circumference is 2 * PI * r = 2 * 3.14159 * 80 = 502
    const circumference = 502;
    const offset = circumference - (circumference * score) / 10;
    scoreRing.style.strokeDashoffset = offset;
    
    // Change color based on score
    if (score <= 5.0) {
        scoreRing.setAttribute('stroke', '#ef4444'); // Red
        scoreTag.className = "text-5xl font-black text-red-500 leading-none";
    } else if (score <= 7.5) {
        scoreRing.setAttribute('stroke', '#f59e0b'); // Amber
        scoreTag.className = "text-5xl font-black text-amber-500 leading-none";
    } else {
        scoreRing.setAttribute('stroke', '#10b981'); // Emerald
        scoreTag.className = "text-5xl font-black text-emerald-500 leading-none";
    }

    // Render Dimension Cards
    const grid = document.getElementById('dimensions-grid');
    grid.innerHTML = parsedData.dimensions.map(dim => {
        let colorClass = "text-emerald-400";
        let borderClass = "border-emerald-500/30";
        let bgClass = "bg-emerald-500/10";
        
        if (dim.data.score <= 5.0) {
            colorClass = "text-red-400";
            borderClass = "border-red-500/30";
            bgClass = "bg-red-500/10";
        } else if (dim.data.score <= 7.5) {
            colorClass = "text-amber-400";
            borderClass = "border-amber-500/30";
            bgClass = "bg-amber-500/10";
        }

        // Ensure quotes don't break the onclick handler
        const safeExplanation = dim.data.explanation.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        return `
            <button onclick="elaboratePoint('${dim.label}: ${safeExplanation}')" class="w-full text-left glass-card p-6 rounded-2xl border ${borderClass} shadow-md bg-slate-900/60 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all flex flex-col fade-in group cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 w-full gap-2">
                    <div class="flex items-center space-x-3">
                        <h4 class="text-xl font-bold text-white font-heading">${dim.label}</h4>
                        <span class="text-[10px] uppercase tracking-wider font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-indigo-500/10 px-2 py-1 rounded">
                            Deep Dive <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </span>
                    </div>
                    <span class="text-3xl font-black ${colorClass}">${dim.data.score}/10</span>
                </div>
                <div class="${bgClass} border ${borderClass} p-5 rounded-xl w-full flex items-start space-x-4 group-hover:bg-opacity-20 transition-all">
                    <svg class="w-6 h-6 shrink-0 mt-0.5 ${colorClass} opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-base text-slate-300 leading-relaxed font-medium">${dim.data.explanation}</p>
                </div>
            </button>
        `;
    }).join('');

    resultsPanel.classList.remove('hidden');
}
