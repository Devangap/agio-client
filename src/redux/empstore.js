import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {alertSlice} from './empalerts';

const rootReducer = combineReducers({
    alerts : alertSlice.reducer,

});

const empstore  = configureStore({
    reducer : rootReducer,
   

});

export default empstore;
