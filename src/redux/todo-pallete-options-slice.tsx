import {createSlice} from "@reduxjs/toolkit";
import { InitialPalleteStateType } from '../types/types';
import {LS} from "../hooks/hooks";

const {save, ls, get, remove} = LS()

const initialState: InitialPalleteStateType = {
    appBackgroundImage: ''

}

const todoPalleteSlice = createSlice({
    name: 'todo-pallete',
    initialState,
    reducers: {


        saveImgUrl(state, action){
            state.appBackgroundImage = action.payload
            save('image-url', state.appBackgroundImage)
        },

        setAppUrlImageFromLS(state){
            if('image-url' in ls){
                state.appBackgroundImage = get('image-url')
            }
        },

        removeAppBackground(state){
            state.appBackgroundImage = ''
           if('image-url' in ls){
               remove('image-url')
           }
        }


    }


})

export const {
    saveImgUrl,
    removeAppBackground,
    setAppUrlImageFromLS
} = todoPalleteSlice.actions

export default todoPalleteSlice.reducer