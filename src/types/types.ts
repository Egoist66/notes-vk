import {JSX, ReactElement, ReactNode} from "react";

export type ChildrenProps = {
    children: ReactNode | ReactElement | JSX.Element;
}


export interface InitialPalleteStateType  {
    appBackgroundImage: string
}


export type TodosOptions = {
    id: number,
    title: string,
    completed: boolean,
    time: string
    timeStamp: number
}
export type TodosOptionsForSlice = {
    payload: {
        id: number,
        title: string,
        completed: boolean,
        time: string,
        timeStamp: number
    }
}


export type SpeechRecognitionStateType = {
    transcript: string
    recognitionMode: boolean
}


