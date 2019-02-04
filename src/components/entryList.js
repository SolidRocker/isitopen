import React, {Component} from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import { fetchEntry, filterCount, addToList } from '../actions/entryActions';
import { getUser } from '../actions/loginActions';
import '../css/entryList.css';
import '../css/modal.css';

class EntryList extends Component {

    componentDidMount() {
        this.props.fetchEntry();
    }

    // Generate a 5 character string for index purposes.
    generateRandomID() {
        var randomID = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(var i = 0; i < 5; ++i)
            randomID += possible.charAt(Math.floor(Math.random() * possible.length));

        return randomID;
    }

    getNextDayString(today) {
        switch(today) {
            case 'mon':
                return 'tue';
            case 'tue':
                return 'wed';
            case 'wed':
                return 'thu';
            case 'thu':
                return 'fri';
            case 'fri':
                return 'sat';
            case 'sat':
                return 'sun';
            case 'sun':
                return 'mon';
            default:
                return 'default';
        }
    }

    isOpen(entry) {
        // If either day or time is not set, we don't filter.
        if(this.props.filterDay === "" || this.props.filterTime === -1) {
            return true;
        }

        var openTime;
        var closeTime;

        // In the DB, the 'usual' opening hours are stores in variable 'default'.
        // For other days with a different opening/closing time, they have their own field (ie mon, wed, sun).
        // So, we first check if any of these different hours exist. If not, use the default times.
        if(entry.openhours.hasOwnProperty(this.props.filterDay)) {
            openTime = entry.openhours[this.props.filterDay];
        }
        else {
            openTime = entry.openhours.default;
        }

        if(entry.closehours.hasOwnProperty(this.props.filterDay)) {
            closeTime = entry.closehours[this.props.filterDay];
        }
        else {
            closeTime = entry.closehours.default;
        }

        // If the place opens past midnight, we look for next day's closing time, and add more hours to it.
        if(closeTime < openTime) {
            var nextDay = this.getNextDayString(this.props.filterDay);
            if(entry.closehours.hasOwnProperty(nextDay)) {
                closeTime = entry.closehours[nextDay];
            }
            else {
                closeTime = entry.closehours.default;
            }
            // If past midnight, check for the closed times instead, and invert the result.
            return !(openTime >= this.props.filterTime && closeTime < this.props.filterTime+100);
        }

        // Checks if filter time is between opening and closing hours.
        return openTime <= this.props.filterTime && closeTime > this.props.filterTime+100;
    }

    renderAddCollectionText() {

        for(var i = 0; i < 3; ++i) {
            if(this.props.cUser.lists[i].isCreated) {
                return "Choose a list to add the restaurant to.";
            }
        }
        return "Please create at least 1 list before adding restaurants!";
       
    }

    renderAddListButton(cID, entryName, closeCallBack) {
        let disp = null;

        // We don't display the uncreated lists.
        if(!this.props.cUser.lists[cID].isCreated)
            return disp;

        // Only add if the restaurant does not exist in the list already.
        var doesExist = false;
        for(var i = 0; i < this.props.cUser.lists[cID].restaurants.length; ++i) {
            if(entryName === this.props.cUser.lists[cID].restaurants[i]) {
                doesExist = true;
                break;
            }
        }

        if(doesExist) {
            disp = 
            <span>
                <Popup lockScroll={true} trigger={<button className={"modal-button"+cID}>{this.props.cUser.lists[cID].name}</button>} modal>
                {confirm => (
                    <div>
                        <div className="modal-header">RESTAURANT ALREADY EXIST</div>
                        <div className="modal-content">{entryName} already exists in Collection {this.props.cUser.lists[cID].name}.</div>
                        <span><button className="modal-button-ok" onClick={() => {
                            confirm();
                            closeCallBack();
                            }}>
                            OK</button>
                        </span>
                    </div>
                )}
                </Popup>
            </span>
        }
        else {
            disp = 
                <span>
                    <Popup lockScroll={true} trigger={<button className={"modal-button"+cID}>{this.props.cUser.lists[cID].name}</button>} modal>
                    {confirm => (
                        <div>
                            <div className="modal-header">RESTAURANT ADDED!</div>
                            <div className="modal-content">{entryName} successfully added to {this.props.cUser.lists[cID].name}!</div>
                            <span><button className="modal-button-ok" onClick={() => {
                                confirm();
                                closeCallBack();
                                this.props.addToList(this.props.cUserEmail, cID, entryName, this.props.getUser);
                                }}>
                                OK</button>
                            </span>
                        </div>
                    )}
                    </Popup>
                </span>
        }
        return disp;
    }

    renderAddList(entryName) {
        return (
        <Popup lockScroll={true} trigger={<button disabled={!this.props.isLoggedIn} className="button">{this.props.isLoggedIn ? "Add To Collection" : "Login To View"}</button>} modal>
        {close => (
            <div className="modal-section">
                <div className="modal-header">
                    <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                    ADD RESTAURANT TO COLLECTION
                </div>
                <div className="modal-content">{this.renderAddCollectionText()}</div>
                    {this.renderAddListButton(0, entryName, close)}
                    {this.renderAddListButton(1, entryName, close)}
                    {this.renderAddListButton(2, entryName, close)}
                </div>
            )}
        </Popup>
        )
    }

    renderEntry = (entry) => {
        const rID = this.generateRandomID();

        return (
        <tr key={rID} className="tr-entries">
            <td key={rID+1}>{entry.name}</td>
            <td key={rID+2}>{entry.dispHours}</td>
            <td key={rID+3} style={{textAlign:"center"}}>{this.renderAddList(entry.name)}</td>
        </tr>
        )
    }

    renderHeader() {
        const rID = this.generateRandomID();
        return (
        <tr key={rID}>
            <th key={rID+1} className="header-restaurant">RESTAURANT</th>
            <th key={rID+2} className="header-hours">OPENING HOURS</th>
            <th key={rID+3} style={{textAlign:"center"}} className="header-support">COLLECTION</th>
        </tr>
        )
    }

    renderEntries() {

        // Filter by name
        if(this.props.filterType === 0 && this.props.filterName !== "") {
            const entries = this.props.entries.map( entry => {
                if(entry.name === this.props.filterName) {
                    return this.renderEntry(entry);
                }
                return null;
            })
            return entries;
        }

        // Filter by day
        if(this.props.filterType === 1) {
            const entries = this.props.entries.map( entry => {
                if(this.isOpen(entry)) {
                    return this.renderEntry(entry);
                }
                return null;
            })
            return entries;
        }

        // If not both, revert to default list, which shows all entries.
        const entries = this.props.entries.map( entry => {
            return this.renderEntry(entry);
        });
        return entries;
    }

    render() {

        const allEntries = this.renderEntries();
        //this.props.filterCount(allEntries.length);

        return (
        <table style={{textAlign:'left'}}>
            <tbody>
                {this.renderHeader()}
                {allEntries}
            </tbody>
        </table>
        )
    }
}

const mapStateToProps = state => ({
    entries: state.entries.items,
    cUser: state.login.cUser,
    cUserEmail: state.login.cUserEmail,
    isLoggedIn: state.login.isLoggedIn,

    filterName: state.entries.filterName,
    filterDay: state.entries.filterDay,
    filterTime: state.entries.filterTime,
    filterType: state.entries.filterType,
    filterCount: state.entries.filterCount
});

export default connect(mapStateToProps, {fetchEntry, filterCount, addToList, getUser})(EntryList);