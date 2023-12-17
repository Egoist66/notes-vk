import React, {memo} from "react";
import {Button, Flex, Input, Switch, Typography} from "antd";
import {useTodoForm} from "../hooks/useTodoForm";


export type TodoFormStateType = {
    text: string
    warning: string
    maxTaskCount: number
    isRestrictedTasks: boolean
    speechTranscript: string
    isInputBlocked: boolean
}
export const TodoForm: React.FC = () => {

    const {Text} = Typography



    const {
        addTaskInTodo,
        setRestrictedTasks,
        importUnCommitedText,
        injectUnCommitedText,
        handleInput,
        state,
        contextHolder,
        defaultValue,
        contextCountHolder,
        defferedValue,
        isInputDataInStorage,
        resetTranscript,
        listening,
        initSpeechListening,
        browserSupportsSpeechRecognition
    } = useTodoForm()


    return (

        <>
            {contextHolder}

            <form onSubmit={addTaskInTodo}>
                {contextCountHolder}

                <Flex style={{paddingBottom: 30}} className='input-field'>
                    <Input
                        status={state.warning ? 'error' : ''}
                        onBlur={injectUnCommitedText}
                        disabled={state.isInputBlocked}
                        placeholder={'Введите название'}
                        value={defferedValue}
                        onChange={listening ? () => {
                        } : handleInput}
                        type="text"
                    />

                </Flex>


            </form>


            <Flex gap={30} wrap={"wrap"}>

                <Button
                    id={'restore'}
                    type="primary"
                    size={'large'}
                    onClick={importUnCommitedText}
                    disabled={!isInputDataInStorage}
                >Восстановить

                </Button>




                {browserSupportsSpeechRecognition ? <Button
                    id={'voice'}
                    size={'large'}
                    disabled={listening}
                    onClick={initSpeechListening}
                >{listening ? 'Идет запись...' : 'Голосовой ввод'}</Button> : <p>Браузер не поддерживает голосовой ввод!</p>}

                <Button
                    id={'print'}
                    type="primary"
                    size={'large'}
                    onClick={() => window.print()}
                >Распечатать

                </Button>

            </Flex>

            <div id={'task-watcher'} style={{marginBottom: '1rem'}}>


                <Flex style={{paddingTop: 30}} gap={10}>
                    <Switch
                        title={`Кол-во по умолчанию ${defaultValue}`}
                        checked={state.isRestrictedTasks}
                        onChange={setRestrictedTasks}

                    />
                    <Text>Установить ограничение кол-ва заметок</Text>
                </Flex>


            </div>

        </>
    )
}
