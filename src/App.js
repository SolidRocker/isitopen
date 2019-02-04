import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './components/store';
import Filter from './components/filter'
import EntryList from './components/entryList';
import Collection from './components/collection';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <header className="app-header">
            <h2>
              IS IT OPEN?
            </h2>
            <div className="subtitle">
              Your one stop service for hunger pangs
            </div>
          </header>

          <Collection/>
          <Filter/>
          <EntryList/>

        </div>
      </Provider>
    );
  }
}
export default App;
