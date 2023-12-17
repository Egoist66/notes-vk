import {ChangeEvent, FormEvent, useCallback, useState} from "react";
import {FrameFormStateType} from "../components/FrameForm";
import {MatchLinkinText, validateImageUrl} from "../utils/utils";
import {createFrame} from "../redux/todo-frames-slice";
import {useAppDispatch} from "./hooks";
import {message} from "antd";

export const useFramesFormValidation = () => {

    const dispatch = useAppDispatch()
    const [state, setState] = useState<FrameFormStateType>({
        url: '',
        warning: '',
        isExactMode: true
    })


    const setExactMode = useCallback(() => {
        setState({
            ...state,
            isExactMode: !state.isExactMode
        })
    }, [state.isExactMode])

    const validateInput = () => {
        if (state.url.trim() === '') {
            setState({
                ...state,
                warning: 'Пустое значение!'
            })
            message.open({
                type: 'error',
                content: 'Пустое значение!',

            })
            return false
        }
        if (!validateImageUrl(state.url)) {
            setState({
                ...state,
                warning: 'Введен некорректный URL адрес'
            })
            message.open({
                type: 'error',
                content: 'Введен некорректный URL адрес',

            })
            return false
        }

        return  true
    }


    const addFrame = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!validateInput()){
            return
        }

        switch (state.isExactMode) {
            case true:
                const urlRegExp = /(https?:\/\/[^\s]+)/g
                const {matchedValue} = MatchLinkinText(urlRegExp, state.url)
                const exactMatch = matchedValue ? matchedValue[0] : ''

                dispatch(createFrame({
                    url: exactMatch,
                    id: crypto.randomUUID(),
                    isFullScreen: false
                }))
                message.open({
                    type: 'success',
                    content: 'Фрейм добавлен!',

                })
                break

            default:

                dispatch(createFrame({
                    url: state.url,
                    id: crypto.randomUUID(),
                    isFullScreen: false
                }))

                message.open({
                    type: 'success',
                    content: 'Фрейм добавлен!',

                })

        }


        setState({
            ...state,
            url: ''
        })

    }


    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {

        setState({
            ...state,
            url: e.currentTarget.value,
            warning: ''
        })

    }

    return {
        handleInput,
        addFrame,
        setExactMode,
        state
    }

}