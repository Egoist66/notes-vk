import {TodosOptions, TodosOptionsForSlice} from '../types/types';
import {LS} from "../hooks/hooks";
import {createSlice} from "@reduxjs/toolkit";

const {save, ls, get, remove} = LS()

 interface InitialStateType {
    todos: TodosOptions[],
    matchedTodos: TodosOptions[],

}

const initialState: InitialStateType = {
    todos: [],
    matchedTodos: [],


}

const todoSlice = createSlice({
    name: 'todo-app',
    initialState,
    reducers: {
        addTodo(state, action: TodosOptionsForSlice) {
            state.todos.unshift(action.payload)
            state.matchedTodos.unshift(action.payload)
            save('todos', state.todos)

        },

        deleteItems(state, action) {
            state.matchedTodos = state.todos.filter(item => item.id !== action.payload)
            state.todos = state.todos.filter(item => item.id !== action.payload)

            save('todos', state.todos)
        },

        setTodoFromLS(state) {
            if ('todos' in ls) {
                state.todos = get('todos')
                state.matchedTodos = state.todos

            }

        },


        toggleComplete(state, action) {
            const item = state.matchedTodos.find(item => item.id === action.payload)
            const item2 = state.todos.find(item => item.id === action.payload)

            if (item && item2) {
                item.completed = !item.completed
                item2.completed = !item2.completed

            }

            save('todos', state.todos)
        },

        clearTasks(state) {

            if (get('todos')) {
                remove('todos')

                state.todos = []
                state.matchedTodos = []
            }

        },

        editTask(state, action) {
            const item = state.matchedTodos.find(item => item.id === action.payload.id)
            const item2 = state.todos.find(item => item.id === action.payload.id)

            if (item && item2) {
                item.title = action.payload.newText
                item2.title = action.payload.newText
                save('todos', state.todos)
            }

        },

        watchEditTaskTime(state, action) {
            const item = state.matchedTodos.find(item => item.id === action.payload.id)
            const item2 = state.todos.find(item => item.id === action.payload.id)

            if (item && item2) {
                item.time = action.payload.newTime
                item2.time = action.payload.newTime
                save('todos', state.todos)
            }

        },

        watchTaskUnixTime(state, action) {
            const item = state.matchedTodos.find(item => item.id === action.payload.id)
            const item2 = state.todos.find(item => item.id === action.payload.id)

            if (item && item2) {
                item.timeStamp = action.payload.unixTime
                item2.timeStamp = action.payload.unixTime
                save('todos', state.todos)
            }

        },

        findTasksBySearch(state, action) {

            const searchResults = state.todos.filter(item => {
                return item.title.toLowerCase().includes(action.payload.toLowerCase())
            });

            state.matchedTodos = searchResults
        },




    }


})

export const {
    addTodo,
    setTodoFromLS,
    deleteItems,
    toggleComplete,
    clearTasks,
    watchEditTaskTime,
    editTask,
    findTasksBySearch,
    watchTaskUnixTime
} = todoSlice.actions

export default todoSlice.reducer

