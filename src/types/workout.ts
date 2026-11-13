export type MuscleGroupName =
    | 'Back'
    | 'Chest'
    | 'Shoulders'
    | 'Biceps'
    | 'Triceps'
    | 'Forearms'
    | 'Core'
    | 'Glutes'
    | 'Quads'
    | 'Hamstrings'
    | 'Calves';

export type ExerciseSetType =
    | 'Warmup'
    | 'Working';

export type UserGender =
    | 'Male'
    | 'Female';

export type WeightUnit =
    | 'kg'
    | 'lbs';

export interface SyncMetadata {
    id?: number;
    clientId: string;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface ExerciseDTO {
    metadata: SyncMetadata;
    name: string;
    variation?: string;
    notes?: string;
    muscleGroups: MuscleGroupName[];
}

export interface ExerciseSetDTO {
    id?: number;
    setNumber: number;
    setType: ExerciseSetType;
    weight: number;
    targetRepetitions: number;
    actualRepetitions: number;
    repetitionsInReserve?: number;
}

export interface MesocycleTemplateDTO {
    id?: number;
    clientId: string;
    mesocycleId?: number;
    mesocycleClientId: string;
    workoutTemplateId?: number;
    workoutTemplateClientId: string;
    weekNumber: number;
    dayNumber: number;
}

export interface MesocycleDTO {
    metadata: SyncMetadata;
    name: string;
    targetWeeks: number;
    deloadWeek: number;
    startDate: string;
    endDate: string;
    mesocycleTemplates: MesocycleTemplateDTO[];
}

export interface TemplateExerciseDTO {
    id?: number;
    clientId: string;
    workoutTemplateId?: number;
    workoutTemplateClientId: string;
    exerciseId?: number;
    exerciseClientId: string;
    exerciseOrder: number;
    warmupSets?: number;
    targetSets: number;
    targetRepetitionsMin: number;
    targetRepetitionsMax: number;
}

export interface WorkoutExerciseDTO {
    id?: number;
    workoutId?: number;
    workoutClientId: string;
    exerciseId?: number;
    exerciseClientId: string;
    orderInWorkout: number;
    targetSets: number;
    targetRepetitionsMin: number;
    targetRepetitionsMax: number;
    notes?: string;
    exerciseSets: ExerciseSetDTO[];
}

export interface WorkoutDTO {
    metadata: SyncMetadata;
    mesocycleId?: number;
    mesocycleClientId?: string;
    workoutTemplateId?: number;
    workoutTemplateClientId: string;
    name: string;
    notes?: string;
    isDeload: boolean;
    startedAt: string;
    completedAt: string;
    exercises: WorkoutExerciseDTO[];
}

export interface WorkoutTemplateDTO {
    metadata: SyncMetadata;
    name: string;
    notes?: string;
    templateExercises: TemplateExerciseDTO[];
}

export interface UserProfileDTO {
    metadata: SyncMetadata;
    firstName: string;
    lastName: string;
    gender: UserGender;
    dateOfBirth: string;
    heightInCm: number;
    weightInKg: number;
}

export interface UserPreferencesDTO {
    metadata: SyncMetadata;
    weightUnit: WeightUnit;
    progressiveOverloadIncrement: number;
    deloadVolumePercentage: number;
    deloadIntensityPercentage: number;
    backgroundColor: string;
    accentColor: string;
}