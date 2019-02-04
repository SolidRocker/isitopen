import React, {Component} from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import { loginUser, addUser, updateUser } from '../actions/loginActions';
import { getFriendShareList } from '../actions/collectionActions';
import '../css/login.css';
import '../css/modal.css';
import db from '../components/db';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cUsername: "",
            inputEmail: "johnsmith@gmail.com"
        }
        this.onClickLogin = this.onClickLogin.bind(this);
        this.createListEmailChange = this.createListEmailChange.bind(this);
    }

    // Logs the user in if he exists in database.
    login(userEmail) {
        db.collection("users").doc(userEmail).get().then((doc) => {
            this.props.updateUser(doc.data(), userEmail);
        })
        .then(() => {
            this.setState({cUsername: this.props.cUser.name}, () => {
                this.props.loginUser(true);
            });
        })
        .then(() => {
                this.props.getFriendShareList(userEmail);
        })
    }

    // Login method
    onClickLogin = (closeCallBack) => {

        var userName;
        // Find userin db. If cannot find, create new entry.
        var isNewUser = true;
        for(var i = 0; i < this.props.noofUsers; ++i ) {
            if(this.state.inputEmail === this.props.userIDs[i]) {
                isNewUser = false;
                break;
            }
        }

        if(isNewUser) {
            // Name input for new user
            if(this.state.inputEmail.search("@") === -1)
                userName = this.state.inputEmail;
            else {
                userName = this.state.inputEmail.substring(0, this.state.inputEmail.search("@"));
            }

            this.setState({cUsername: userName}, () => {
                this.props.addUser(this.state.inputEmail, userName, this.props.loginUser);
            });
        }
        else {
            this.login(this.state.inputEmail);
        }
        closeCallBack();
    }

    // A simple feedback message to the user's status.
    renderUserLabel() {
        if(this.props.isLoggedIn) {
            return "Welcome, " + this.state.cUsername;
        }
        return "Hello, Guest";
    }

    createListEmailChange(event) {
        this.setState({inputEmail: event.target.value});
    }

    // Only show the button if the user is not logged in.
    renderLoginButton() {
        if(this.props.isLoggedIn) {
            return null;
        }
        return (
            <Popup lockScroll={true} trigger={<button className="login-button" onClick={() => this.onClickLogin()}>Log In</button>} modal>
                {close => (
                    <div className="modal-section" style={{textAlign:"center"}}>
                        <div className="modal-header">
                            LOG IN/SIGN UP
                            <span className="modal-button-crossicon" onClick={() => {close()}}>&times;</span>
                        </div>
                        <div className="modal-content">Enter your email address</div>
                        <div><input className="modal-input" type="text"  name="Login" value={this.state.inputEmail} onChange={this.createListEmailChange}/></div>
                        <span><button className="modal-button-ok" onClick={() => {this.onClickLogin(close)}}>Log In</button></span>
                    </div>
            )}
            </Popup>
        )
    }

    render() {
        return (
            <tr>
                <th colSpan="50%" className="login-header">{this.renderLoginButton()}</th>
                <th colSpan="50%" className="login-userlabel">{this.renderUserLabel()}</th>
            </tr>
        )
    }
}

const mapStateToProps = state => ({
    noofUsers: state.collections.items.length,
    userIDs: state.collections.IDs,
    cUser: state.login.cUser,
    isLoggedIn: state.login.isLoggedIn
});

export default connect(mapStateToProps, {loginUser, addUser, updateUser, getFriendShareList})(Login);