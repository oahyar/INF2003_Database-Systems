// const helmet = require('helmet');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const apiV1Router = require('./api/routes');
// const query = require('./services/dbService');
const config = require('./config/config');
const cookieParser = require('cookie-parser');

const app = express();
app.use(
    express.urlencoded({
        extended: true,
    })
);

// let port = process.env.PORT || 8080;
// let host = process.env.HOST || '0.0.0.0';
const port = config.port || 8000;
const host = config.host || '0.0.0.0';

// const pageRouter = express.Router();
// app.use(helmet());
// app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));

// // Global Error Handler
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => console.log(`Server running on ${host}:${port}`));
