import instance from "../axios/workout-api-axios";

class WorkoutApi {

    static getWorkouts() {
        return instance.get("/workouts");
    }

    static addWorkout(workout) {
        return instance.post('/workouts', workout);
    }

    static updateWorkout(workout) {
        return instance.put('/workouts', workout);
    }

    static deleteWorkouts(ids) {
        return instance.delete(`/workouts`, { data: ids });
    }

    static getExercises() {
        return instance.get("/exercises");
    }

    static addExercise(exercise) {
        return instance.post('/exercises', exercise);
    }

    static updateExercise(exercise) {
        return instance.put('/exercises', exercise);
    }

    static deleteExercises(ids) {
        return instance.delete(`/exercises`, { data: ids });
    }
}

export default WorkoutApi;