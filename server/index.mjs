import dotenv from 'dotenv';
import fs from 'fs';
import HttpServer from './http-server.mjs';
import getDatabaseConnection from './database.mjs';

if (fs.existsSync('./.env')) {
    dotenv.config();
}

// Connect to the database and start the HTTP server
getDatabaseConnection().then(db => new HttpServer(db));
