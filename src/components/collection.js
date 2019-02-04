import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchUsers, addShareList } from '../actions/collectionActions';
import '../css/collection.css'
import  CollectionList  from './collectionList';
import Login from './login';

class Collection extends Component {

    componentDidMount() {
        this.props.fetchUsers();
    }

    renderEachShared = (shareList, index) => {

        if(this.props.shareList.length === 0)
            return;

        var collectionName;
        for(var i = 0; i < this.props.userIDs.length; ++i) {
            if(this.props.userIDs[i] === shareList.email) {
                collectionName = this.props.users[i].lists[shareList.cID].name;
            }
        }

        console.log(collectionName);

        return (
        <tr key={index}>
            <td colSpan="35%"><CollectionList
                className="list-button-shared"
                id={shareList.cID}
                isShared={true}
                sharedName={collectionName}
                sharedID={index}
                sharedEmail={shareList.email}/></td>
            <td colSpan="65%">by {shareList.email}</td>
        </tr>

        )
    }

    renderAllShared() {
        const allLists = this.props.shareList.map( (sList, index) => {
                return this.renderEachShared(sList, index);
        });
        return allLists;
    }

    // Displays the header of the table, which differs according to sign-in status.
    renderCollectionHeader() {
        
        if(!this.props.isLoggedIn) {
            return (
                <tr>
                    <th colSpan="100%" className="collection-header-loggedout" style={{textAlign:"center"}}>Login to see your collections!</th>
                </tr>
            )
        }

        return (
            <tr>
                <th colSpan="100%" className="collection-header">YOUR COLLECTIONS</th>
            </tr>
        )
    }

    // Renders the Collections buttons.
    renderCollectionTable() {

        if(!this.props.isLoggedIn)
            return null;

        return (
            <tr>
                <td colSpan="33%"><CollectionList id="0" className="list-button0" isFriend={false} /></td>
                <td colSpan="33%"><CollectionList id="1" className="list-button1" isFriend={false}/></td>
                <td colSpan="34%"><CollectionList id="2" className="list-button2" isFriend={false}/></td>
            </tr>
        )
    }

    // Displays the header of the table, which differs according to sign-in status.
    renderSharedHeader() {
        if(!this.props.isLoggedIn) {
            return null;
        }

        if(this.props.cUser.shares.length === 0)
            return null;

        return (
            <tr>
                <th colSpan="100%" className="collection-header">SHARED COLLECTIONS</th>
            </tr>
        )
    }

    // Renders the Collections buttons.
    renderSharedTable() {
        if(!this.props.isLoggedIn)
            return null;

        if(this.props.cUser.shares.length === 0)
            return null;

        return this.renderAllShared();
    }
    
    render() {
        return (
            <table> 
                <tbody>
                    <Login/>
                    {this.renderCollectionHeader()}
                    {this.renderCollectionTable()}
                    {this.renderSharedHeader()}
                    {this.renderSharedTable()}
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = state => ({
    users: state.collections.items,
    userIDs: state.collections.IDs,
    shareList: state.collections.shareList,
    isLoggedIn: state.login.isLoggedIn,
    cUser: state.login.cUser
});


export default connect(mapStateToProps, {fetchUsers, addShareList})(Collection);