// Imports
import * as co from 'co';
import * as request from 'request-promise';

// Imports services
import { ItemService } from './services/item';

// Imports models
import { Item } from './models/item';

// Imports
import { Processor } from './processor';

co(function* () {

    const itemService: ItemService = new ItemService();

    const item: Item = yield request({
        method: 'GET',
        uri: 'https://localhost:3000/find',
        json: true
    });

    if (!item) {
        return;
    }

    const processor: Processor = new Processor();

    const result: { type: string, answer: string } = processor.compute(item.seedNumber, item.numberOfSteps, item.hash);

    yield request({
        method: 'POST',
        uri: 'https://localhost:3000/handle',
        body: {
            id: item.id,
            answer: result ? result.answer : null
        },
        json: true
    });
}).catch((err: Error) => {
    
})