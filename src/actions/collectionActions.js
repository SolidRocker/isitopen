import { FETCH_USERS, GET_SHARE_LIST, ADD_SHARE_LIST } from './types';
import db from '../components/db';

export const fetchUsers = () => dispatch => {

    const allUsers = [];
    const allIDs = [];
    db.collection("users").get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let uData = doc.data();
            let uID = doc.id;
            allUsers.push(uData);
            allIDs.push(uID);
        })
    })
    .then(() => dispatch({
        type: FETCH_USERS,
        payload: allUsers,
        payloadID: allIDs
    }));
}

export const initList = (cUserEmail, cID, cName, callBack) => dispatch => {

    var user = {};
    db.collection("users").doc(cUserEmail).get()
    .then( function(doc) {
        if(doc.exists) {
            user = doc.data(); 
        }   
    })
    .then(() => {
        user.lists[cID].isCreated = true;
        user.lists[cID].name = cName;
        db.collection("users").doc(cUserEmail).set(user);
    })
    .then(() => {
        callBack(cUserEmail);
    });
}

export const renameList = (cUserEmail, cID, newListName, callBack = null) => dispatch => {

    console.log(cUserEmail + ", " + cID + ", " + newListName);
    let user = {};
    db.collection("users").doc(cUserEmail).get().then( function(doc) {
        if(doc.exists) {
            user = doc.data();
        }   
    })
    .then(() => {
        user.lists[cID].name = newListName;
    })
    .then(() => {
        db.collection("users").doc(cUserEmail).set(user);
    })
    .then(() => {
        if(callBack) {
            callBack(cUserEmail);
        }
    })
}

export const shareList = (cUserEmail, cFriendEmail, fID, callBack = null) => dispatch => {

    var user = {};
    var friendData = {
        email: cUserEmail,
        cID: fID
    };

    db.collection("users").doc(cFriendEmail).get().then( function(doc) {
        if(doc.exists) {
            user = doc.data();
        }   
    })
    .then(() => {
        user.shares.push(friendData);
        db.collection("users").doc(cFriendEmail).set(user);
    })
    .then(() => {
        if(callBack)
            callBack(cFriendEmail);
    });
}

export const getFriendShareList = (cUserEmail) => dispatch => {

    var allShared = [];
    db.collection("users").doc(cUserEmail).get().then(function(doc) {
        if(doc.exists) {
            allShared = doc.data().shares;
        }
    })
    .then(() => dispatch({
        type: GET_SHARE_LIST,
        payload: allShared,
    }))
}

export const addShareList = (cList, newEntry) => dispatch => {

    var rList = cList;
    rList.push(newEntry);
    dispatch({
        type: ADD_SHARE_LIST,
        payload: rList
    });
}
