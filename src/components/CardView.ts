import { ICardPublicInfo, ICardBasketInfo } from '../types/index';
import { IEvents } from '../components/base/events';
import { ICard } from '../types';
import { Component } from '../components/base/Component';
import { CDN_URL } from '../utils/constants';

interface ICardView {
	render(
		data?: Partial<ICard>,
		inBasket?: boolean,
		index?: number
	): HTMLElement;
	setInBasket(inBasket: boolean): void;
	getId(): string;
}

export class CardView extends Component<ICard> implements ICardView {
	protected events: IEvents;
	protected cardId: string;
	protected title: HTMLElement;
	protected image?: HTMLImageElement;
	protected description?: HTMLElement;
	protected category: HTMLElement;
	protected price: HTMLElement;
	protected galleryButton?: HTMLButtonElement;
	protected deleteButton?: HTMLButtonElement; 
	protected addToBasketButton?: HTMLButtonElement; 
	protected inBasket = false;
	protected indexElement?: HTMLElement;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		private mode: 'catalog' | 'basket'
	) {
		super(container);
		this.events = events;

		this.title = this.container.querySelector('.card__title');
		this.image = this.container.querySelector('.card__image') || undefined;
		this.description = this.container.querySelector('.card__text') || undefined;
		this.category =
			this.container.querySelector('.card__category') || undefined;
		this.price = this.container.querySelector('.card__price');
		this.indexElement =
			this.container.querySelector('.basket__item-index') || undefined;

		if (this.mode === 'catalog') {
			this.galleryButton = (this.container as HTMLButtonElement) || undefined;
			if (this.galleryButton) {
				this.galleryButton.addEventListener('click', () =>
					this.events.emit('fullCard:opened', { id: this.cardId })
				);
			}

			this.addToBasketButton =
				this.container.querySelector('.card__button') || undefined;
			if (this.addToBasketButton) {
				this.addToBasketButton.addEventListener('click', () => {
					if (this.inBasket) {
						this.events.emit('basket:remove', { id: this.cardId });
					} else {
						this.events.emit('basket:add', { id: this.cardId });
					}
				});
			}
		}

		if (this.mode === 'basket') {
			this.deleteButton =
				this.container.querySelector('.basket__item-delete') || undefined;
			if (this.deleteButton) {
				this.deleteButton.addEventListener('click', () => {
					this.events.emit('basket:remove', { id: this.cardId });
				});
			}
		}
	}

	render(
		data?: Partial<ICard>,
		inBasket?: boolean,
		index?: number
	): HTMLElement;
	render(
		cardData: Partial<ICard>,
		inBasket?: boolean,
		index?: number
	): HTMLElement;

	render(
		cardData: Partial<ICard> | undefined,
		inBasket = false,
		index?: number
	) {
		if (!cardData) return this.container;
		
		if (
			this.mode === 'basket' &&
			typeof index === 'number' &&
			this.indexElement
		) {
			this.indexElement.textContent = `${index + 1}.`;
		}

		
		if (cardData.id) this.cardId = cardData.id;
		if (cardData.title) this.title.textContent = cardData.title;
		if (cardData.image && this.image) {
			this.image.src = `${CDN_URL}${cardData.image}`;
		}

		if (cardData.description && this.description) {
			this.description.textContent = cardData.description;
		}
		if (cardData.category && this.category) {
			this.category.textContent = cardData.category;
		}

		if (cardData.price !== undefined && this.price) {
			if (cardData.price === null) {
				this.price.textContent = `Бесценно`;
			} else {
				this.price.textContent = `${cardData.price} синапсов`;
			}
		}

		this.inBasket = inBasket;
		if (this.addToBasketButton) {
			this.addToBasketButton.textContent = inBasket ? 'Убрать' : 'В корзину';
		}

		return this.container;
	}

	public setInBasket(inBasket: boolean) {
		this.inBasket = inBasket;
		if (this.addToBasketButton) {
			this.addToBasketButton.textContent = inBasket ? 'Убрать' : 'В корзину';
		}
	}

	public getId(): string {
		return this.cardId;
	}
}
