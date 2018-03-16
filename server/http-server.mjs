// Start the HTTP server
import express from 'express';
import expose from './expose';
import {
  getWorkout,
  getWorkouts,
} from './workouts.mjs';
import {
  getUserInfo,
} from './users.mjs';

export default class HttpServer {
  constructor(db) {
    // Current hack with Node and experimental modules
    // eslint-disable-next-line no-underscore-dangle
    const fullPath = expose.__dirname.split('/');
    fullPath.pop();
    const rootDir = fullPath.join('/');

    const port = process.env.PORT || 2492;

    // Start the HTTP server
    this.app = express();
    // this.server = http.Server(this.app);

    // Add headers
    this.app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
      }
    );
    this.app.listen(port, () => console.log(`HTTP server listening on port ${port}`));

    // Register the routes
    this.app.get('/', (req, res) => {
      res.sendFile(rootDir + '/webapp/public/index.html')
    });

    this.app.get('/users/:uid', (req, res) => {
      const id = req.params.uid;
      getUserInfo(db, id).then((user) => {
        if (user) {
          res.json(user);
        } else {
          res.sendStatus(500);
        }
      });
    });

    this.app.get('/users/:uid/workouts', (req, res) => {
      const userId = req.params.uid;
      console.log('Requesting workouts for user ' + userId);
      getWorkouts(db, userId).then((workouts) => {
        console.log(`Found ${workouts.length} workouts`);
        res.json(workouts);
      });
    });

    this.app.get('/workouts/:wid', (req, res) => {
      const id = req.params.wid;
      getWorkout(db, id).then((workoutInfo) => {
        if (workoutInfo) {
          res.json(workoutInfo);
        } else {
          res.sendStatus(500);
        }
      });
    });

  }
}