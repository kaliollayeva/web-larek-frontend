import { IEvents } from '../components/base/events';

export class ModalView {
    private events: IEvents;
    private modal: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(events: IEvents, modal: HTMLElement) {
        this.events = events;
        this.modal = modal;
        this.contentContainer = this.modal.querySelector('.modal__content')!;
    }    
}