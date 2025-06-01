export interface ICard {
    id: string;
    title: string;
    image: string;
    description: string;
    category: string;
    price: number | null;
}

export interface IUser {
    payment: string;
    email: string;
    phone: string; 
    address: string;   
}

// Данные карточки, используемые в каталоге
export type ICardPublicInfo = Pick<ICard, 'id' | 'category' | 'title' | 'image' | 'price' >;

// Данные карточки, используемые в модальном окне
export type ICardFullInfo = Pick<ICard, 'id' | 'category' | 'title' | 'image' | 'price' | 'description'>;

// Данные карточки, используемые в корзине
export type ICardBasketInfo = Pick<ICard, 'id' | 'title' | 'price' >;


