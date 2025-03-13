import { applyMiddleware, createStore } from 'redux';
import combinedReducers from './CombineReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';


const persistConfig = {
    key: 'root',
    storage,
  };

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = createStore(persistedReducer,  composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);

export default store;
