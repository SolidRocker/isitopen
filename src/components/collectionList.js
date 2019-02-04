import React, {Component} from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import { initList, shareList, renameList } from '../actions/collectionActions';
import { getUser } from '../actions/loginActions';
import '../css/collectionList.css'

class CollectionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cID: this.props.id,
            textInput: "",
            renameListInput: "",
            friendEmail: "",

            displayPopup: false,
            pTitle: "",
            pDesc: "",

            // Extra params for if this list is a shared list.
            isShared: this.props.isShared,
            sharedName: this.props.sharedName,
            sharedID: this.props.sharedID,
            sharedEmail: this.props.sharedEmail
        }
        this.createList = this.createList.bind(this);
        this.changeName = this.changeName.bind(this);
        this.shareWithFriend = this.shareWithFriend.bind(this);
        this.createListTextChange = this.createListTextChange.bind(this);
        this.shareListUserChange = this.shareListUserChange.bind(this);
        this.renameListChange = this.renameListChange.bind(this);
    }

    // Creates a new list.
    createList(closeCallBack) {
        if(this.state.textInput == null)
            return;

        this.props.initList(this.props.cUserEmail, this.state.cID, this.state.textInput, this.props.getUser);
        closeCallBack();
    }

    changeName(closeCallBackMain, closeCallBackSub) {
        return (
            <Popup lockScroll={true} trigger={<button className="modal-button-ok" disabled={this.state.renameListInput===""}>Change</button>} modal>
            {close => (
                <div className="modal-section">
                    <div className="modal-header">
                        <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                        COLLECTION RENAMED
                    </div>
                    <div className="modal-content">Collection successfully renamed!</div>
                        <span><button className="modal-button-ok" onClick={() => {
                            
                            if(this.state.isShared) {
                                this.props.renameList(this.state.sharedEmail, this.state.cID, this.state.renameListInput);
                            }
                            else {
                                this.props.renameList(this.props.cUserEmail, this.state.cID, this.state.renameListInput, this.props.getUser);
                            }
                            close();
                            closeCallBackSub();
                            closeCallBackMain();
                        }}>
                        Back</button></span>
                </div>
            )}
        </Popup>
        )
    }

    renameList(closeCallBack) {
        return (
            <Popup lockScroll={true} trigger={<button className="modal-button-ok">Rename</button>} modal>
                {close => (
                    <div className="modal-section">
                        <div className="modal-header">
                            <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                            RENAME COLLECTION
                        </div>
                        <div className="modal-content">Rename Collection:</div>
                            <div><input className="modal-input" type="text" name="Share Name" value={this.state.renameListInput} onChange={this.renameListChange}/></div>
                            {this.changeName(closeCallBack, close)}
                    </div>
                )}
            </Popup>
        )
    }

    // Displays the current list
    viewList() {

        // If the clicked list does not exist, we create one instead.
        if(!this.props.cUser.lists[this.state.cID].isCreated) {
            return this.createList();
        }

        var allRestaurants = this.props.cUser.lists[this.state.cID].restaurants.map( (restaurant, index) => {
            return <div key={index}>{restaurant}</div>;
        });

        if(allRestaurants.length === 0) {
            allRestaurants = "This collection is empty.";
        }
        return allRestaurants;
    }

    viewSharedList() {

        var tmpRestaurants = [];
        var foundUser = false;

        for(var i = 0; i < this.props.userIDs.length; ++i) {
            if(foundUser) {
                break;
            }
            if(this.props.userIDs[i] === this.state.sharedEmail) {
                foundUser = true;
                for(var j = 0; j < this.props.users[i].lists[this.state.cID].restaurants.length; ++j) {
                    tmpRestaurants.push(this.props.users[i].lists[this.state.cID].restaurants[j]);
                }
            }
        }

        var allRestaurants = tmpRestaurants.map( (restaurant, index) => {
            return <div key={index}>{restaurant}</div>
        });

        if(tmpRestaurants.length === 0) {
            allRestaurants = "This collection is empty.";
        }
        return allRestaurants;
    }

    // Share list with friend
    shareWithFriend = () => {

        // Check if sharing with self
        if(this.state.friendEmail === this.props.cUserEmail) {
            this.setState({
                pTitle: "SHARING ERROR",
                pDesc: "Cannot share collections with yourself!",
                displayPopup: true
            });
            return;
        }

        // Check if the user exists.
        var friendExists = false;
        for(var i = 0; i < this.props.userIDs.length; ++i) {
            if(this.props.userIDs[i] === this.state.friendEmail) {
                friendExists = true;
                break;
            }
        }

        if(friendExists) {
            // Check if the user already has the list.
            var hasList = false;
            for(i = 0; i < this.props.cUser.shares.length; ++i) {
                if(this.props.cUser.shares[i].email === this.state.friendEmail &&
                    this.props.cUser.shares[i].cID === this.state.cID ) {
                    hasList = true;
                    break;
                }
            }

            if(hasList) {
                this.setState({
                    pTitle: "SHARING ERROR",
                    pDesc: "The user already has this list!",
                    displayPopup: true
                });
                return;
            }

            // Insert if nothing wrong with input
            this.setState({
                pTitle: "SHARING SUCCESSFUL",
                pDesc: this.props.cUser.lists[this.state.cID].name + " collection successfully shared with " + this.state.friendEmail + "!",
                displayPopup: true
            });

            this.props.shareList(this.props.cUserEmail, this.state.friendEmail, this.state.cID);
            return;
        }
        else {
            this.setState({
                pTitle: "CANNOT FIND USER",
                pDesc: "Cannot find user " + this.state.friendEmail + "!",
                displayPopup: true
            });
        }
    }

    getStyling() {
        if(this.state.isShared) {
            return "list-button-shared";
        }
        return "list-button" + this.state.cID;
    }

    renameListChange(event) {
        this.setState({renameListInput: event.target.value});
    }

    shareListUserChange(event) {
        this.setState({friendEmail: event.target.value});
    }

    createListTextChange(event) {
        this.setState({textInput: event.target.value});
    }

    processListSelection() {
        let disp = null;

        // Shared list
        if(this.state.isShared) {
            disp =  
            close => (
                <div className="modal-section">
                    <div className="modal-header">{this.state.sharedName}
                        <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                        &nbsp;collection
                    </div>
                    <div className="modal-content">{this.viewSharedList()}</div>
                    {this.renameList(close)}
                    <span><button className="modal-button-ok" onClick={() => {close()}}>Close</button></span>
                </div>
            )
        }
        else {

            // If there is a list, we view it. Otherwise, we create one.
            if(this.props.cUser.lists[this.state.cID].isCreated) {
                disp =  
                close => (
                    <div className="modal-section">
                        <div className="modal-header">{this.props.cUser.lists[this.state.cID].name}
                            <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                            &nbsp;collection
                        </div>
                        <div className="modal-content">{this.viewList()}</div>
                        {this.renderShareButton(close)}
                        {this.renameList(close)}
                        <span><button className="modal-button-ok" onClick={() => {close()}}>Close</button></span>
                    </div>
                )
            }
            else {
                disp = 
                close => (
                    <div className="modal-section">
                        <div className="modal-header">
                            <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                            CREATE NEW COLLECTION
                        </div>
                        <div className="modal-content">Enter a name for the new collection</div>
                        <div><input className="modal-input" type="text" name="Collection Name" value={this.state.textInput} onChange={this.createListTextChange}/></div>
                        <span><button className="modal-button-ok" disabled={this.state.textInput===""} onClick={() => this.createList(close)}>Create</button></span>
                    </div>
                )
            }
        }
        return disp;
    }

    renderShareButton(closeCallBack) {
        return (
            <Popup lockScroll={true} trigger={<button className="modal-button-share">Share</button>} modal>
            {close => (
                <div className="modal-section">
                    <div className="modal-header">
                        <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                        SHARE COLLECTION
                    </div>
                    <div className="modal-content">Who do you want to share the list with?</div>
                        <div><input className="modal-input" type="text" name="Share Name" value={this.state.friendEmail} onChange={this.shareListUserChange}/></div>
                        <span><button className="modal-button-ok" disabled={this.state.friendEmail===""} onClick={() => this.shareWithFriend()}>Share</button></span>
                        {this.displayGenericPopup()}
                </div>
            )}
        </Popup>
        )
    }

    displayGenericPopup() {
        if(this.state.displayPopup) {
            return (
                <Popup lockScroll={true} open={this.state.displayPopup} modal>
                {close => (
                    <div className="modal-section">
                        <div className="modal-header">
                            <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                            {this.state.pTitle}
                        </div>
                        <div className="modal-content">{this.state.pDesc}<br/>&nbsp;</div>
                            <span><button className="modal-button-ok" disabled={this.state.createListTextChange===""} onClick={() => {
                                this.setState({displayPopup: false});
                                close();
                                }}>
                                Back
                            </button></span>
                    </div>
                )}
                </Popup>
            )
        }
    }

    // Check if cUser is popoulated before trying to render.
    renderListName() {
        if(this.state.isShared) {
            return this.state.sharedName;
        }
        if(this.props.cUser && this.props.cUser.lists && this.props.cUser.lists[this.state.cID] && this.props.cUser.lists[this.state.cID].name)
            return this.props.cUser.lists[this.state.cID].name;
        return null;
    }

    render() {
        return (
            <Popup lockScroll={true} trigger={<button className={this.getStyling()} onClick={() => this.onClickList()}>{this.renderListName()}</button>} modal>
                {this.processListSelection()}
            </Popup>
        )
    }
}

const mapStateToProps = state => ({
    users: state.collections.items,
    userIDs: state.collections.IDs,
    rList: state.collections.rList,
    cUser: state.login.cUser,
    cUserEmail: state.login.cUserEmail,
});

export default connect(mapStateToProps, {initList, shareList, renameList, getUser})(CollectionList);