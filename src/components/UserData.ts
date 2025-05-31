import { ICardBasketInfo } from '../types/index';

export interface IUserData {
	setAddress(address: string): void;
	setPayment(method: string): void;
	setContacts(email: string, phone: string): void;
	setBasket(total: number, items: ICardBasketInfo[]): void;

	readonly totalNum: number;
	readonly itemsId: string[];

	readonly summary: {
		address: string;
		payment: string;
		email: string;
		phone: string;
		total: number;
		items: string[];
	};

	clear(): void;
}

export class UserData implements IUserData {
	protected payment: string = '';
	protected email: string = '';
	protected phone: string = '';
	protected address: string = '';
	protected total: number = 0;
	protected items: string[] = [];

	setAddress(address: string) {
		this.address = address;
	}

	setPayment(method: string) {
		this.payment = method;
	}

	setContacts(email: string, phone: string) {
		this.email = email;
		this.phone = phone.replace(/\s+/g, '');
	}

	setBasket(total: number, items: ICardBasketInfo[]) {
		this.total = total;
		this.items = items
			.filter((item) => item.price !== 0 && item.price !== null)
			.map((item) => item.id);
	}

	get totalNum() {
		return this.total;
	}

	get itemsId() {
		return this.items;
	}

	get summary() {
		return {
			address: this.address,
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			total: this.total,
			items: this.items,
		};
	}

	clear() {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = 0;
		this.items = [];
	}
}
