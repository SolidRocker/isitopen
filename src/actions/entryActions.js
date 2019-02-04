import {
    FETCH_ENTRIES,
    FILTER_ENTRIES_NAME,
    FILTER_ENTRIES_DAY,
    FILTER_ENTRIES_TIME,
    FILTER_UPDATE_TYPE,
    FILTER_RESET_NAME,
    FILTER_RESET_DAYTIME,
    FILTER_COUNT } from './types';
import db from '../components/db';

export const fetchEntry = () => dispatch => {

    const allEntries = [];
    const allIDs = [];
    db.collection("restaurants").get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let eData = doc.data();
            let eID = doc.id;
            allEntries.push(eData);
            allIDs.push(eID);
        })
    })
    .then(() => dispatch({
        type: FETCH_ENTRIES,
        payload: allEntries,
        payloadID: allIDs
    }));
}

export const filterEntryByName = (name) => dispatch => {

    dispatch({
        type: FILTER_ENTRIES_NAME,
        payload: name
    });
}

export const filterEntryByDay = (day) => dispatch => {

    dispatch({
        type: FILTER_ENTRIES_DAY,
        payload: day
    });
}

export const filterEntryByTime = (time) => dispatch => {

    dispatch({
        type: FILTER_ENTRIES_TIME,
        payload: time
    });
}

export const filterUpdateType = (type) => dispatch => {

    dispatch({
        type: FILTER_UPDATE_TYPE,
        payload: type
    });

    dispatch({
        type: FILTER_RESET_NAME
    });

    dispatch({
        type: FILTER_RESET_DAYTIME
    });
}

export const filterCount = (count) => dispatch => {
    dispatch({
        type: FILTER_COUNT,
        payload: count
    });
}

export const addToList = (cUserEmail, cID, cName, callBack) => dispatch => {

    var user = {};
    db.collection("users").doc(cUserEmail).get().then( function(doc) {
        if(doc.exists) {
            user = doc.data(); 
        }   
    })
    .then(() => {
        user.lists[cID].restaurants.push(cName);
    })
    .then(() => {
        db.collection("users").doc(cUserEmail).set(user);
    })
    .then(() => {
        callBack(cUserEmail);
    })
}