'use strict';

const _ = require('lodash');

const DB = require('../db.js');

const cleanCreateResult = (record) => {
    return {
        id: record.insertId
    };
};

const cleanGetResults = (records) => {
    let users = [];
    records.forEach(record => {
       users.push({
           id: record.id,
           firstName: record.first_name,
           lastName: record.last_name,
           email: record.email
       })
    });
    return users;
};

const UserService = {
    createUser: (firstName, lastName, email) => {
        let query = 'INSERT INTO users (first_name, last_name, email) VALUES (?,?,?)';
        return DB.query(query, [firstName, lastName, email])
            .then(cleanCreateResult)
            .catch((err) => {
                let message = "Could not create new user";

                if (err.code === "ER_DUP_ENTRY") {
                    message = "Email already exists";
                }

                throw new Error(message);
            });
    },

    getUsers: () => {
        let query = 'SELECT first_name, last_name, email FROM users';
        return DB.query(query)
            .then(cleanGetResults)
            .catch(() => {
                throw new Error('Could not retrieve users');
            });
    },

    getIdFromName: (firstName, lastName) => {
        let query = 'SELECT id FROM users WHERE first_name = ? AND last_name = ?';
        return DB.query(query, [firstName, lastName])
            .then((record) => {
                return _.isEmpty(record) ? null : record[0].id;
            })
            .catch(() => {
                throw new Error('Could not retrieve user id');
            });
    }
};

module.exports = UserService;