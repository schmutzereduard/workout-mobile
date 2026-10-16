export interface SyncMetadata {
    id?: number;
    userId: number;
    clientId: string;

    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface ExerciseDTO {
    metadata: SyncMetadata;
    name: string;
    notes?: string;
}

export interface ExerciseSetDTO {
    id?: number;
    setNumber: number;
    weight: number;
    actualRepetitions: number;
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
    startDate: string;
    endDate: string;
    mesocycleTemplates?: MesocycleTemplateDTO[];
}

export interface TemplateExerciseDTO {
    id?: number;
    workoutTemplateId: number;
    exerciseId: number;
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
    completedAt: string;
    exercises?: WorkoutExerciseDTO[];
}

export interface WorkoutTemplateDTO {
    metadata: SyncMetadata;
    name: string;
    notes?: string;
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