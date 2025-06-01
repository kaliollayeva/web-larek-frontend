import { IEvents } from './base/events';

export class HeaderView {
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLSpanElement;
  public events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.events = events;

    this.basketButton = container.querySelector('.header__basket')!;
    this.basketCounter = container.querySelector('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:opened');
    });

  }

  updateBasketCount(count: number): void {
    this.basketCounter.textContent = String(count);
  }
}
