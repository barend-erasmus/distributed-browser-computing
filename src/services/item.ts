// Imports
import * as co from 'co';
import * as uuid from 'uuid';

// Import repositories
import { ItemRepository } from './../repositories/item';

// Import models
import { Item } from './../models/item';

export class ItemService {

    private itemRepository: ItemRepository = new ItemRepository();

    public find(): Promise<Item> {
        const self = this;
        return co(function* () {
            const item: Item = yield self.itemRepository.findUnprocessed();

            if (item) {
                item.requestedTimestamp = new Date().getTime();
                yield self.itemRepository.update(item);
                return item;
            }

            const lastItem: Item = yield self.itemRepository.findLast();

            if (lastItem) {
                const newItem = new Item(
                    uuid.v4(),
                    lastItem.proccessId,
                    lastItem.seedNumber + lastItem.numberOfSteps,
                    lastItem.numberOfSteps,
                    new Date().getTime(),
                    new Date().getTime(),
                    null,
                    lastItem.hash,
                    null
                );

                 yield self.itemRepository.insert(newItem);

                return newItem;

            } else {
                const newItem = new Item(
                    uuid.v4(),
                    '123',
                    0,
                    200,
                    new Date().getTime(),
                    new Date().getTime(),
                    null,
                    '5d41402abc4b2a76b9719d911017c592',
                    null
                );

                yield self.itemRepository.insert(newItem);

                return newItem;
            }
        });
    }

    public handledItem(id: string, answer: string): Promise<boolean> {
        const self = this;
        return co(function* () {
            const item: Item = yield self.itemRepository.findById(id);

            item.requestedTimestamp = null;
            item.answer = answer;

            yield self.itemRepository.update(item);

            return true;
        });
    }
}