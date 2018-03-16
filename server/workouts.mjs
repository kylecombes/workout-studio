import mongodb from 'mongodb';

const WORKOUTS_COLLECTION_NAME = 'workouts';

export function getWorkouts(db, userId) {
    return db.collection(WORKOUTS_COLLECTION_NAME).find({user: mongodb.ObjectId(userId)}).toArray();
}

export function getWorkout(db, workoutId) {
    return new Promise((resolve, reject) => {
        db.collection(WORKOUTS_COLLECTION_NAME).findOne({'_id': mongodb.ObjectId(workoutId)}, (err, workoutInfo) => {
            if (err) {
                reject(err);
            } else {
                resolve(workoutInfo);
            }
        });
    });
}