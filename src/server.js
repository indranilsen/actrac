'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const config = require('nconf')
    .env({
        lowerCase: true,
        separator: '__',
    })
    .argv()
    .file('local', { file: `./src/config/local.json` })
    .file('defaults', { file: `./src/config/default.json` });

const DB = require('./db.js');
const port = config.get('port');

DB.initialize(config.get('db'))
    .catch((err) => {
        console.log(`Failed to initialize DB: ${err}`);
    })
    .then(() => {
        const app = express();
        app.use(bodyParser.json());
        app.use('/api', require('./route/routes.js'));

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Failed to start application: ${err}`);
    });
