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
