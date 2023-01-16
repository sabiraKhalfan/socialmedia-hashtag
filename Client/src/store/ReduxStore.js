import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";

import thunk from "redux-thunk";
import rootReducer from "../reducer";

function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store);
    localStorage.setItem("store", serializedStore);
  } catch (error) {
    console.log(error);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedStore = localStorage.getItem("store");
    if (serializedStore === null) {
      return undefined;
    }
    return JSON.parse(serializedStore);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//initial state
const persistedState = loadFromLocalStorage();

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancer(applyMiddleware(thunk))
);

//storing state to local storage whenever there is a change in store
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
