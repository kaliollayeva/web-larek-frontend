import { ICard } from '../types';
import { IEvents } from '../components/base/events';

export interface ICardsData {
  set cards(cards: ICard[]);
  getCards(): ICard[];
  selectCard(id: string): void;
}

export class CardsData implements ICardsData{
	private _cards: ICard[];
	private _preview: string | null; // id
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('cards:changed');
	}

	getCards(): ICard[] {
		return this._cards;
	}

	selectCard(id: string): void {
		this._preview = id;
		this.events.emit('card:selected', { id });
	}
}
