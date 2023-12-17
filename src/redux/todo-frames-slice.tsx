import {createSlice} from "@reduxjs/toolkit";
import {LS} from "../hooks/hooks";

const {save, ls, get, remove, exist} = LS()

type SingleFramesType = {
    url: string
    id: string
    isFullScreen: boolean
}

type AddFrameActionType = {
    payload: {
        url: string,
        id: string,
        isFullScreen: boolean
    }
}



type RemoveActionType = {
    payload: {
        id: string
    }
}

type InitialFramesStateType = {
    frames: SingleFramesType[]
}

const initialState: InitialFramesStateType = {
    frames: []

}

const todoFrameSlice = createSlice({
    name: 'todo-frames',
    initialState,
    reducers: {

        createFrame(state: InitialFramesStateType, action: AddFrameActionType){
            state.frames.push(action.payload)
            save('frames', state.frames)
        },

        removeFrame(state: InitialFramesStateType, action: RemoveActionType){
            state.frames = state.frames.filter(frame => frame.id !== action.payload.id)
            save('frames', state.frames)

        },

        getFramesFromLS(state: InitialFramesStateType) {
            if (exist('frames')) {
                state.frames = get('frames')

            }
        },



    }


})

export const {
    createFrame,
    removeFrame,
    getFramesFromLS,
} = todoFrameSlice.actions

export default todoFrameSlice.reducer