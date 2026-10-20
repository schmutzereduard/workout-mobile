import {ExerciseDTO, MesocycleDTO, WorkoutTemplateDTO} from "@/types/workout";

export const testExercisesDTO: ExerciseDTO[] = [
    // Chest
    { metadata: { id: 1, clientId: "123", createdAt: "2026-10-18" }, name: 'Barbell Bench Press', notes: 'Chest • Compound', muscleGroups: ['Chest'] },
    { metadata: { id: 2, clientId: "124", createdAt: "2026-10-18" }, name: 'Dumbbell Bench Press', notes: 'Chest • Compound', muscleGroups: ['Chest'] },
    { metadata: { id: 3, clientId: "125", createdAt: "2026-10-18" }, name: 'Incline Dumbbell Press', notes: 'Upper Chest • Compound', muscleGroups: ['Chest'] },
    { metadata: { id: 4, clientId: "126", createdAt: "2026-10-18" }, name: 'Chest Flyes (Cable/Dumbbell)', notes: 'Chest • Isolation', muscleGroups: ['Chest'] },
    { metadata: { id: 5, clientId: "127", createdAt: "2026-10-18" }, name: 'Push-ups', notes: 'Chest • Bodyweight', muscleGroups: ['Chest'] },

    // Back
    { metadata: { id: 6, clientId: "128", createdAt: "2026-10-18" }, name: 'Barbell Deadlift', notes: 'Back / Posterior • Compound', muscleGroups: ['Back'] },
    { metadata: { id: 7, clientId: "129", createdAt: "2026-10-18" }, name: 'Pull-ups', notes: 'Lats / Upper Back • Compound', muscleGroups: ['Back'] },
    { metadata: { id: 8, clientId: "130", createdAt: "2026-10-18" }, name: 'Lat Pulldown', notes: 'Lats • Isolation/Machine', muscleGroups: ['Back'] },
    { metadata: { id: 9, clientId: "131", createdAt: "2026-10-18" }, name: 'Barbell Row', notes: 'Mid Back • Compound', muscleGroups: ['Back'] },
    { metadata: { id: 10, clientId: "132", createdAt: "2026-10-18" }, name: 'Seated Cable Row', notes: 'Mid Back • Compound', muscleGroups: ['Back'] },

    // Legs
    { metadata: { id: 11, clientId: "133", createdAt: "2026-10-18" }, name: 'Barbell Back Squat', notes: 'Quads / Glutes • Compound', muscleGroups: ['Quads'] },
    { metadata: { id: 12, clientId: "134", createdAt: "2026-10-18" }, name: 'Romanian Deadlift (RDL)', notes: 'Hamstrings • Compound', muscleGroups: ['Hamstrings'] },
    { metadata: { id: 13, clientId: "135", createdAt: "2026-10-18" }, name: 'Leg Press', notes: 'Quads • Machine', muscleGroups: ['Quads'] },
    { metadata: { id: 14, clientId: "136", createdAt: "2026-10-18" }, name: 'Bulgarian Split Squat', notes: 'Quads / Glutes • Unilateral', muscleGroups: ['Glutes'] },
    { metadata: { id: 15, clientId: "137", createdAt: "2026-10-18" }, name: 'Standing Calf Raises', notes: 'Calves • Isolation', muscleGroups: ['Calves'] },

    // Shoulders
    { metadata: { id: 16, clientId: "138", createdAt: "2026-10-18" }, name: 'Overhead Press (OHP)', notes: 'Shoulders • Compound', muscleGroups: ['Shoulders'] },
    { metadata: { id: 17, clientId: "139", createdAt: "2026-10-18" }, name: 'Dumbbell Lateral Raises', notes: 'Side Delts • Isolation', muscleGroups: ['Shoulders'] },
    { metadata: { id: 18, clientId: "140", createdAt: "2026-10-18" }, name: 'Face Pulls', notes: 'Rear Delts • Isolation', muscleGroups: ['Shoulders'] },
    { metadata: { id: 19, clientId: "141", createdAt: "2026-10-18" }, name: 'Dumbbell Shoulder Press', notes: 'Shoulders • Compound', muscleGroups: ['Shoulders'] },

    // Arms
    { metadata: { id: 20, clientId: "142", createdAt: "2026-10-18" }, name: 'Barbell Bicep Curl', notes: 'Biceps • Isolation', muscleGroups: ['Biceps'] },
    { metadata: { id: 21, clientId: "143", createdAt: "2026-10-18" }, name: 'Hammer Curls', notes: 'Biceps / Forearms • Isolation', muscleGroups: ['Biceps'] },
    { metadata: { id: 22, clientId: "144", createdAt: "2026-10-18" }, name: 'Tricep Pushdowns', notes: 'Triceps • Isolation', muscleGroups: ['Triceps'] },
    { metadata: { id: 23, clientId: "145", createdAt: "2026-10-18" }, name: 'Skull Crushers', notes: 'Triceps • Isolation', muscleGroups: ['Triceps'] },

    // Core
    { metadata: { id: 24, clientId: "146", createdAt: "2026-10-18" }, name: 'Hanging Leg Raises', notes: 'Abs • Bodyweight', muscleGroups: ['Core'] },
    { metadata: { id: 25, clientId: "147", createdAt: "2026-10-18" }, name: 'Plank', notes: 'Core • Isometric', muscleGroups: ['Core'] },
];

