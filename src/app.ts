// Imports
import * as express from 'express';
import * as co from 'co';
import path = require('path');

// Imports logger
import { logger } from './logger';

// Imports middleware
import expressWinston = require('express-winston');
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

// Imports services
import { ItemService } from './services/item';

// Imports models
import { Item } from './models/item';
import { Process } from './models/process';

// Import configurations
let config = require('./config').config;

const argv = require('yargs').argv;

if (argv.prod) {
    config = require('./config.prod').config;
}

const itemService: ItemService = new ItemService();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(expressWinston.logger({
    meta: true,
    msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
    winstonInstance: logger
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/find', (req: express.Request, res: express.Response) => {
    co(function* () {
        const item: Item = yield itemService.find();
        res.json(item);
    }).catch(() => {
        res.json(null);
    });
});

app.post('/handle', (req: express.Request, res: express.Response) => {
    co(function* () {
        const result: boolean = yield itemService.handledItem(req.body.id, req.body.answer);
        res.json(result);
    }).catch(() => {
        res.json(false);
    });
});

app.post('/create', (req: express.Request, res: express.Response) => {
    co(function* () {
        const result: Process = yield itemService.createProcess(req.body.hash);
        res.json(result);
    }).catch(() => {
        res.json(false);
    });
});

app.get('/list', (req: express.Request, res: express.Response) => {
    co(function* () {
        const result: Process[] = yield itemService.listProcesses();
        res.json(result);
    }).catch(() => {
        res.json(false);
    });
});

const port = argv.port || 3000;
app.listen(port);
logger.info(`listening on ${port}`);
