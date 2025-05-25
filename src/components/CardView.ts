import { ICardPublicInfo } from '../types/index';
import { IEvents } from '../components/base/events';


export class CardView{
    private data: ICardPublicInfo;
    private element: HTMLElement;
    private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

    render(card: ICardPublicInfo, onClick: (card: ICardPublicInfo) => void): HTMLElement{
        this.data = card;

        const template = document.querySelector<HTMLTemplateElement>('#card-catalog');
        const cardContent = template.content.firstElementChild?.cloneNode(true) as HTMLElement;

        const cardCategory = cardContent.querySelector('.card__category');
        const cardTitle = cardContent.querySelector('.card__title');
        const cardImage = cardContent.querySelector('.card__image') as HTMLImageElement;
        const cardPrice = cardContent.querySelector('.card__price');

        cardCategory.textContent = card.category;
        cardTitle.textContent = card.title;
        cardImage.textContent = card.image;
        cardPrice.textContent = `${card.price} синапсисов`;

        this.element = cardContent;
        this.setEventListeners(onClick);

        return this.element
    };

    setEventListeners(onClick: (card: ICardPublicInfo) => void): void{
        this.element.addEventListener('click', () => {
            onClick(this.data)
        })
    }

}