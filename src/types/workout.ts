export interface SyncMetadata {
    id?: number;
    clientId: string;

    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

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

export interface ExerciseDTO {
    metadata: SyncMetadata;
    name: string;
    notes?: string;
    muscleGroups: (MuscleGroupName | string)[];
}

export interface ExerciseSetDTO {
    id?: number;
    setNumber: number;
    weight: number;
    targetRepetitions: number;
    actualRepetitions: number;
    repetitionsInReserve?: number;
}

export interface MesocycleTemplateDTO {
    id?: number;
    mesocycleId: number;
    workoutTemplateId: number;
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
    mesocycleTemplates?: MesocycleTemplateDTO[];
}

export interface TemplateExerciseDTO {
    id?: number;
    clientId?: string;
    workoutTemplateId?: number;
    workoutTemplateClientId?: string;
    exerciseId?: number;
    exerciseClientId?: string;
    exerciseOrder: number;
    targetSets: number;
    targetRepetitionsMin: number;
    targetRepetitionsMax: number;
}

export interface WorkoutExerciseDTO {
    metadata: SyncMetadata;
    orderInWorkout: number;
    targetSets: number;
    targetRepetitionsMin: number;
    targetRepetitionsMax: number;
    notes?: string;
    exerciseSets?: ExerciseSetDTO[];
}

export interface WorkoutDTO {
    metadata: SyncMetadata;
    workoutTemplateId: number;
    name: string;
    notes?: string;
    isDeload: boolean;
    completedAt: string;
    exercises?: WorkoutExerciseDTO[];
}

export interface WorkoutTemplateDTO {
    metadata: SyncMetadata;
    name: string;
    notes?: string;
    // isDeload: boolean;
    templateExercises?: TemplateExerciseDTO[];
}

export interface UserInfoDTO {
    metadata: SyncMetadata;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    heightInCm: number;
    weightInKm: number;
}