import { IEvents } from './base/events';

interface IBasketView {
	render(items: HTMLElement[], total: number): HTMLElement;
}

export class BasketView implements IBasketView {
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;
	protected listContainer: HTMLElement;
	protected container: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.totalElement = container.querySelector('.basket__price')!;
		this.orderButton = container.querySelector('.basket__button')!;
		this.listContainer = container.querySelector('.basket__list')!;

		this.orderButton.addEventListener('click', () => {
			events.emit('basket:checkout');
		});
	}

	render(items: HTMLElement[], total: number) {
		this.listContainer.innerHTML = '';
		items.forEach((item) => this.listContainer.append(item));
		this.totalElement.textContent = `${total} синапсов`;
		this.orderButton.disabled = total === 0;

		return this.container;
	}
}
