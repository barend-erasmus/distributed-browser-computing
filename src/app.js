"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const co = require("co");
const lowdb = require("lowdb");
const item_1 = require("./services/item");
co(function* () {
    const db = lowdb('./src/repositories/db.json');
    db.defaults({ items: [] })
        .write();
    const itemService = new item_1.ItemService();
    const item = yield itemService.find();
    console.log(item);
}).catch((err) => {
    console.log(err.stack);
});
//# sourceMappingURL=app.js.map