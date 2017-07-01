"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const bases = require("bases");
class Processor {
    constructor() {
        this.characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    }
    compute(seedNumber, numberOfSteps, match) {
        for (let i = 0; i < numberOfSteps; i++) {
            let workingString = bases.toAlphabet(seedNumber + i, this.characters);
            let md5 = crypto.createHash('md5').update(workingString).digest("hex");
            let sha1 = crypto.createHash('sha1').update(workingString).digest("hex");
            let sha256 = crypto.createHash('sha256').update(workingString).digest("hex");
            if (md5 == match) {
                return {
                    type: 'md5',
                    answer: workingString
                };
            }
            if (sha1 == match) {
                return {
                    type: 'sha1',
                    answer: workingString
                };
            }
            if (sha256 == match) {
                return {
                    type: 'sha256',
                    answer: workingString
                };
            }
        }
        return null;
    }
}
exports.Processor = Processor;
//# sourceMappingURL=processor.js.map