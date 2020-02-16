'use strict';

const _ = require('lodash');

const DB = require('../db.js');

const UserService = require('../service/user.service.js');

const cleanCreateResult = (record) => {
    return {
        id: record.insertId
    };
};

const cleanGetResults = (records) => {
    let users = [];

    if (records) {
        records.forEach(record => {
            let value = record.metric;

            if (record.metric_type === "boolean") {
                value = value === 1;
            }

            let date = new Date(record.created_at);
            let dateString = `${date.toTimeString()}, ${date.toDateString()}`;

            users.push({
                activity: record.activity,
                metric: value,
                metricType: record.metric_type,
                time: dateString,
            })
        });
    }

    return users;
};

const ActivityService = {
    addActivity: (firstName, lastName, activity, metric, metricType) => {
        return UserService.getIdFromName(firstName, lastName)
            .then((userId) => {
                let query = 'INSERT INTO activities (user_id, activity, metric, metric_type) VALUES (?,?,?,?)';

                return DB.query(query, [userId, activity, metric, metricType])
                    .then(cleanCreateResult)
                    .catch(() => {
                        throw new Error("Could not add new activity");
                    });
            });
    },

    getActivities: (firstName, lastName) => {
        return UserService.getIdFromName(firstName, lastName)
            .then((userId) => {
                if (_.isNull(userId)) {
                    throw new Error('User does not exist');
                }

                let query = 'SELECT activity, metric, metric_type, created_at FROM activities WHERE user_id = ?';
                return DB.query(query, [userId])
                    .then(cleanGetResults)
                    .catch(() => {
                        throw new Error('Could not retrieve user activities');
                    });
            });
    }
};

module.exports = ActivityService;