const bcrypt = require('bcrypt');
const dbService = require('../../services/dbServices');
const { generateToken } = require('../../services/authentication');

function getUser(req, res, next) {
    let userID = req.body.userID;

    dbService.pool.query(
        'SELECT * FROM userTable WHERE userID = ?',
        [userID],
        (err, rows, fields) => {
            if (err || rows.length <= 0) {
                res.status(500).send({
                    message:
                        err ??
                        'Some error occurred while fetching user details',
                });
            } else {
                let user = rows;
                let userDetails = {
                    userID: user[0].userID,
                    userRole: user[0].userRole,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    username: user[0].username,
                };
                res.send(userDetails);
            }
        }
    );
}

async function login(req, res, next) {
    let user = {
        uid: 0,
        username: req.body.username,
        password: req.body.password,
    };

    dbService.pool.query(
        'SELECT * FROM userTable WHERE username = ?',
        [user.username],
        function (err, rows, fields) {
            if (err || rows.length <= 0) {
                res.status(500).send({
                    message: err ?? 'Some error occurred while logging in',
                });
            } else {
                let userDetails = rows[0];
                let token = generateToken({
                    id: userDetails.uid,
                    username: userDetails.username,
                });
                res.cookie('token', token);
                res.status(200).redirect('/');
            }
        }
    );
}

async function createUser(req, res, next) {
    let userPassword = req.body.password;
    bcrypt
        .hash(userPassword, 10)
        .then((hash) => {
            let user = {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hash,
            };
            // TODO: Remove clog
            console.log(user);
            dbService.pool.query(
                'INSERT INTO userTable( username, userPassword, firstName, lastName) VALUES (?,?,?,?)',
                [user.username, user.password, user.firstName, user.lastName],
                function (err, rows, fields) {
                    if (err) {
                        throw new Error(err);
                    }
                    let token = generateToken({
                        id: rows.insertId,
                        username: user.username,
                    });
                    res.cookie('token', token);
                    res.status(200).redirect('/');
                }
            );
        })
        .catch((err) => {
            throw new Error(err);
        });
}

function updateUser(req, res, next) {
    let user = {
        userID: req.body.userID,
        userRole: req.body.userRole ?? null,
        username: req.body.username ?? null,
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        password: req.body.password ?? null,
    };
    if (user.password != null) {
        user.password = bcrypt.hash(user.password, 10);
    }
    console.log(user);
    dbService.pool.query(
        'UPDATE userTable SET userRole = IFNULL(?, userRole), username = IFNULL(?, username), firstName = IFNULL(?, firstName), lastName = IFNULL(?, lastName) WHERE userID = ?',
        [
            user.userRole,
            user.username,
            user.firstName,
            user.lastName,
            user.userID,
        ],
        function (err, rows, fields) {
            if (err) {
                throw new Error(err);
            }
            res.status(201).send('User updated successfully'); // or use res.json() for JSON response
        }
    );
}
// TODO: Fix this shit
function updateUserOld(req, res, next) {
    // TODO Cleanup
    let userPassword = req.body.password ?? null;
    if (userPassword != null) {
        bcrypt.hash(userPassword, 10).then((hash) => {
            let user = {
                userID: req.body.userID,
                userRole: req.body.userRole ?? null,
                username: req.body.username ?? null,
                firstName: req.body.firstName ?? null,
                lastName: req.body.lastName ?? null,
                password: hash,
            };
            dbService.pool.query(
                'UPDATE userTable SET userRole = IFNULL(null, userRole), username = IFNULL(null, username), firstName = IFNULL(null, firstName), lastName IFNULL(null, lastName) WHERE userID = ?',
                [
                    user.userRole,
                    user.username,
                    user.password,
                    user.firstName,
                    user.lastName,
                    user.userID,
                ],
                function (err, rows, fields) {
                    res.status(201);
                }
            );
        });
        let user = {
            userID: req.body.userID,
            userRole: req.body.userRole ?? null,
            username: req.body.username ?? null,
            firstName: req.body.firstName ?? null,
            lastName: req.body.lastName ?? null,
        };
        dbService.pool.query(
            'UPDATE userTable SET userRole = IFNULL(null, userRole), username = IFNULL(null, username), firstName = IFNULL(null, firstName), lastName IFNULL(null, lastName WHERE userID = ?',
            [
                user.userRole,
                user.username,
                user.password,
                user.firstName,
                user.lastName,
                user.userID,
            ],
            function (err, rows, fields) {
                if (err) {
                    throw new Error(err);
                }
                res.status(201);
            }
        );
    }
}

function deleteUser(req, res, next) {
    let user = req.body.userID;
    dbService.pool.query(
        'DELETE FROM userTable WHERE userID = ?',
        [user],
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else {
                res.send('Delete completed');
            }
        }
    );
}

module.exports = {
    getUser,
    login,
    createUser,
    updateUser,
    deleteUser,
};
