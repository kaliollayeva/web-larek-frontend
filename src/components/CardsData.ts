import { ICard } from '../types';
import { IEvents } from '../components/base/events';

export class CardsData {
	private _cards: ICard[];
	private _preview: string | null; // id
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

    setCards(cards: ICard[]): void{
        this._cards = cards;
    }

    getCards(): ICard [] {
        return this._cards;
    }

     selectCard(id: string): void {
        this._preview = id;
        this.events.emit('card:selected', { id });
     }
}
