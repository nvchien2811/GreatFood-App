/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './Navigation/App';
import BottomNav from './Navigation/BottomNav';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import store from './Redux/store';
export default function run(){
    return(
        <Provider store={store}>
            <App/>
        </Provider>
    )
}
AppRegistry.registerComponent(appName, () => run);
