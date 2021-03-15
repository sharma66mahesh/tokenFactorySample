require('dotenv').config();

const express = require('express');
const cors = require('cors');

const controller = require('./controller');

const app = express();

// setting maximum size of a request to 30mb
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

app.use(cors());
const router = express.Router();
app.use('/', router);
router.post('/deploy', controller.deploySampleToken);

const server = require('http').createServer(app);

const port = process.env['PORT'] ? process.env['PORT'] : 5000;

server.listen(port, () => {
    console.log("Listening on port: ", port);
})