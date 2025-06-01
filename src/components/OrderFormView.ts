import { IEvents } from './base/events';

interface IOrderFormView {
	render(): HTMLElement | null;
	resetForm(): void;
}

export class OrderFormView implements IOrderFormView {
	protected container: HTMLElement | null;
	protected orderButton: HTMLButtonElement | null;
	protected payButton: HTMLButtonElement | null;
	protected onlineButton: HTMLButtonElement | null;
	protected cashButton: HTMLButtonElement | null;
	protected addressInput: HTMLInputElement | null;
	protected emailInput: HTMLInputElement | null;
	protected phoneInput: HTMLInputElement | null;
	protected payment: string | null;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;

		this.orderButton = this.container.querySelector('.order__button');
		this.payButton = this.container.querySelector('.pay__button');
		this.onlineButton = this.container.querySelector('[name="card"]');
		this.cashButton = this.container.querySelector('[name="cash"]');
		this.addressInput = this.container.querySelector('[name="address"]');
		this.emailInput = this.container.querySelector('[name="email"]');
		this.phoneInput = this.container.querySelector('[name="phone"]');

		this.payment = null;

		if (this.orderButton) {
			if (this.orderButton) {
				this.orderButton.addEventListener('click', () => {
					events.emit('userData:step1', {
						address: this.addressInput?.value,
						payment: this.payment,
					});
				});
			}

			[this.onlineButton, this.cashButton].forEach((btn) => {
				if (btn) {
					btn.addEventListener('click', (event) => {
						const target = event.currentTarget as HTMLButtonElement;
						this.payment =
							target.getAttribute('name') === 'card' ? 'online' : 'cash';
						this.setActiveButton(target);
						this.events.emit('userData:validateOrderStep', {
							address: this.addressInput?.value || '',
							payment: this.payment,
						});
					});
				}
			});

			if (this.addressInput) {
				this.addressInput.addEventListener('input', () =>
					this.events.emit('userData:validateOrderStep', {
						address: this.addressInput?.value || '',
						payment: this.payment,
					})
				);
			}

			this.events.on(
				'orderStep:validated',
				({ isValid, errors }: { isValid: boolean; errors: string[] }) => {
					if (this.orderButton) {
						this.orderButton.disabled = !isValid;
					}

					const errorElement = this.orderButton
						?.closest('form')
						?.querySelector<HTMLSpanElement>('.form__errors');
					if (errorElement) {
						errorElement.textContent = isValid ? '' : errors.join(' ');
					}
				}
			);
		}

		if (this.payButton) {
			if (this.payButton) {
				this.payButton.addEventListener('click', (event) => {
					event.preventDefault();
					events.emit('userData:step2', {
						email: this.emailInput?.value,
						phone: this.phoneInput?.value,
					});
				});
			}

			if (this.emailInput) {
				this.emailInput.addEventListener('input', () =>
					this.events.emit('userData:validateContacts', {
						email: this.emailInput?.value || '',
						phone: this.phoneInput?.value || '',
					})
				);
			}
			if (this.phoneInput) {
				this.phoneInput.addEventListener('input', () =>
					this.events.emit('userData:validateContacts', {
						email: this.emailInput?.value || '',
						phone: this.phoneInput?.value || '',
					})
				);
			}

			this.events.on(
				'contacts:validated',
				({ isValid, errors }: { isValid: boolean; errors: string[] }) => {
					if (this.payButton) {
						this.payButton.disabled = !isValid;
					}
					const errorElement = this.payButton
						?.closest('form')
						?.querySelector<HTMLSpanElement>('.form__errors');
					if (errorElement) {
						errorElement.textContent = isValid ? '' : errors.join(' ');
					}
				}
			);
		}
	}

	private setActiveButton(activeBtn: HTMLButtonElement) {
		if (!this.container) return;
		const paymentButtons = this.container.querySelectorAll<HTMLButtonElement>(
			'[name="card"], [name="cash"]'
		);

		paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
		activeBtn.classList.add('button_alt-active');
	}

	resetForm() {
		if (this.addressInput) this.addressInput.value = '';
		if (this.emailInput) this.emailInput.value = '';
		if (this.phoneInput) this.phoneInput.value = '';

		this.payment = null;
		[this.onlineButton, this.cashButton].forEach((btn) => {
			btn?.classList.remove('button_alt-active');
		});

		if (this.orderButton)
			this.events.emit('userData:validateOrderStep', {
				address: this.addressInput?.value || '',
				payment: this.payment || '',
			});
		if (this.payButton)
			this.events.emit('userData:validateContacts', {
				email: this.emailInput?.value || '',
				phone: this.phoneInput?.value || '',
			});
	}

	render() {
		return this.container;
	}
}
