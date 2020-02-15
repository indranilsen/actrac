'use strict';

const _ = require('lodash');
const router = require('express').Router();

const UserService = require('../service/user.service.js');

router.post('/', (req, res) => {
    UserService.createUser(req.body.firstName, req.body.lastName, req.body.email)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

router.get('/', (req, res) => {
    UserService.getUsers()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        });
});

module.exports = router;