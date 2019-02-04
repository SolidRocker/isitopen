import {
    LOGIN_USER,
    UPDATE_USER,
    GET_USER } from '../actions/types';
    
const loginState = {
    cUser: {},
    cUserEmail: "",
    isLoggedIn : false
}

export default function(state = loginState, action) {
    switch(action.type) {
        case LOGIN_USER:
            return {
                ...state,
                isLoggedIn: action.payload
            }

        case UPDATE_USER:
            return {
                ...state,
                cUser: action.payload,
                cUserEmail: action.payloadEmail
            }

        case GET_USER:
            return {
                ...state,
                cUser: action.payload
            }

        default:
            return state;
        }
}