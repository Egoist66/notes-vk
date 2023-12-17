import React, {memo} from "react";
import {useFramesFormValidation} from "../hooks/useFrameFormValidation";
import {Flex, Input, Switch, Typography} from "antd";


export type FrameFormStateType = {
    url: string
    warning: string
    isExactMode: boolean
}


export const FrameForm: React.FC = memo(() => {

    const {Text} = Typography

    const {addFrame, handleInput, state, setExactMode} = useFramesFormValidation()

    return (

        <>
            <form noValidate onSubmit={addFrame}>
                <div className='input-field'>
                    <Input
                        onChange={handleInput}
                        status={state.warning ? 'error' : ''}
                        value={state.url}
                        placeholder={'Добавьте URL адрес видео...'}
                        type="url"/>

                </div>



                <Flex style={{paddingTop: 30}} gap={10}>
                    <Switch
                        title={'Точный анализ подразумевает особую обработку введеной ссылки под формат youtube без необходимости извлекать искомую ссылку из Iframe'}
                        checked={state.isExactMode}
                        onChange={setExactMode}

                    />
                    <Text>Точный анализ URL ссылки</Text>
                </Flex>


            </form>


        </>
    )
})