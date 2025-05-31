import { IEvents } from './base/events';

interface IOrderFormView {
  render(): HTMLElement | null;
  resetForm(): void;
}

export class OrderFormView implements IOrderFormView{
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
						this.validateOrderStep();
					});
				}
			});

			if (this.addressInput) {
				this.addressInput.addEventListener('input', () =>
					this.validateOrderStep()
				);
			}

			this.validateOrderStep();
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
					this.validateContactsStep()
				);
			}
			if (this.phoneInput) {
				this.phoneInput.addEventListener('input', () =>
					this.validateContactsStep()
				);
			}

			this.validateContactsStep();
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

	private validateOrderStep() {
		const addressValue = this.addressInput?.value || '';
		const isAddressValid = addressValue.trim().length > 0;
		const isPaymentValid = !!this.payment;
		const isValid = isAddressValid && isPaymentValid;

		if (this.orderButton) {
			this.orderButton.disabled = !isValid;
		}

		const errorElement = this.orderButton.closest('form')?.querySelector<HTMLSpanElement>('.form__errors');

		if (errorElement) {
			if (!isValid) {
				if (!isAddressValid && !isPaymentValid) {
					errorElement.textContent = 'Введите адрес и выберите способ оплаты.';
				} else if (!isAddressValid) {
					errorElement.textContent = 'Введите адрес доставки.';
				} else if (!isPaymentValid) {
					errorElement.textContent = 'Выберите способ оплаты.';
				}
			} else {
				errorElement.textContent = '';
			}
		}
	}

	private validateContactsStep() {
		const emailValue = this.emailInput?.value || '';
		const phoneValue = this.phoneInput?.value || '';
		const emailValid = /\S+@\S+\.\S+/.test(emailValue);
		const phoneValid = phoneValue.replace(/\D/g, '').length >= 10;
		const isValid = emailValid && phoneValid;

		if (this.payButton) {
			this.payButton.disabled = !isValid;
		}

		const errorElement = this.payButton.closest('form')?.querySelector<HTMLSpanElement>('.form__errors');

		if (errorElement) {
			if (!isValid) {
				if (!emailValid && !phoneValid) {
					errorElement.textContent = 'Введите корректный Email и телефон.';
				} else if (!emailValid) {
					errorElement.textContent = 'Введите корректный Email.';
				} else if (!phoneValid) {
					errorElement.textContent = 'Введите корректный номер телефона.';
				}
			} else {
				errorElement.textContent = '';
			}
		}
	}

	resetForm() {
		if (this.addressInput) this.addressInput.value = '';
		if (this.emailInput) this.emailInput.value = '';
		if (this.phoneInput) this.phoneInput.value = '';

		this.payment = null;
		[this.onlineButton, this.cashButton].forEach((btn) => {
			btn?.classList.remove('button_alt-active');
		});

		if (this.orderButton) this.validateOrderStep();
		if (this.payButton) this.validateContactsStep();
	}

	render() {
		return this.container;
	}
}
