import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from "./Redux/Reducer";
import Root from './Root'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk));


render(<Root store={store} />, document.getElementById('root'))
