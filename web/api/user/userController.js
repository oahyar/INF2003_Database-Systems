const bcrypt = require('bcrypt');
const dbService = require('../../services/dbServices');
const { generateToken } = require('../../services/authentication');

function getAllUser(req, res, next){
    dbService.pool.query(
        'SELECT * FROM userTable',
        (err, rows, fields) => {
            if (err) {
                throw new Error(err);
            } else if (rows.length <= 0) {
                return res.send('No Users');
            } else {
                let users = rows;
                return res.send(users);
            }
        }
    );
}

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
                let user = rows[0];
                console.log(user)
                let userDetails = {
                    userID: user.userID,
                    userRole: user.userRole,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
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
                let user = {
                    userRole: userDetails.userRole,
                    username: userDetails.username,
                };
                let cookie = {
                    token: token,
                    user: user
                }
                res.status(200).cookie('token', cookie).redirect('/');
                res.end();
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
                        username: rows.username,
                    });
                    let user = {
                        userRole: rows.userRole,
                        username: rows.username,
                    };
                    let cookie = {
                        token: token,
                        user: user,
                    };
                    res.status(200).cookie('token', cookie).redirect('/');
                    res.end();
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
            res.status(200).send('User updated successfully'); // or use res.json() for JSON response
        }
    );
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
                res.send(200);
            }
        }
    );
}

module.exports = {
    getUser,
    getAllUser,
    login,
    createUser,
    updateUser,
    deleteUser,
};
