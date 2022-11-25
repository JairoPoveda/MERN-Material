const router = require('express').Router();
let User = require('../models/user.model');
let UserSession = require('../models/userSession.model');

router.route('/signup').post((req, res, next) => {
    let { body } = req;
    let {
        firstName,
        lastName,
        email,
        phoneNumber,
        password
    } = body;

   
    if (!firstName) {
        return res.send({
            success: false,
            message: 'Error: first name cannot be  empty'
        })
    }
    if (!lastName) {
        return res.send({
            success: false,
            message: 'Error: last name cannot be  empty'
        })
    }
    if (!email) {
        return res.send({
            success: false,
            message: 'Error: email cannot be  empty'
        })
    }
    if (!phoneNumber) {
        return res.send({
            success: false,
            message: 'Error: phone number cannot be  empty'
        })
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: password cannot be  empty'
        })
    }
    if (password.length < 8) {
        return res.send({
            success: false,
            message: 'The password must be at least 8 characters'
        })
    }

    email = email.toLowerCase();

    User.find({
        email: email
    }, (err, previousUser) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server Error'
            });
        } else if (previousUser.length > 0) {
            return res.send({
                success: false,
                message: 'This account already exist'
            })
        }

        let newUser = new User();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.phoneNumber = phoneNumber;
        newUser.password = newUser.generateHash(password);

        newUser.save((err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            console.log('aqui');
            return res.send({
                success: true,
                message: 'Signed up!'
            });
        })
    });
})

/*
router.route('/update').post((req, res) => {
    let { body } = req;
    let { 
        FirstName,
        LastName,
        Email, 
        PhoneNumber,        
        token 
    } = body;

    User.find({
        _id: token,
    }, (err, user) => {
        if (err) {
            console.log("user session err!");
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        }
        console.log(user);
        return res.json(user);
    })
})
*/
router.route('/signin').post((req, res, next) => {
    let { body } = req;
    let {
        email,
        password
    } = body;

    console.log(body);

    if (!email) {
        return res.send({
            success: false,
            message: 'Error: email cannot be  empty'
        })
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: password cannot be  empty'
        })
    }

    email = email.toLowerCase();

    User.find({
        email: email
    }, (err, users) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: server error'
            })
        }
        if (users.length != 1) {
            return res.send({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        const user = users[0];

        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: 'Invalid Password'
            })
        }

        let userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                })
            }

            return res.send({
                success: true,
                message: 'Valid sign in',
                token: doc._id,
                userId: user._id
            })
        })
    })
})




router.route('/verify').get((req, res, next) => {

    const { query } = req;
    const { token } = query;

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        }
        if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            })
        } else {
            return res.send({
                success: true,
                message: 'Good'
            })
        }
    })
})

router.route('/logout').get((req, res, next) => {

    const { body } = req;
    const { token } = body;

    console.log(body);

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        }
    }, null, (err, sessions) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        }
        if (sessions.length != 1) {
            return res.send({
                success: false,
                message: 'Error: Invalid'
            })
        } else {
            return res.send({
                success: true,
                message: 'Good'
            })
        }
    })
})


module.exports = router;