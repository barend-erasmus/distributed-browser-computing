// Imports
import * as co from 'co';
import * as uuid from 'uuid';
import * as crypto from 'crypto';

// Import repositories
import { ItemRepository } from './../repositories/item';
import { ProcessRepository } from './../repositories/process';

// Import models
import { Item } from './../models/item';
import { Process } from './../models/process';

export class ItemService {

    private itemRepository: ItemRepository = new ItemRepository();
    private processRepository: ProcessRepository = new ProcessRepository();

    public find(): Promise<Item> {
        const self = this;
        return co(function* () {

            const process: Process = yield self.processRepository.findUnanswered();

            if (!process) {
                return null;
            }

            const item: Item = yield self.itemRepository.findExpired(process.id);

            if (item) {
                item.requestedTimestamp = new Date().getTime();
                yield self.itemRepository.update(item);
                return item;
            }

            const lastItem: Item = yield self.itemRepository.findLast(process.id);

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
                    process.id,
                    0,
                    500,
                    new Date().getTime(),
                    new Date().getTime(),
                    null,
                    process.hash,
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

            if (answer) {
                const md5 = crypto.createHash('md5').update(answer).digest("hex");
                const sha1 = crypto.createHash('sha1').update(answer).digest("hex");
                const sha256 = crypto.createHash('sha256').update(answer).digest("hex");

                if (md5 !== item.hash && sha1 !== item.hash && sha256 !== item.hash) {
                    return false;
                }

                item.answer = answer;

                const process: Process = yield self.processRepository.findById(item.proccessId);

                process.answer = answer;

                yield self.processRepository.update(process);
            }

            yield self.itemRepository.update(item);

            return true;
        });
    }
}