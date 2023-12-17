import {FC, memo, useEffect, useState} from "react";
import {useAppDispatch} from "../hooks/hooks";
import {deleteItems, editTask, toggleComplete} from "../redux/todo-slice";
import {Portal} from "./Portal";
import {CronPopup} from "./CronPopup";
import {ContextMenu} from "./ContextMenu";
import {MouseEvent} from "react";
import Swal from "sweetalert2";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {Checkbox, message} from "antd";

type TaskItemProps = {
    data: {
        id: number;
        title: string;
        completed: boolean;
        time: string;
        timeStamp: number;
    };
};

export type TaskItemState = {
    editMode: boolean
    isPopupEnabled: boolean
    isContextMenuEnabled: boolean
}

export const TaskItem: FC<TaskItemProps> = memo(({data}) => {
    const {completed, id, time, timeStamp, title} = data;

    const [state, setState] = useState<TaskItemState>({
        editMode: false,
        isPopupEnabled: false,
        isContextMenuEnabled: false,
    })

    const {isPopupEnabled, isContextMenuEnabled, editMode} = state


    const dispatch = useAppDispatch();

    const deleteTask = (id: number) => {
        console.log(id);
        dispatch(deleteItems(id));

        if(id){
            message.open({
                type: 'warning',
                content: 'Заметка удалена',

            })
        }
    };

    const enableEditMode = () => {
        setState({
            ...state,
            editMode: !editMode
        })
    };


    const togglePopup = () => {

        setState({
            ...state,
            isPopupEnabled: true
        })
    };

    const toggleContextMenu = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();

        setState({
            ...state,
            isContextMenuEnabled: true
        })

    };


    const toggleTask = (id: number) => {
        dispatch(toggleComplete(id));
    };


    const initEditMode = () => {
        if (editMode) {
            Swal.fire({
                title: "Введите новое значение",
                input: 'text',
                inputValue: title,
                showCancelButton: true,
                confirmButtonText: 'Сохранить',
                cancelButtonText: 'Отменить',
                cancelButtonColor: '#1677FF',
                confirmButtonColor: '#1677FF',
                didClose() {
                    setState({
                        ...state,
                        editMode: false
                    })
                },
                inputValidator: (value) => {
                    if (!value.trim().length) {

                        return 'Пустое значение запрещено!'

                    } else {
                        dispatch(editTask({id, newText: value}));
                        setState({
                            ...state,
                            editMode: false
                        })
                    }
                }
            })

        }
    };

    useEffect(() => {
        initEditMode();

        return () => {
        };
    }, [editMode]);

    return (
        <>
            <li draggable="true">
                <label>


                    <Checkbox style={{
                        paddingRight: 15
                    }} checked={completed} onChange={() => toggleTask(id)}/>


                    {!completed ? (
                        <span
                            onContextMenu={toggleContextMenu}
                            className={completed ? "done-task" : ""}
                            dangerouslySetInnerHTML={{__html: title}}
                        ></span>
                    ) : (
                        <span className={completed ? "done-task" : ""}>
              <s dangerouslySetInnerHTML={{__html: title}}></s>
            </span>
                    )}
                </label>
                <span onClick={() => deleteTask(id)} className={"delete"}>
          &times;
        </span>
                <span
                    id={"edit"}
                    style={{
                        color: editMode ? "red" : "",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                    onClick={enableEditMode}
                >
          &#9998;
        </span>
                <span onClick={togglePopup} id={"calendar"}>
          &#128197;
        </span>
                <span style={{textDecoration: 'underline'}}>{time}</span>
            </li>

            {isPopupEnabled ? (
                <Portal>
                    {isPopupEnabled && (
                        <CronPopup
                            id={id}
                            setState={setState}
                            state={state}
                        />
                    )}
                </Portal>
            ) : null}

            {isContextMenuEnabled ? (
                <Portal>{
                    isContextMenuEnabled &&
                    <ContextMenu
                        id={id}
                        title={title}
                        state={state}
                        setState={setState}

                    />}
                </Portal>
            ) : null}
        </>
    );
})
