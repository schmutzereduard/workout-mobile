import {createMMKV} from 'react-native-mmkv';
import {
    ExerciseDTO,
    MesocycleDTO,
    MesocycleTemplateDTO,
    SyncMetadata,
    UserPreferencesDTO, UserProfileDTO,
    WorkoutDTO,
    WorkoutExerciseDTO,
    WorkoutTemplateDTO
} from "@/types/workout";

export const StorageKeys = {
    AUTH_TOKEN: 'auth_token',
    USER_PROFILE: 'user_profile',
    USER_PREFERENCES: 'user_preferences',
    EXERCISES: "exercises",
    WORKOUT_TEMPLATES: "workout_templates",
    MESOCYCLE_TEMPLATES: "mesocycle_templates",
    WORKOUTS: "workouts",
    MESOCYCLES: 'mesocycles',
    LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
} as const;

export const storage = createMMKV();

export class WorkoutUtils {

    static getExercises(): ExerciseDTO[] {
        const exercises = storage.getString(StorageKeys.EXERCISES);
        if (!exercises)
            return [];

        const parsed: ExerciseDTO[] = JSON.parse(exercises);
        return parsed.filter(exercise => !exercise.metadata.deletedAt);
    };

    static getExercisesIncludingDeleted(): ExerciseDTO[] {
        const exercises = storage.getString(StorageKeys.EXERCISES);
        if (!exercises)
            return [];

        return JSON.parse(exercises);
    };

    static getExercise(exerciseClientId: string): ExerciseDTO | null {

        return this.getExercises().find(exercise => exercise.metadata.clientId === exerciseClientId && !exercise.metadata.deletedAt) || null;
    };

    static addExercise(exercise: ExerciseDTO): void {
        const metadata: SyncMetadata = {
            ...exercise.metadata,
            createdAt: new Date().toISOString()
        }
        const newExercise: ExerciseDTO = {
            ...exercise,
            metadata: metadata
        }
        const exercises = this.getExercises();
        const newExercises = [...exercises, newExercise];
        storage.set(StorageKeys.EXERCISES, JSON.stringify(newExercises));
    };

    static editExercise(exercise: ExerciseDTO): void {

        const exercises = this.getExercises();
        const existing = exercises.find(ex => ex.metadata.clientId === exercise.metadata.clientId);
        if (!existing)
            return;

        if (!hasObjectChanged(existing, exercise))
            return;

        const metadata: SyncMetadata = {
            ...exercise.metadata,
            updatedAt: new Date().toISOString()
        }
        const updatedExercise: ExerciseDTO = {
            ...exercise,
            metadata: metadata
        }
        const newExercises = exercises.map(
            existing => existing.metadata.clientId === updatedExercise.metadata.clientId ? updatedExercise : existing);
        storage.set(StorageKeys.EXERCISES, JSON.stringify(newExercises));
    };

    static deleteExercises(exercisesIds: string[]): void {
        const newExercises = this.getExercises().map(existing => {
            if (exercisesIds.includes(existing.metadata.clientId)) {
                return {
                    ...existing,
                    metadata: {
                        ...existing.metadata,
                        deletedAt: new Date().toISOString()
                    },
                    name: existing.name + " (Deleted)"
                };
            }
            return existing;
        });

        storage.set(StorageKeys.EXERCISES, JSON.stringify(newExercises));
    };

    static getWorkoutTemplates(): WorkoutTemplateDTO[] {
        const workoutTemplates = storage.getString(StorageKeys.WORKOUT_TEMPLATES);
        if (!workoutTemplates)
            return [];

        const parsed: WorkoutTemplateDTO[] = JSON.parse(workoutTemplates);
        return parsed.filter(workoutTemplate => !workoutTemplate.metadata.deletedAt);
    };

    static getWorkoutTemplatesIncludingDeleted(): WorkoutTemplateDTO[] {
        const workoutTemplates = storage.getString(StorageKeys.WORKOUT_TEMPLATES);
        if (!workoutTemplates)
            return [];

        return JSON.parse(workoutTemplates);
    };

    static getWorkoutTemplate(workoutTemplateClientId: string): WorkoutTemplateDTO | null {
        return this.getWorkoutTemplates().find(workoutTemplate => workoutTemplate.metadata.clientId === workoutTemplateClientId && !workoutTemplate.metadata.deletedAt) || null;
    };

    static addWorkoutTemplate(workoutTemplate: WorkoutTemplateDTO): void {
        const metadata: SyncMetadata = {
            ...workoutTemplate.metadata,
            createdAt: new Date().toISOString()
        }
        const newWorkoutTemplate: WorkoutTemplateDTO = {
            ...workoutTemplate,
            metadata: metadata
        }
        const workoutTemplates = this.getWorkoutTemplates();
        const newWorkoutTemplates = [...workoutTemplates, newWorkoutTemplate];
        storage.set(StorageKeys.WORKOUT_TEMPLATES, JSON.stringify(newWorkoutTemplates));
    };

