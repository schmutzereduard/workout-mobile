import {createMMKV} from 'react-native-mmkv';
import {
    ExerciseDTO,
    MesocycleDTO,
    MesocycleTemplateDTO,
    SyncMetadata,
    WorkoutDTO,
    WorkoutExerciseDTO,
    WorkoutTemplateDTO
} from "@/types/workout";

export const StorageKeys = {
    AUTH_TOKEN: 'auth_token',
    USER_INFO: 'user_info',
    EXERCISES: "exercises",
    WORKOUT_TEMPLATES: "workout_templates",
    MESOCYCLE_TEMPLATES: "mesocycle_templates",
    WORKOUTS: "workouts",
    MESOCYCLES: 'mesocycles',
    LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
} as const;

const storage = createMMKV();

class WorkoutUtils {

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

        const metadata: SyncMetadata = {
            ...exercise.metadata,
            updatedAt: new Date().toISOString()
        }
        const updatedExercise: ExerciseDTO = {
            ...exercise,
            metadata: metadata
        }
        const newExercises = this.getExercises().map(
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

    static getWorkoutTemplate(workoutTemplateClientId: string): WorkoutTemplateDTO | null {
        return this.getWorkoutTemplates().find(workoutTemplate => workoutTemplate.metadata.clientId === workoutTemplateClientId && !workoutTemplate.metadata.deletedAt) || null;
    }

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
        const metadata: SyncMetadata = {
            ...workoutTemplate.metadata,
            updatedAt: new Date().toISOString()
        }
        const updatedWorkoutTemplate: WorkoutTemplateDTO = {
            ...workoutTemplate,
            metadata: metadata
        }
        const newWorkoutTemplates = this.getWorkoutTemplates().map(
            existing => existing.metadata.clientId === updatedWorkoutTemplate.metadata.clientId ? updatedWorkoutTemplate : existing);
        storage.set(StorageKeys.WORKOUT_TEMPLATES, JSON.stringify(newWorkoutTemplates));
    };

    static deleteWorkoutTemplates(workoutTemplateIds: string[]): void {
        const newWorkoutTemplates = this.getWorkoutTemplates().map(existing => {
            if (workoutTemplateIds.includes(existing.metadata.clientId)) {
                return {
                    ...existing,
                    metadata: {
                        ...existing.metadata,
                        deletedAt: new Date().toISOString()
                    }
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
    }

    static getWorkouts(): WorkoutDTO[] {

        const workouts = storage.getString(StorageKeys.WORKOUTS);
        if (!workouts)
            return [];

        return JSON.parse(workouts);
    };

    static getWorkout(workoutClientId: string): WorkoutDTO | null {
        return this.getWorkouts().find(workout => workout.metadata.clientId === workoutClientId) || null;
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

    static getMesocycleTemplatesByMesocycle(mesocycleClientId: string): MesocycleTemplateDTO[] {
        return this.getMesocycleTemplates().filter(mesocycleTemplate => mesocycleTemplate.mesocycleClientId === mesocycleClientId);
    };

    static getMesocycleTemplatesByWorkoutTemplate(workoutTemplateClientId: string): MesocycleTemplateDTO[] {
        return this.getMesocycleTemplates().filter(mesocycleTemplate => mesocycleTemplate.workoutTemplateClientId === workoutTemplateClientId);
    }

    static getActiveMesocycle(): MesocycleDTO | null {

        const todayDate = new Date().toISOString().split('T')[0];
        return this.getMesocycles().find(mesocycleDTO => todayDate >= mesocycleDTO.startDate && todayDate <= mesocycleDTO.endDate) || null;
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
}

export default WorkoutUtils;

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