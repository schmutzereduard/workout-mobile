import {ExerciseDTO, WorkoutTemplateDTO} from "@/types/workout";

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
        notes: 'Chest, Shoulders & Triceps • 5 Exercises',
    },
    {
        metadata: { id: 2, clientId: "202", createdAt: "2026-10-18" },
        name: 'Lower Body A',
        notes: 'Quads, Hamstrings & Calves • 4 Exercises'
    },
    {
        metadata: { id: 3, clientId: "203", createdAt: "2026-10-18" },
        name: 'Push Day B',
        notes: 'Bench Press, Overhead Press • 5 Exercises'
    },
    {
        metadata: { id: 4, clientId: "204", createdAt: "2026-10-18" },
        name: 'Pull Day A',
        notes: 'Deadlifts, Rows & Pull-ups • 5 Exercises'
    },
    {
        metadata: { id: 5, clientId: "205", createdAt: "2026-10-18" },
        name: 'Leg Day B',
        notes: 'Squats, RDLs & Core • 4 Exercises'
    },
];