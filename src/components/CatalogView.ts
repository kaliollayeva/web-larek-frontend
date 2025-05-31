import { Component } from '../components/base/Component';

interface ICatalogView {
    catalog: HTMLElement[];
}

export class CatalogView extends Component<ICatalogView> implements ICatalogView {
    protected _catalog: HTMLElement;

    constructor(protected container: HTMLElement) {
        super(container)
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}