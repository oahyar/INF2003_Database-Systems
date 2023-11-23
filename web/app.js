// const helmet = require('helmet');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const dbService = require('./services/dbServices');
const apiV1Router = require('./api/routes');
const config = require('./config/config');
// const { createUserTable, createCameraReportTable, createCameraApprovalTable } = require('./db/seed');

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    })
);

const port = config.port || 8080;
const host = config.host || '0.0.0.0';

const pageRouter = express.Router();
try {
    mongoose.connect('mongodb://127.0.0.1:27017/TraffiCam');
} catch (error) {
    console.log(error);
}
// app.use(express.static(path.join(__dirname, '/views')));
// app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile); 
app.use(bodyParser.json());
app.use(cookieParser());
// app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));

app.use('/api', apiV1Router);
app.use('/', pageRouter);

pageRouter.get('/', function (req, res) {
    res.render('index.html')
});
pageRouter.get('/test', function (req, res) {
    res.render('test.html');
});

// pageRouter.get('/seed/createTables',async function(req, res){
//     createUserTable();
//     createCameraReportTable();
//     createCameraApprovalTable()
//     res.send("Tables Created")
// });

pageRouter.get('/logout', function (req, res) {
    res.clearCookie('user');
    res.clearCookie('token');
    res.redirect('/login');
});


// // Global Error Handler
// error handler
// TODO: Make error page
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(port, () => console.log(`Server running on ${host}:${port}`));
