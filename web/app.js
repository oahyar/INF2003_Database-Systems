// const helmet = require('helmet');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiV1Router = require('./api/routes');
const query = require('./services/dbService');
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
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const pageRouter = express.Router();
// app.use(helmet());
// app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));



// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

app.listen(port, () => console.log(`Server running on ${host}:${port}`));
