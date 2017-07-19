// Imports models
import { Item } from './../../models/item';

// Imports
import { Processor } from './../../processor';

setInterval(function () {
    httpRequest('GET', 'https://z1.openservices.co.za/find', null, function (item: any) {
        if (!item) {
            return;
        }

        const processor: Processor = new Processor();

        const result: { type: string, answer: string } = processor.compute(item.seedNumber, item.numberOfSteps, item.hash);

        httpRequest('POST', 'https://z1.openservices.co.za/handle', JSON.stringify({
            id: item.id,
            answer: result ? result.answer : null
        }), function (body: any) {

        });
    });

}, 4000);


function httpRequest(method: string, uri: string, body: string, cb: (body: any) => void) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, uri, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            cb(JSON.parse(xmlhttp.responseText))
        }
    }
    xmlhttp.send(body);
}