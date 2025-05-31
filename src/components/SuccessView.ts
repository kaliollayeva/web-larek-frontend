import { IEvents } from './base/events';

export interface ISuccessView {
  render(total: number): HTMLElement;
}

export class SuccessView implements ISuccessView{
	protected container: HTMLElement;
	protected successDescription: HTMLElement;
	protected successCloseButton: HTMLButtonElement;
    protected successTitle: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents){
        this.container = container;
        this.events = events;

        this.successTitle = container.querySelector('.order-success__title');
        this.successDescription = container.querySelector('.order-success__description');
        this.successCloseButton = container.querySelector('.order-success__close');
        
        this.successCloseButton.addEventListener('click', () => {
			events.emit('modalSuccess:close');
		});
    }

    render(total: number){
        this.successDescription.textContent = `Списано ${total} синапсов`;

        return this.container;
    }
}