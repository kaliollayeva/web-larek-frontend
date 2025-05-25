import './scss/styles.scss';
import {Api, ApiListResponse} from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ICardPublicInfo } from './types/index';

const api = new Api(process.env.API_ORIGIN!);
const events = new EventEmitter();

const cardItems = api.get('/product')
.then((data: ApiListResponse<ICardPublicInfo>) => {
    return data.items;
})

console.log(cardItems)
