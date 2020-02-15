'use strict';

const _ = require('lodash');
const router = require('express').Router();

const ActivityService = require('../service/activity.service.js');

router.post('/', (req, res) => {
    ActivityService.addActivity(req.body.firstName, req.body.lastName, req.body.activity, req.body.metric, req.body.metric_type)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

router.get('/', (req, res) => {
    ActivityService.getActivities(req.query.firstName, req.query.lastName)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

module.exports = router;