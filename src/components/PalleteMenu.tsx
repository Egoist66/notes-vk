import React, {FC, useEffect} from "react";
import {Col, FloatButton, Input, Modal, Button} from "antd";
import {usePallete} from "../hooks/usePallete";
import {SettingOutlined} from "@ant-design/icons";


export type PalleteMenuState = {
    imageUrl: string,
    imageData: string,
    statusMessage: string
    urlStatusMessage: string
}
export const PalleteMenu: FC = () => {

    const {

        onBlurChangeImgUrl,
        removeAppBg,
        onChangeImgUrl,
        validateImageURL,
        state,
        setToggle,
        toggle,
        exist,
    } = usePallete()


    useEffect(() => {
        validateImageURL()

    }, [state.imageUrl])


    return (


        <>
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{right: 24}}
                onClick={() => setToggle(toggle => !toggle)}
                icon={<SettingOutlined/>}
            >


            </FloatButton.Group>
            <Modal
                onOk={() => setToggle(false)}
                onCancel={() => setToggle(false)}
                okText={'Окей'}
                title={'Установить фон рабочего стола'}
                centered
                cancelText={'Закрыть'}
                open={toggle}

            >

                <Col>

                    <p style={{color: 'white'}} id={'descr'}>
                        Для установки фона
                        рабочего стола добавьте URL ссылку на любую картинку.
                    </p>

                    <Col style={{paddingBottom: 30}}>

                        <Input
                            onBlur={onBlurChangeImgUrl}
                            onChange={onChangeImgUrl}
                            value={state.imageUrl}
                            id='imgUrl'
                            placeholder={state.statusMessage ? state.statusMessage : 'Добавьте ссылку на изображение'}
                            type="url"
                            name='img-url'/>

                    </Col>


                    <Col>
                        <Button
                            type={'primary'}
                            id={'load'}
                            onClick={removeAppBg}
                            disabled={!exist('image-url')}
                        >Удалить фон
                        </Button>
                    </Col>


                    {state.imageUrl && <p style={{color: 'red'}}>{state.urlStatusMessage && state.urlStatusMessage}</p>}

                </Col>

            </Modal></>
    )
}