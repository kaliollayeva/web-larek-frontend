import { ICardBasketInfo } from '../types';
import { IEvents } from '../components/base/events';

interface IBasketModel {
	readonly items: ICardBasketInfo[];
	readonly total: number;

	addItem(item: ICardBasketInfo): void;
	removeItem(payload: { id: string }): void;
	clear(): void;
}

export class BasketModel implements IBasketModel {
	protected _items: ICardBasketInfo[] = [];
	protected _total: number = 0;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	get items(): ICardBasketInfo[] {
		return this._items;
	}

	get total(): number {
		return this._total;
	}

	protected updateTotal() {
		this._total = this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	protected emitUpdate() {
		this.events.emit('basket:changed', {
			items: this.items,
			total: this.total,
		});
	}

	addItem(item: ICardBasketInfo) {
		if (this.items.find((existing) => existing.id === item.id)) return;
		this.items.push(item);
		this.updateTotal();
		this.emitUpdate();
	}

	removeItem(payload: { id: string }) {
		this._items = this.items.filter((item) => item.id !== payload.id);
		this.updateTotal();
		this.emitUpdate();
	}

	clear() {
		this._items = [];
		this._total = 0;
		this.emitUpdate(); // чтобы интерфейс тоже обновился
	}
}