export const testWorkoutTemplatesDTO: WorkoutTemplateDTO[] = [
    {
        metadata: { id: 1, clientId: "201", createdAt: "2026-10-18" },
        name: 'Upper Body A',
        notes: '',
    },
    {
        metadata: { id: 2, clientId: "202", createdAt: "2026-10-18" },
        name: 'Lower Body A',
        notes: 'Quads, Hamstrings & Calves • 4 Exercises'
    },
    {
        metadata: { id: 3, clientId: "203", createdAt: "2026-10-18" },
        name: 'Push Day',
        notes: '',
        templateExercises: [
            {
                clientId: "201124",
                exerciseClientId: "124",
                targetSets: 3,
                exerciseOrder: 1,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201126",
                exerciseClientId: "126",
                targetSets: 3,
                exerciseOrder: 2,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201144",
                exerciseClientId: "144",
                targetSets: 3,
                exerciseOrder: 3,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            }
        ]
    },
    {
        metadata: { id: 4, clientId: "204", createdAt: "2026-10-18" },
        name: 'Pull Day',
        notes: '',
        templateExercises: [
            {
                clientId: "201129",
                exerciseClientId: "129",
                targetSets: 3,
                exerciseOrder: 1,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201131",
                exerciseClientId: "131",
                targetSets: 3,
                exerciseOrder: 2,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201140",
                exerciseClientId: "140",
                targetSets: 3,
                exerciseOrder: 3,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            }
        ]
    },
    {
        metadata: { id: 5, clientId: "205", createdAt: "2026-10-18" },
        name: 'Leg Day',
        notes: '',
        templateExercises: [
            {
                clientId: "201133",
                exerciseClientId: "133",
                targetSets: 3,
                exerciseOrder: 1,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201135",
                exerciseClientId: "135",
                targetSets: 3,
                exerciseOrder: 2,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            },
            {
                clientId: "201137",
                exerciseClientId: "137",
                targetSets: 3,
                exerciseOrder: 3,
                targetRepetitionsMin: 8,
                targetRepetitionsMax: 12
            }
        ]
    },
];

export const testMesocyclesDTO: MesocycleDTO[] = [
    {
        metadata: { id: 1, clientId: "301", createdAt: "2026-10-18" },
        name: 'Hypertrophy Block 1 (4 Weeks)',
        targetWeeks: 4,
        deloadWeek: 4,
        startDate: '2026-10-19',
        endDate: '2026-11-15',
        mesocycleTemplates: [
            // --- Week 1 ---
            { id: 1, mesocycleId: 1, workoutTemplateId: 3, weekNumber: 1, dayNumber: 1 }, // Push Day (Monday)
            { id: 2, mesocycleId: 1, workoutTemplateId: 4, weekNumber: 1, dayNumber: 2 }, // Pull Day (Tuesday)
            { id: 3, mesocycleId: 1, workoutTemplateId: 5, weekNumber: 1, dayNumber: 4 }, // Leg Day (Thursday)

            // --- Week 2 ---
            { id: 4, mesocycleId: 1, workoutTemplateId: 3, weekNumber: 2, dayNumber: 1 }, // Push Day (Monday)
            { id: 5, mesocycleId: 1, workoutTemplateId: 4, weekNumber: 2, dayNumber: 2 }, // Pull Day (Tuesday)
            { id: 6, mesocycleId: 1, workoutTemplateId: 5, weekNumber: 2, dayNumber: 4 }, // Leg Day (Thursday)

            // --- Week 3 ---
            { id: 7, mesocycleId: 1, workoutTemplateId: 3, weekNumber: 3, dayNumber: 1 }, // Push Day (Monday)
            { id: 8, mesocycleId: 1, workoutTemplateId: 4, weekNumber: 3, dayNumber: 2 }, // Pull Day (Tuesday)
            { id: 9, mesocycleId: 1, workoutTemplateId: 5, weekNumber: 3, dayNumber: 4 }, // Leg Day (Thursday)
        ]
    },
    {
        metadata: { id: 2, clientId: "302", createdAt: "2026-10-18" },
        name: 'Strength Peak Block',
        targetWeeks: 2,
        deloadWeek: 2,
        startDate: '2026-11-16',
        endDate: '2026-12-13',
        mesocycleTemplates: [
            // --- Week 1 ---
            { id: 10, mesocycleId: 2, workoutTemplateId: 1, weekNumber: 1, dayNumber: 1 }, // Upper Body A
            { id: 11, mesocycleId: 2, workoutTemplateId: 2, weekNumber: 1, dayNumber: 3 }, // Lower Body A

            // --- Week 2 ---
            { id: 12, mesocycleId: 2, workoutTemplateId: 1, weekNumber: 2, dayNumber: 1 }, // Upper Body A
            { id: 13, mesocycleId: 2, workoutTemplateId: 2, weekNumber: 2, dayNumber: 3 }, // Lower Body A
        ]
    }
];