    static editWorkoutTemplate(workoutTemplate: WorkoutTemplateDTO): void {

        const workoutTemplates = this.getWorkoutTemplates();
        const existing = workoutTemplates.find(wt => wt.metadata.clientId === workoutTemplate.metadata.clientId);
        if (!existing)
            return;

        if (!hasObjectChanged(existing, workoutTemplate))
            return;

        const metadata: SyncMetadata = {
            ...workoutTemplate.metadata,
            updatedAt: new Date().toISOString()
        }
        const updatedWorkoutTemplate: WorkoutTemplateDTO = {
            ...workoutTemplate,
            metadata: metadata
        }
        const newWorkoutTemplates = workoutTemplates.map(
            existing => existing.metadata.clientId === updatedWorkoutTemplate.metadata.clientId ? updatedWorkoutTemplate : existing);
        storage.set(StorageKeys.WORKOUT_TEMPLATES, JSON.stringify(newWorkoutTemplates));
    };

    static deleteWorkoutTemplates(workoutTemplateIds: string[]): void {
        const newWorkoutTemplates = this.getWorkoutTemplatesIncludingDeleted().map(existing => {
            if (workoutTemplateIds.includes(existing.metadata.clientId)) {
                return {
                    ...existing,
                    metadata: {
                        ...existing.metadata,
                        deletedAt: new Date().toISOString()
                    },
                    name: existing.name + " (Deleted)"
                };
            }
            return existing;
        });

        storage.set(StorageKeys.WORKOUT_TEMPLATES, JSON.stringify(newWorkoutTemplates));
    };

    static getMesocycles(): MesocycleDTO[] {

        const mesocycles = storage.getString(StorageKeys.MESOCYCLES);
        if (!mesocycles)
            return [];

        return JSON.parse(mesocycles);
    };

    static getMesocycle(mesocycleClientId: string): MesocycleDTO | null {
        return this.getMesocycles().find(mesocycle => mesocycle.metadata.clientId === mesocycleClientId) || null;
    };

    static getWorkouts(): WorkoutDTO[] {

        const workouts = storage.getString(StorageKeys.WORKOUTS);
        if (!workouts)
            return [];

        return JSON.parse(workouts);
    };

    static getWorkoutsByWorkoutTemplate(workoutTemplateClientId: string): WorkoutDTO[] {

        return this.getWorkouts().filter(workout => workout.workoutTemplateClientId === workoutTemplateClientId);
    }

    static getWorkout(workoutClientId: string): WorkoutDTO | null {
        return this.getWorkouts().find(workout => workout.metadata.clientId === workoutClientId) || null;
    };

    static addWorkout(workout: WorkoutDTO): void {
        const metadata: SyncMetadata = {
            ...workout.metadata,
            createdAt: new Date().toISOString()
        }
        const newWorkout: WorkoutDTO = {
            ...workout,
            metadata: metadata
        }
        const workouts = this.getWorkouts();
        const newWorkouts = [...workouts, newWorkout];
        storage.set(StorageKeys.WORKOUTS, JSON.stringify(newWorkouts));
    };

    static getWorkoutByDate(date: string): WorkoutDTO | null {
        const workouts = this.getWorkouts();
        if (!workouts) return null;

        return workouts.find(workout => {
            if (!workout.completedAt) return false;

            const workoutDateOnly = workout.completedAt.split('T')[0];

            return workoutDateOnly === date;
        }) || null;
    };

    static getWorkoutExercises(workoutClientId: string): WorkoutExerciseDTO[] {
        return this.getWorkouts().find(workout => workout.metadata.clientId === workoutClientId)?.exercises || [];
    };

    static getMesocycleTemplates(): MesocycleTemplateDTO[] {

        const mesocycleTemplates = storage.getString(StorageKeys.MESOCYCLE_TEMPLATES);
        if (!mesocycleTemplates)
            return [];

        return JSON.parse(mesocycleTemplates);
    };

    static getMesocycleTemplate(mesocycleTemplateClientId: string): MesocycleTemplateDTO | null {
        return this.getMesocycleTemplates().find(mesocycleTemplate => mesocycleTemplate.clientId === mesocycleTemplateClientId) || null;
    };

    static getActiveMesocycle(): MesocycleDTO | null {
        const todayDate = new Date().toISOString().split('T')[0];
        const mesocycles = this.getMesocycles();

        if (!mesocycles || mesocycles.length === 0) {
            return null;
        }

        const currentMesocycle = mesocycles.find(
            mesocycleDTO => todayDate >= mesocycleDTO.startDate && todayDate <= mesocycleDTO.endDate
        );

        if (currentMesocycle) {
            return currentMesocycle;
        }

        const upcomingMesocycles = mesocycles
            .filter(mesocycleDTO => mesocycleDTO.startDate > todayDate)
            .sort((a, b) => a.startDate.localeCompare(b.startDate));

        return upcomingMesocycles.length > 0 ? upcomingMesocycles[0] : null;
    };

    static getCompletedWorkoutsInMesocycle(mesocycleClientId: string): WorkoutDTO[] {

        const mesocycle = this.getMesocycle(mesocycleClientId);
        if (!mesocycle)
            return [];

        return this.getWorkouts().filter(workout => workout.completedAt >= mesocycle.startDate && workout.completedAt <= mesocycle.endDate);
    };

