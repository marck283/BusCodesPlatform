import express, { json, urlencoded } from 'express';
import RateLimit from 'express-rate-limit';
import cors from 'cors';
var app = express();
import cookieParser from 'cookie-parser';

var limiter = RateLimit({
    windowMs: 1*60*1000, //1 minute
    max: 100, //Limit each IP to 100 requests per minute
    message: async () => "Hai raggiunto il numero massimo di richieste al minuto.",
    statusCode: 429
});

/**
 * Configure Express.js parsing middleware
 */
app.use(json({limit: '200mb'}));
app.use(urlencoded({ extended: true }));
 
app.use(cookieParser());
app.use(cors());
app.disable('x-powered-by'); //Disabling x-powered-by for security reasons
app.enable('access-control-allow-origin'); //Enabling Access-Control-Allow-Origin for security reasons
app.enable('origin');
app.enable('vary');
app.set('trust proxy', 'loopback');
app.set('origin', ''); //Da sistemare con l'URL del sito che ospiterà la piattaforma
app.set('access-control-allow-origin', ''); //Da sistemare con l'URL del sito che ospiterà la piattaforma
app.set('vary', 'origin');

/**
 * Serve front-end static files
 */
app.use('/', express.static('static'));

//Apply rate limiter to all requests
//Avoids Brute Force attacks by limiting the number of requests per IP
app.use(limiter);

import codes from './codes.mjs';
import buses from './buses.mjs';

app.use('api/v1/codes', codes);
app.use('api/v1/buses', buses);

export default app;