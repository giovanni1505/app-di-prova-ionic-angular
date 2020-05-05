export class Booking{

    constructor(
        public id: string,
        public placeId: string,
        public userId: string,
        public placeTitle: string,
        public imgUrl: string,
        public guestNumber: number
    ){}
}