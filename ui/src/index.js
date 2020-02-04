import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from "redux";
import {persistReducer, persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'
import App from './components/common/App'
import reducers from "./reducers/index";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
            <App/>
        </PersistGate>
    </Provider>,
    document.getElementById("root"));