"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const co = require("co");
const uuid = require("uuid");
const item_1 = require("./../repositories/item");
const item_2 = require("./../models/item");
class ItemService {
    constructor() {
        this.itemRepository = new item_1.ItemRepository();
    }
    find() {
        const self = this;
        return co(function* () {
            const item = yield self.itemRepository.findUnprocessed();
            if (item) {
                item.requestedTime = new Date().getTime();
                yield self.itemRepository.update(item);
                return item;
            }
            const lastItem = yield self.itemRepository.findLast();
            if (lastItem) {
                const newItem = new item_2.Item(uuid.v4(), lastItem.proccessId, lastItem.seedNumber + lastItem.numberOfSteps, lastItem.numberOfSteps, new Date().getTime(), lastItem.hash, null);
                yield self.itemRepository.insert(newItem);
                return newItem;
            }
            else {
                const newItem = new item_2.Item(uuid.v4(), '123', 0, 200, new Date().getTime(), '5d41402abc4b2a76b9719d911017c592', null);
                yield self.itemRepository.insert(newItem);
                return newItem;
            }
        });
    }
    handledItem(id, answer) {
        const self = this;
        return co(function* () {
            const item = yield self.itemRepository.findById(id);
            item.requestedTime = null;
            item.answer = answer;
            yield self.itemRepository.update(item);
            return true;
        });
    }
}
exports.ItemService = ItemService;
//# sourceMappingURL=item.js.map