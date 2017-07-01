"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lowdb = require("lowdb");
const path = require("path");
const item_1 = require("./../models/item");
class ItemRepository {
    findUnprocessed() {
        const db = lowdb(path.join(__dirname, 'db.json'));
        const items = db.get('items').value();
        if (items.length === 0) {
            return Promise.resolve(null);
        }
        const item = items.find((x) => x.answer === null && x.requestedTime !== null && x.requestedTime < new Date().getTime() - 5000);
        if (!item) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new item_1.Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTime, item.hash, item.answer));
    }
    findLast() {
        const db = lowdb(path.join(__dirname, 'db.json'));
        let items = db.get('items').value();
        items.sort((a, b) => {
            return a.seedNumber > b.seedNumber ? 1 : 0;
        });
        items = items
            .filter((x) => x.answer === null);
        if (items.length === 0) {
            return Promise.resolve(null);
        }
        const item = items[items.length - 1];
        return Promise.resolve(new item_1.Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTime, item.hash, item.answer));
    }
    findById(id) {
        const db = lowdb(path.join(__dirname, 'db.json'));
        const items = db.get('items').value();
        const item = items.find((x) => x.id === id);
        if (!item) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new item_1.Item(item.id, item.proccessId, item.seedNumber, item.numberOfSteps, item.requestedTime, item.hash, item.answer));
    }
    insert(item) {
        const db = lowdb(path.join(__dirname, 'db.json'));
        const items = db.get('items').value();
        items.push(item);
        db.set('items', items).write();
        return Promise.resolve(true);
    }
    update(item) {
        const db = lowdb(path.join(__dirname, 'db.json'));
        const items = db.get('items')
            .find({ id: item.id })
            .assign({
            requestedTime: item.requestedTime
        })
            .write();
        return Promise.resolve(true);
    }
}
exports.ItemRepository = ItemRepository;
//# sourceMappingURL=item.js.map