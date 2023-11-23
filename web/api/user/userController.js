const bcrypt = require('bcrypt');
const dbService = require('../../services/dbServices');
const { generateToken } = require('../../services/authentication');

function getUser(req, res, next) {
    user = req.user;

    dbService.pool.query("SELECT * FROM userTable WHERE userID = ?", [user.id], (err, rows, fields) =>{
        if (err || rows.length <= 0) {
                res.status(500).send({
                    message: err ?? 'Some error occurred while fetching user details',
                });
            } else {
                let userDetails = rows[0];
                res.send(userDetails);
            }
    })
}

async function login(req, res, next) {
    let user = {
        uid: 0,
        userEmail: req.body.userEmail,
        password: req.body.password,
    };

    dbService.pool.query(
        'SELECT * FROM userTable WHERE userEmail = ?',
        [user.userEmail],
        function (err, rows, fields) {
            if (err || rows.length <= 0) {
                res.status(500).send({
                    message: err ?? 'Some error occurred while logging in',
                });
            } else {
                let userDetails = rows[0];
                let token = generateToken({
                        id: userDetails.uid,
                        userEmail: userDetails.userEmail,
                    });
                res.cookie('token', token);
                //  TODO: Might not need
                // res.cookie('user', {
                //     uid: userDetails.uid,
                //     userEmail: userDetails.userEmail,
                //     loggedIn: true,
                // });
                res.status(200).redirect('/');
            }
            // console.log(rows[0]);
        }
    );
}

async function createUser(req, res, next) {
    let userPassword = req.body.password;
    bcrypt
        .hash(userPassword, 10)
        .then((hash) => {
            let user = {
                userEmail: req.body.userEmail,
                password: hash,
            };
            console.log(user);
            dbService.pool.query(
                'INSERT INTO userTable(userEmail, password) VALUES (?,?)',
                [user.userEmail, user.password],
                function (err, rows, fields) {
                    if (err) {
                        return res.status(500).send({
                            message:
                                err.message ||
                                'Some error occurred while registering account.',
                        });
                    }
                    user = {
                        id: rows.insertId,
                        userEmail: req.body.userEmail,
                    };
                    res.status(201).cookie('User', {
                        User: user,
                        loggedIn: true,
                    });
                    res.redirect('/');
                    res.end();
                }
            );
        })
        .catch((err) => {
            return res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while hashing password.',
            });
        });
}
// TODO: Find what needs to update
function updateUser(req, res, next) {

}

function deleteUser(req, res, next) {
    let user = req.user;
    dbService.pool.query("DELETE FROM userTable WHERE userID = ?", [user.id], (err, rows, fields)=>{
        if (err || rows.length <= 0) {
                res.status(500).send({
                    message: err ?? 'Some error occurred while logging in',
                });
            } else {
                res.send("Delete completed")
            }
    })
}

module.exports = {
    getUser,
    login,
    createUser,
    updateUser,
    deleteUser,
};
