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
    let userActivities = _.groupBy(records, 'id');
    _.forEach(userActivities, (activityList) => {
        let firstName = _.first(activityList)['first_name'];
        let lastName = _.first(activityList)['last_name'];

        let activities = [];
        _.forEach(activityList, (activityRecord) => {
            if (!_.isNull(activityRecord['activity'])) {
                activities.push({
                    activity: activityRecord['activity'],
                    count: activityRecord['count']
                })
            }
        });

        users.push({
            firstName: firstName,
            lastName: lastName,
            activities: activities
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
        let query = `SELECT
          users.id,
          users.first_name,
          users.last_name,
          agg.activity,
          agg.count
        FROM
          users
          LEFT OUTER JOIN (
            SELECT
              user_id,
              activity,
              sum(metric) as count
            FROM
              activities
            WHERE metric_type = "count"
            GROUP BY
              activity,
              user_id
            ORDER BY
              user_id
          ) AS agg ON users.id = agg.user_id`;

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