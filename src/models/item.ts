export class Item {

    constructor(
        public id: string,
        public proccessId: string,
        public seedNumber: number,
        public numberOfSteps: number,
        public requestedTimestamp: number,
        public createdTimestamp: number,
        public completedTimestamp: number,
        public hash: string,
        public answer: string
    ) {
       
    }
}