    static getOrderedRemainingMesocycleTemplatesInActiveMesocycle(): MesocycleTemplateDTO[] {
        const activeMesocycle = this.getActiveMesocycle();
        if (!activeMesocycle || !activeMesocycle.mesocycleTemplates) {
            return [];
        }

        const completedWorkouts = this.getCompletedWorkoutsInMesocycle(activeMesocycle.metadata.clientId);

        const completedCounts = new Map<string, number>();
        completedWorkouts.forEach(w => {
            const key = w.workoutTemplateClientId;
            if (key) {
                completedCounts.set(key, (completedCounts.get(key) || 0) + 1);
            }
        });

        const encounteredCounts = new Map<string, number>();

        return activeMesocycle.mesocycleTemplates
            .filter(mesoTemp => {
                if (!mesoTemp) return false;

                const key = mesoTemp.workoutTemplateClientId || mesoTemp.workoutTemplateId?.toString();
                if (!key) return true;

                const totalCompleted = completedCounts.get(key) || 0;
                const currentCount = encounteredCounts.get(key) || 0;

                if (currentCount < totalCompleted) {
                    encounteredCounts.set(key, currentCount + 1);
                    return false; // Already done
                }

                encounteredCounts.set(key, currentCount + 1);
                return true;
            })
            .sort((a, b) => {
                if (a.weekNumber !== b.weekNumber) {
                    return a.weekNumber - b.weekNumber;
                }
                return (a.dayNumber || 0) - (b.dayNumber || 0);
            });
    };

    static addMesocycle(mesocycle: MesocycleDTO): void {

        const metadata: SyncMetadata = {
            ...mesocycle.metadata,
            createdAt: new Date().toISOString()
        }
        const newMesocycle: MesocycleDTO = {
            ...mesocycle,
            metadata: metadata
        }
        const mesocycles = this.getMesocycles();
        const newMesocycles = [...mesocycles, newMesocycle];
        storage.set(StorageKeys.MESOCYCLES, JSON.stringify(newMesocycles));
    };

    static editMesocycle(mesocycle: MesocycleDTO): void {

        const mesocycles = this.getMesocycles();
        const existing = mesocycles.find(meso => meso.metadata.clientId === mesocycle.metadata.clientId);
        if (!existing)
            return;

        if (!hasObjectChanged(existing, mesocycle))
            return;

        const metadata: SyncMetadata = {
            ...mesocycle.metadata,
            updatedAt: new Date().toISOString()
        }
        const updatedMesocycle: MesocycleDTO = {
            ...mesocycle,
            metadata: metadata
        }
        const newMesocycles = mesocycles.map(
            existing => existing.metadata.clientId === updatedMesocycle.metadata.clientId ? updatedMesocycle : existing);
        storage.set(StorageKeys.MESOCYCLES, JSON.stringify(newMesocycles));
    };
}

export class UserUtils {

    static getUserPreferences(): UserPreferencesDTO | null {
        const preferences = storage.getString(StorageKeys.USER_PREFERENCES);
        if (!preferences)
            return null;

        return JSON.parse(preferences);
    };

    static updateUserPreferences(preferences: UserPreferencesDTO): void {

        const currentPreferences = this.getUserPreferences();
        if (!currentPreferences)
            return

        if (!hasObjectChanged(currentPreferences, preferences))
            return;

        const currentMetdata = currentPreferences.metadata;
        const updatedMetadata = {
            ...currentMetdata,
            updatedAt: new Date().toISOString()
        };

        const updatedPreferences = {
            ...preferences,
            metadata: updatedMetadata
        };

        storage.set(StorageKeys.USER_PREFERENCES, JSON.stringify(updatedPreferences));
    };

    static getUserProfile(): UserProfileDTO | null {
        const profile = storage.getString(StorageKeys.USER_PROFILE);
        if (!profile)
            return null;

        return JSON.parse(profile);
    };

    static updateUserProfile(profile: UserProfileDTO): void {

        const currentProfile = this.getUserProfile();
        if (!currentProfile)
            return;

        if (!hasObjectChanged(currentProfile, profile))
            return;

        const currentMetadata = currentProfile.metadata;
        const updatedMetadata = {
            ...currentMetadata,
            updatedAt: new Date().toISOString()
        };

        const updatedProfile = {
            ...profile,
            metadata: updatedMetadata
        };

        storage.set(StorageKeys.USER_PROFILE, JSON.stringify(updatedProfile));
    };
}

const hasObjectChanged = <T extends { metadata?: any }>(existing: T, incoming: T): boolean => {
    if (existing === null || incoming === null)
        return false;

    const { metadata: _, ...existingData } = existing;
    const { metadata: __, ...incomingData } = incoming;

    return JSON.stringify(existingData) !== JSON.stringify(incomingData);
};

export const LocalStorage = {
    set(key: string, value: string | number | boolean): void {
        storage.set(key, value);
    },

    getString(key: string): string | undefined {
        return storage.getString(key);
    },

    delete(key: string): void {
        storage.remove(key);
    },

    clearAll(): void {
        storage.clearAll();
    },
};