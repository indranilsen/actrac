'use strict';

const _ = require('lodash');
const mysql = require('mysql');
const fs = require('fs');

const ENCODING = 'UTF-8';

const validateTables = () => {
    let sequence = Promise.resolve();
    DB.Models.forEach(file => {
        sequence = sequence
            .then(() => {
                return readSqlFile(file)
            })
            .then(DB.query);
    });

    return sequence;
};

const connect = (config) => {
    const connection = DB.Driver.createConnection(config);

    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        })
    });
};

const readSqlFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, ENCODING, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const DB = {
    Driver: mysql,

    Models: ['./src/model/user.model.sql', './src/model/activity.model.sql'],

    query: (sql, args) => {
        return new Promise((resolve, reject) => {
            DB.connection.query(sql, args, (err, rows, fields) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows, fields);
            });
        });
    },

    initialize: (config) => {

        return connect(config)
            .then((connection) => {
                DB.connection = connection;
            })
            .then(validateTables)
            .catch((err) => {
                return Promise.reject(err.message);
            });
    },

    close: () => {
        return new Promise((resolve, reject) => {
            DB.connection.end(err => {
                if (err)
                    return reject( err );
                resolve();
            });
        });
    }
};

module.exports = DB;