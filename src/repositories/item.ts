// Imports
import * as lowdb from 'lowdb';
import * as path from 'path';

// Imports models
import { Item } from './../models/item';

export class ItemRepository {

    public findUnprocessed(): Promise<Item> {

        const db = lowdb(path.join(__dirname, 'db.json'));

        const items: Item[] = db.get('items').value();

        if (items.length === 0) {
            return Promise.resolve(null);
        }

        const item: Item = items.find((x) => x.answer === null && x.requestedTimestamp !== null && x.requestedTimestamp < new Date().getTime() - 5000);

        if (!item) {
            return Promise.resolve(null);
        }

        return Promise.resolve(new Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTimestamp, item.createdTimestamp, item.completedTimestamp, item.hash, item.answer));
    }

    public findLast(): Promise<Item> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        let items: Item[] = db.get('items').value();

        items.sort((a: Item, b: Item) => {
            return a.seedNumber > b.seedNumber ? 1 : 0;
        })

        items = items
            .filter((x) => x.answer === null);

        if (items.length === 0) {
            return Promise.resolve(null);
        }

        const item: Item = items[items.length - 1];

        return Promise.resolve(new Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTimestamp, item.createdTimestamp, item.completedTimestamp, item.hash, item.answer));

    }

    public findById(id: string): Promise<Item> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        const items: Item[] = db.get('items').value();

        const item: Item = items.find((x) => x.id === id);

        if (!item) {
            return Promise.resolve(null);
        }

        return Promise.resolve(new Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTimestamp, item.createdTimestamp, item.completedTimestamp, item.hash, item.answer));
    }

    public insert(item: Item): Promise<boolean> {
        const db = lowdb(path.join(__dirname, 'db.json'));

        const items: Item[] = db.get('items').value();

        items.push(item);

        db.set('items', items).write();

        return Promise.resolve(true);
    }

    public update(item: Item): Promise<boolean> {

        const db = lowdb(path.join(__dirname, 'db.json'));

        const items: Item[] = db.get('items')
            .find({ id: item.id })
            .assign(item)
            .write();

        return Promise.resolve(true);
    }
}