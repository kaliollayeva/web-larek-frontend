import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ICardPublicInfo, ICard, ICardBasketInfo } from './types/index';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { CardsData } from './components/CardsData';
import { UserData } from './components/UserData';
import { CatalogView } from './components/CatalogView';
import { CardView } from './components/CardView';
import { ModalView } from './components/ModalView';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import { OrderFormView } from './components/OrderFormView';
import { SuccessView } from './components/SuccessView';

// 1. Основные зависимости
const api = new Api(API_URL);
const events = new EventEmitter();
const cardsData = new CardsData(events);
const userData = new UserData();

// 2. DOM элементы
const gallery = document.querySelector('.gallery') as HTMLElement;
const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;

const basketButton = document.querySelector('.header__basket');
const basketCounter = document.querySelector(
	'.header__basket-counter'
) as HTMLElement;

const catalogView = new CatalogView(gallery);
const modalContainer = document.querySelector('.modal') as HTMLElement;
const modalView = new ModalView(modalContainer, events);
const basketModel = new BasketModel(events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderAddressView = new OrderFormView(
	cloneTemplate(orderTemplate),
	events
);
const сontactsView = new OrderFormView(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

api
	.get('/product')
	.then((data: ApiListResponse<ICard>) => {
		console.log('Ответ от API:', data);
		cardsData.cards = data.items;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

basketButton.addEventListener('click', () => {
	events.emit('basket:opened');
});

function renderBasketView(): HTMLElement {
	const items = basketModel.items;
	const total = basketModel.total;

	const renderedBasketCards = items.map((item, index) => {
		const basketCard = new CardView(
			cloneTemplate(cardBasketTemplate),
			events,
			'basket'
		);
		return basketCard.render(item, true, index);
	});

	return basketView.render(renderedBasketCards, total);
}

const catalogCardInstances: CardView[] = [];
events.on('initialData:loaded', () => {
	const cardsArray = cardsData.getCards();
	console.log('Карточки после загрузки:', cardsArray);

	const renderedCards = cardsArray.map((card) => {
		const cardInstant = new CardView(
			cloneTemplate(cardCatalogTemplate),
			events,
			'catalog'
		);

		const isInBasket = basketModel.items.some((item) => item.id === card.id);

		catalogCardInstances.push(cardInstant);
		const cardElement = cardInstant.render(card, isInBasket);
		return cardElement;
	});
	catalogView.catalog = renderedCards;
});

events.on('fullCard:opened', ({ cardData }: { cardData: ICard }) => {
	const fullCardView = new CardView(
		cloneTemplate(cardPreviewTemplate),
		events,
		'catalog'
	);
	const isInBasket = basketModel.items.some((item) => item.id === cardData.id);
	const rendredCard = fullCardView.render(cardData, isInBasket);
	modalView.open(rendredCard);
});

let openedBasket: HTMLElement;

events.on<{ items: ICardBasketInfo[]; total: number }>(
	'basket:changed',
	({ items, total }) => {
		userData.setBasket(total, items);
		basketCounter.textContent = `${items.length}`;

		catalogCardInstances.forEach((card) => {
			const isInBasket = items.some((item) => item.id === card.getId());
			card.setInBasket(isInBasket); // метод ты уже добавляла
		});

		openedBasket = renderBasketView();
	}
);

events.on('basket:opened', () => {
	openedBasket = renderBasketView();
	modalView.open(openedBasket);
		console.log(basketModel.items);

});

events.on('basket:checkout', () => {
	const renderedorderAddressView = orderAddressView.render();

	modalView.open(renderedorderAddressView);
	
});

events.on(
	'userData:step1',
	({ address, payment }: { address: string; payment: string }) => {
		userData.setAddress(address);
		userData.setPayment(payment);

		const renderedСontactsView = сontactsView.render();
		modalView.open(renderedСontactsView);

		console.log(userData);
	}
);

events.on('userData:step2', ({ email, phone }: { email: string; phone: string }) => {
	userData.setContacts(email, phone);
	const orderPayload = userData.summary;

	api.post('/order', orderPayload, 'POST')
		.then((response) => {
			console.log('Заказ успешно отправлен:', response);
			basketModel.clear();
			const renderedSuccessView = successView.render(orderPayload.total);
			modalView.open(renderedSuccessView);
		})
		.catch((error) => {
			console.error('Ошибка при отправке заказа:', error);
		});
});

events.on('modalSuccess:close', () => {
	userData.clear();
	basketModel.clear();
	orderAddressView.resetForm();
	сontactsView.resetForm();
	modalView.close();
});

events.on('modal:closed', () => {
	orderAddressView.resetForm();
	сontactsView.resetForm();
})
