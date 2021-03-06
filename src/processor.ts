// Imports
import * as crypto from 'crypto';
import * as bases from 'bases';


export class Processor {
    private characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    constructor() {
    }


    public compute(seedNumber: number, numberOfSteps: number, match: string) {
        for (let i = 0; i < numberOfSteps; i++) {
            const workingString = bases.toAlphabet(seedNumber + i, this.characters);

            const md5 = crypto.createHash('md5').update(workingString).digest("hex");
            const sha1 = crypto.createHash('sha1').update(workingString).digest("hex");
            const sha256 = crypto.createHash('sha256').update(workingString).digest("hex");

            if (md5 == match) {
                return {
                    type: 'md5',
                    answer: workingString
                }
            }

            if (sha1 == match) {
                return {
                    type: 'sha1',
                    answer: workingString
                }
            }

            if (sha256 == match) {
                return {
                    type: 'sha256',
                    answer: workingString
                }
            }
        }

        return null;
    }
}