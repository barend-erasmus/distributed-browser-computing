// Imports
import * as express from 'express';
import * as co from 'co';

// Imports middleware
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

// Imports services
import { ItemService } from './services/item';

// Imports models
import { Item } from './models/item';

const itemService: ItemService = new ItemService();

const app = express();

app.use(cors());
app.use(bodyParser.json())

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


app.listen(3000);