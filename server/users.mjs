import mongodb from 'mongodb';

const USER_COLLECTION_NAME = 'users';

export function getUserInfo(db, userId) {
  return new Promise((resolve, reject) => {
    db.collection(USER_COLLECTION_NAME).findOne({'_id': mongodb.ObjectId(userId)}, (err, user) => {
      if (err) {
        reject(err);
      } else {
        user = stripPrivateInfo(user);
        resolve(user);
      }
    });
  });
}

export function getWorkoutsForUser(db, userId) {
  return new Promise((resolve, reject) => {
    let workouts = db.collection('workouts').find({'_id': userId}).toArray();
    resolve(workouts);
  });
}

const PRIVATE_FIELDS = ['password', 'emailVerified'];

function stripPrivateInfo(userInfo) {
  if (userInfo) {
    PRIVATE_FIELDS.forEach(fieldName => {
      if (userInfo.hasOwnProperty(fieldName)) {
        delete userInfo[fieldName];
      }
    });
  }
  return userInfo;
}