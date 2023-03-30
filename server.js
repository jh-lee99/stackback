require('rootpath')();
import express from 'express';
const app = express();
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from '_middleware/error-handler';

// create test user in db on startup if required
import createTestUser from '_helpers/create-test-user';
createTestUser();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/users', require('./users/users.controller'));

// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});