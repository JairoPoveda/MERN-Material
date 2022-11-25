const router = require('express').Router();
//const bcrypt = require('bcrypt');
//let UserSession = require('../models/userSession.model');
let User = require('../models/user.model');

router.route('/get').get((req, res) => {
    let { body, query, params } = req;

    const userId = query[0];

    User.find({
        _id: userId,
        isDeleted: false
    }, (err, users) => {

        if (err) {
            //console.log("user session err!");
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        }

        if (users.length === 0) {
            return res.send({
                success: false,
                message: 'Error: User not found'
            })
        }

        const user = users[0];

        return res.send({
            success: true,
            user
        })
    })
})

router.route('/update').post((req, res) => {
    let { body, query } = req;
    const {
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
    } = body;

    User.find({
        _id: userId,
        isDeleted: false
    }, (err, users) => {

        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        }

        if (users.length === 0) {
            return res.send({
                success: false,
                message: 'Error: User not found'
            })
        }

        const user = users[0];

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phoneNumber = phoneNumber;

        user.save();

        return res.send({
            success: true,
            user
        })
    })
})

router.route('/update-password').post((req, res) => {
    const { body, query } = req;
    const { password, newPassword, userId } = body;

    User.find({
        _id: userId,
        isDeleted: false
    }, (err, users) => {

            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            }

        if (users.length === 0) {
            return res.send({
                success: false,
                message: 'User Not found'
            })
        }

        const user = users[0];

        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Invalid Password'
            })
        }

        if(newPassword.length < 8) {
            return res.send({
                success: false,
                message: 'The password must be at least 8 characters'
            })
        }

        newPass = user.generateHash(newPassword);

        user.password = newPass;

        user.save();

        return res.send({
            success: true,
            data: 'Password updated!'
        })
    })
})

module.exports = router;