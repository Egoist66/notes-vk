import {LS, useAppDispatch, useAppSelector, useDomSelector, useToggle} from "./hooks";
import {ChangeEvent, FocusEvent, useEffect, useState} from "react";
import {removeAppBackground, saveImgUrl, setAppUrlImageFromLS} from "../redux/todo-pallete-options-slice";
import {validateImageUrl} from "../utils/utils";
import {PalleteMenuState} from "../components/PalleteMenu";

export const usePallete = () => {

    const [state, setState] = useState<PalleteMenuState>({
        imageData: '',
        imageUrl: '',
        statusMessage: '',
        urlStatusMessage: ''
    })
    const {toggle, setToggle} = useToggle()
    const {get, exist} = LS()
    const dispatch = useAppDispatch()

    const {appBackgroundImage} = useAppSelector(state => state.todoPalleteOptions)


    const onChangeImgUrl = (e: ChangeEvent<HTMLInputElement>) => {

        setState({
            ...state,
            imageUrl: e.currentTarget.value
        })

    }

    const validateImageURL = () => {
        if (!validateImageUrl(state.imageUrl)) {
            setState({
                ...state,
                urlStatusMessage: 'Введена невалидная строка!'
            })
        } else {
            setState({
                ...state,
                urlStatusMessage: ''
            })

        }


    }

    const onBlurChangeImgUrl = (e: FocusEvent<HTMLInputElement>) => {

        if (!validateImageUrl(state.imageUrl)) {
            return;
        }

        if (!state.imageUrl.trim()) {
            setState({
                ...state,
                statusMessage: 'Пустое значение запрещено'
            })
            return
        }
        setState({
            ...state,
            statusMessage: ''
        })
        dispatch(saveImgUrl(state.imageUrl))

    }


    const removeAppBg = () => {
        console.log('remove')
        setState({
            ...state,
            imageUrl: ''
        })

        dispatch(removeAppBackground())
    }







    return {
        toggle,
        setToggle,
        removeAppBg,
        onBlurChangeImgUrl,
        onChangeImgUrl,
        validateImageURL,
        state,
        exist,
        get,
        appBackgroundImage
    }
}