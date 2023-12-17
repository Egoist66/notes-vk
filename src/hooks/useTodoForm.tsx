import {LS, useAppDispatch, useAppSelector} from "./hooks";
import {ChangeEvent, FormEvent, useDeferredValue, useEffect, useState} from "react";
import {message, notification} from "antd";
import {formatDate, MatchLinkinText} from "../utils/utils";
import Swal from "sweetalert2";
import {addTodo} from "../redux/todo-slice";
import {TodoFormStateType} from "../components/TodoForm";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


export type NotificationType = 'success' | 'info' | 'warning' | 'error';



export const useTodoForm = () => {
    const {save, get, exist, remove} = LS()
    const defaultValue = 30

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        finalTranscript,
        isMicrophoneAvailable
    } = useSpeechRecognition()


    const taskCountValue = exist('task-quantity-allowed') ? get('task-quantity-allowed') : defaultValue
    const isRestrictedTasksValue = exist('isRestrictedTasks') ? get('isRestrictedTasks') : false
    const isInputBlocked = exist('isInputBlocked') ? get('isInputBlocked') : false

    const [state, setState] = useState<TodoFormStateType>({
        text: '',
        warning: '',
        speechTranscript: '',
        maxTaskCount: taskCountValue,
        isInputBlocked: isInputBlocked,
        isRestrictedTasks: isRestrictedTasksValue
    })


    const defferedValue = useDeferredValue(state.text)
    const [isInputDataInStorage, setCheckInputDataInStorage] = useState<boolean>(false)
    const [api, contextHolder] = notification.useNotification();
    const [apiCount, contextCountHolder] = notification.useNotification();
    const dispatch = useAppDispatch()
    const {matchedTodos} = useAppSelector(state => state.todos)


    const {matchedValue} = MatchLinkinText(/(https?:\/\/[^\s]+)/g, defferedValue)


    const initSpeechListening = () => {
        try {
            if(isMicrophoneAvailable){
                SpeechRecognition.startListening()
            }

        }
        catch (e){
            console.log(e)
        }
    }

    useEffect(() => {

           setState({
               ...state,
               text: finalTranscript,
               speechTranscript: finalTranscript,
           })


        return () => {

        }
    }, [listening])



    const openNotificationTaskQuantityWarn = (type: NotificationType) => {
        apiCount[type]({
            message: 'Предупреждение',
            description: `Допустимое количество заметок ${state.maxTaskCount}! Чтобы создать новую
                удалите текущие`,
        });
    };
    const setRestrictedTasks = () => {
        setState({
            ...state,
            isRestrictedTasks: !state.isRestrictedTasks
        })
    }

    const setQuantityOfRestrictedTasks = () => {


        // @ts-ignore
        Swal.fire({
            title: 'Ограничение кол-ва задач',
            icon: 'warning',
            input: 'number',
            inputLabel: `Значение по умолчанию - ${state.maxTaskCount}`,
            inputAttributes: {
                min: 1,
                max: Infinity,
                step: 1
            },
            inputValue: state.maxTaskCount,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: '#1677FF',
            confirmButtonColor: '#1677FF',
            cancelButtonText: 'Отмена',
            confirmButtonText: 'Установить',


        }).then(result => {
            if (result.isConfirmed) {
                save('task-quantity-allowed', result.value)
                setState({
                    ...state,
                    maxTaskCount: Number(result.value)
                })
            } else {
                setState({
                    ...state,
                    isRestrictedTasks: false
                })
            }

        })


    }


    const addTaskInTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (defferedValue.trim() === '') {
            setState({
                ...state,
                warning: 'Пустое значение!'
            })

            message.open({
                type: 'error',
                content: 'Пустое значение!',
            });

            return


        }

        if (matchedValue) {
            let newText = `${defferedValue.replace(/(https?:\/\/[^\s]+)/g, '')}<a target="_blank" href="${matchedValue[0]}">${matchedValue[0]}</a>`

            dispatch(addTodo({
                id: new Date().getTime(),
                title: newText,
                completed: false,
                timeStamp: Date.now(),
                time: formatDate(new Date().getTime())
            }))

            message.open({
                type: 'success',
                content: 'Заметка создана'
            })


            setState({
                ...state,
                text: '',
                speechTranscript: '',
                warning: ''
            })


            remove('input-data')


        } else {
            dispatch(addTodo({
                id: new Date().getTime(),
                title: defferedValue,
                completed: false,
                time: formatDate(new Date().getTime()),
                timeStamp: Date.now()
            }))

            setState({
                ...state,
                text: '',
                warning: '',
                speechTranscript: ''
            })


            message.open({
                type: 'success',
                content: 'Заметка создана'
            })

            remove('input-data')

        }


    }



    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {

        setState({
            ...state,
            text: e.currentTarget.value,
            warning: ''
        })

    }


    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: 'Внимание!',
            description:
                'Восстановление одинаковых значений невозможно!',
        });
    };


    const importUnCommitedText = () => {
        if (!exist('input-data')) {
            return
        }

        if (Object.is(get('input-data'), defferedValue)) {

            openNotificationWithIcon('error')

            return;
        }


        setState({
            ...state,
            warning: '',
            text: get('input-data')
        })

    }


    const injectUnCommitedText = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('blur')
        if (!defferedValue) {
            return
        } else {
            save('input-data', defferedValue)
            setState({
                ...state
            })

        }
    }

    useEffect(() => {
        console.log('effect')
        if (exist('input-data')) {
            setCheckInputDataInStorage(true)
        } else {
            setCheckInputDataInStorage(false)
        }

    }, [exist('input-data')])

    useEffect(() => {

        if (matchedTodos.length >= state.maxTaskCount) {
            openNotificationTaskQuantityWarn('warning')

        }

        setState({
            ...state,
            isInputBlocked: matchedTodos.length >= state.maxTaskCount
        })
        save('isInputBlocked', matchedTodos.length >= state.maxTaskCount)


    }, [matchedTodos.length, state.maxTaskCount])


    useEffect(() => {
        if (state.isRestrictedTasks) {
            if (exist('isRestrictedTasks')) {
                return
            }

            save('isRestrictedTasks', state.isRestrictedTasks)
            setQuantityOfRestrictedTasks()
        } else {
            remove('task-quantity-allowed')
            remove('isRestrictedTasks')
            setState({
                ...state,
                maxTaskCount: defaultValue
            })
        }

    }, [state.isRestrictedTasks])


    return {
        setQuantityOfRestrictedTasks,
        setRestrictedTasks,
        addTaskInTodo,
        importUnCommitedText,
        injectUnCommitedText,
        handleInput,
        state,
        initSpeechListening,
        listening,
        defferedValue,
        defaultValue,
        matchedTodos,
        contextHolder,
        contextCountHolder,
        isInputDataInStorage,
        resetTranscript,
        browserSupportsSpeechRecognition

    }

}