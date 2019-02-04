import { combineReducers } from 'redux';
import entriesReducer from './entriesReducer';
import collectionReducer from './collectionReducer';
import loginReducer from './loginReducer';

export default combineReducers({
    entries: entriesReducer,
    collections: collectionReducer,
    login: loginReducer
})