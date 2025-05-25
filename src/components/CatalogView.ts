
export class CatalogView {
    private container: HTMLElement;

    constructor(container: HTMLElement){
        this.container = container;
    }

    renderCatalog(cardElements: HTMLElement[]): void{
        cardElements.forEach((card) => {
            this.container.appendChild(card);
        })
    }
}