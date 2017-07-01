import * as co from 'co';
import * as lowdb from 'lowdb';
import { ItemService } from './services/item';

co(function* () {

    const db = lowdb('./src/repositories/db.json');

    db.defaults({ items: [] })
        .write()

    const itemService: ItemService = new ItemService();

    const item = yield itemService.find();

    console.log(item);
}).catch((err: Error) => {
    console.log(err.stack);
})