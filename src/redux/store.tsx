import React from "react";
import {Provider} from "react-redux";
import {ChildrenProps} from "../types/types";
import {configureStore} from "@reduxjs/toolkit";
import TodosReducer from './todo-slice'
import TodosPalleteReducer from './todo-pallete-options-slice'
import TodosFrameReducer from './todo-frames-slice'


const store = configureStore({
    reducer: {
        todos: TodosReducer,
        todoPalleteOptions: TodosPalleteReducer,
        todoFrames: TodosFrameReducer
    },

})


export const StateProvider = ({children}: ChildrenProps) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>

    )
}


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

