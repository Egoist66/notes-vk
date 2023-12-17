import React, {FC} from "react";
import {useAppSelector, useMeasureApp} from "../hooks/hooks";
import {DeleteOutlined, FormOutlined} from "@ant-design/icons";
import {Progress} from "antd";

export const Storage: FC = () => {
    const {currentSize, isStorageFull} = useMeasureApp()
    const {todos} = useAppSelector(state => state.todos)

    return (

        <>

            <div id={"storage"}>
                <p>
                    <DeleteOutlined title={'Кол-во занимаемой памяти хранилища'}/>
                    <span className={'storage'} style={{color: isStorageFull ? 'red' : ''}}>
                                Память - {Math.ceil(currentSize * 1024)}кб
                    </span>
                </p>

                <div id={"tasks"}>
                    <FormOutlined title={'Кол-во текущих задач'}/>
                    <span className={'storage'}> Задач - {todos.length}</span>


                </div>
            </div>


        </>
    )
}