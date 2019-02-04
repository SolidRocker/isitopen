import {
    FETCH_USERS,
    GET_SHARE_LIST,
    RENAME_LIST,
    ADD_SHARE_LIST
 } from '../actions/types';
    
const collectionState = {
    items: [],
    IDs: [],
    shareList: [],
    rList: []
}

export default function(state = collectionState, action) {
    switch(action.type) {
        case FETCH_USERS:
            return {
                ...state,
                items: action.payload,
                IDs: action.payloadID
            }

        case RENAME_LIST:
            return {
                ...state,
                friendList: action.payload,
                friendListCIDs: action.friendListCIDs,
                friendListEmails: action.payloadEmails
            }

        case GET_SHARE_LIST:
            return {
                ...state,
                shareList: action.payload
            }

        case ADD_SHARE_LIST:
            return {
                ...state,
                rList: action.payload
            }

        default:
            return state;
        }
}