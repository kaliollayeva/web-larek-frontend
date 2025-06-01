import { ICardBasketInfo } from '../types/index';

interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export interface IUserData {
	setAddress(address: string): void;
	setPayment(method: string): void;
	setContacts(email: string, phone: string): void;

	readonly summary: {
		address: string;
		payment: string;
		email: string;
		phone: string;
	};

	clear(): void;
}

export class UserData implements IUserData {
	protected payment: string = '';
	protected email: string = '';
	protected phone: string = '';
	protected address: string = '';

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

	get summary() {
		return {
			address: this.address,
			payment: this.payment,
			email: this.email,
			phone: this.phone,
		};
	}

	clear() {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
	}

	validateOrderStep(address: string, payment: string): ValidationResult {
		const isAddressValid = address.trim().length > 0;
		const isPaymentValid = !!payment;

		const errors = [];
		if (!isAddressValid) errors.push('Введите адрес доставки.');
		if (!isPaymentValid) errors.push('Выберите способ оплаты.');

		return {
			isValid: isAddressValid && isPaymentValid,
			errors,
		};
	}

	validateContacts(email: string, phone: string): ValidationResult {
		const errors: string[] = [];

		if (!/\S+@\S+\.\S+/.test(email)) {
			errors.push('Введите корректный Email.');
		}
		if (phone.replace(/\D/g, '').length < 10) {
			errors.push('Введите корректный номер телефона.');
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
