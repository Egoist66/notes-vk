import {ChangeEvent, useState} from "react";
import {message as _message} from "antd";

export const useBackUp = () => {

    const [state, setState] = useState<{ message: boolean, loading: boolean, error: boolean }>({
        loading: false,
        error: false,
        message: false
    })
    const backup = () => {
        const link = document.createElement('a');

        try {
            link.download = `backup_${Date.now()}.json`
            const data = JSON.stringify(localStorage)
            const blob = new Blob([data], {type: 'application/json'})
            const dataUrl = URL.createObjectURL(blob)
            link.href = dataUrl

            _message.open({
                type: 'success',
                content: 'Копия создана!',

            })


            link.click();
        } catch (e) {
            _message.open({
                type: 'error',
                content: 'Ошибка создания копии!',

            })
        }


        URL.revokeObjectURL(link.href);


    }


    const restore = (e: ChangeEvent<HTMLInputElement>) => {

        if (e.currentTarget.files) {
            const file = e.currentTarget?.files[0]

            const reader = new FileReader()
            reader.readAsText(file)

            reader.onload = () => {
                setState({
                    ...state,
                    loading: true
                })
                const data2 = reader?.result

                if (data2) {
                    if (typeof data2 === "string") {
                        const timer = setTimeout(() => {
                            let parsedData: any
                            try {
                                parsedData = JSON.parse(data2)
                                console.log(parsedData)
                                _message.open({
                                    type: 'success',
                                    content: 'Восстановление успешно!'
                                })
                            } catch (e) {
                                console.log(e)
                                setState({
                                    ...state,
                                    loading: false,
                                    error: true,
                                    message: true
                                })

                                _message.open({
                                    type: 'error',
                                    content: 'Ошибка восстановления!'
                                })
                            }


                            for (let [key, value] of Object.entries(parsedData ?? {})) {
                                if (typeof value === "string") {
                                    localStorage.setItem(key, value)
                                    setState({
                                        ...state,
                                        loading: false,
                                        error: false,
                                        message: true
                                    })
                                }
                            }
                            clearTimeout(timer)
                        }, 1200)
                    }

                }

            }
            reader.onerror = () => {
                console.log(reader.error);
                setState({
                    ...state,
                    loading: false,
                    error: true,
                    message: true
                })
            };

        }


    }


    const eraseAll = (callbacks: Array<() => any>) => {
        localStorage.clear()

        callbacks.forEach(c => {
            c()
        })

    }
    const {loading, error, message} = state

    return {
        backup,
        restore,
        eraseAll,
        message,
        error,
        loading


    }


}