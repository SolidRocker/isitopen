import {
    FETCH_ENTRIES,
    FILTER_ENTRIES_NAME,
    FILTER_ENTRIES_DAY,
    FILTER_ENTRIES_TIME,
    FILTER_UPDATE_TYPE,
    FILTER_RESET_NAME,
    FILTER_RESET_DAYTIME,
    FILTER_COUNT  } from '../actions/types';

const initialState = {
   items: [],
   IDs: [],
   filterName: "",
   filterDay: "",
   filterTime: -1,
   filterType: -1,
   filterCount: 0
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_ENTRIES:
            return {
                ...state,
                items: action.payload,
                IDs: action.payloadID
            }

        case FILTER_ENTRIES_NAME:
            return {
                ...state,
                filterName: action.payload,
            }

        case FILTER_ENTRIES_DAY:
            return {
                ...state,
                filterDay: action.payload,
            }

        case FILTER_ENTRIES_TIME:
            return {
                ...state,
                filterTime: action.payload,
            }

        case FILTER_UPDATE_TYPE:
            return {
                ...state,
                filterType: action.payload,
            }

        case FILTER_RESET_NAME:
            return {
                ...state,
                filterName: "",
            }

        case FILTER_RESET_DAYTIME:
            return {
                ...state,
                filterDay: "",
                filterTime: -1
            }

        case FILTER_COUNT:
            return {
                ...state,
                filterCount: action.payload
            }

        default:
            return state;
    }
}