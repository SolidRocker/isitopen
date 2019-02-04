import { LOGIN_USER, UPDATE_USER, GET_USER } from './types';
import db from '../components/db';

export const loginUser = (status) => dispatch => {

    dispatch({
        type: LOGIN_USER,
        payload: status
    })
}

export const addUser = (newEmail, newName) => dispatch => {

    // DB Structure (list) for each new user.
    var list = {
        name: "Create New...",
        isCreated: false,
        restaurants: [],
    };

    var user = {
        lists: [list, list, list],
        shares: [],
        name: newName
    }

    db.collection("users").doc(newEmail)
    .set(user)
    .then(() => dispatch({
        type: UPDATE_USER,
        payload: user,
        payloadEmail: newEmail
    }))
    .then(() =>  dispatch({
        type: LOGIN_USER,
        payload: true
    }));
}

export const updateUser = (user, userEmail) => dispatch => {
    dispatch({
        type: UPDATE_USER,
        payload: user,
        payloadEmail: userEmail
    });
}

export const getUser = (cUserEmail) => dispatch => {

    var user = {};
    db.collection("users").doc(cUserEmail).get().then( function(doc) {
        if(doc.exists) {
            user = doc.data(); 
        }
    })
    .then(() => dispatch({
        type: GET_USER,
        payload: user,
    }));
}