import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {alertSlice} from './empalerts';
import {userSlice} from './userSlice';

const rootReducer = combineReducers({
    alerts : alertSlice.reducer,
    user : userSlice.reducer,

});

const empstore  = configureStore({
    reducer : rootReducer,
   

});

export default empstore;
