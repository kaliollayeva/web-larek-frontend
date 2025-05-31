import { IEvents } from '../components/base/events';
import { Component } from '../components/base/Component';

interface IModalView{
	open(content?: HTMLElement): void;
	close(): void;
}

export class ModalView<T> extends Component<T> implements IModalView{
	protected events: IEvents;
	protected modal: HTMLElement;
	protected closeButton: HTMLElement;
	protected contentContainer: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.contentContainer = container.querySelector('.modal__content')!;
		this.closeButton = this.container.querySelector('.modal__close')!;

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === container) {
				this.close();
			}
		});

        this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === container) {
				this.close();
			}
		});
		
	}

	open(content?: HTMLElement): void {
		this.contentContainer.innerHTML = ''; // Очистить старое содержимое
		this.contentContainer.append(content); // Вставить новое
		this.container.classList.add('modal_active'); // Показать модалку
        this.events.emit('modal:opened');
	}

	close(): void {
		this.container.classList.remove('modal_active');
        this.events.emit('modal:closed');
	}

}


