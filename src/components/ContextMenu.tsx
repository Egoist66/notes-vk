import { FC, useState } from "react";
import styled from "styled-components";
import { WatchOutClick, useAppDispatch } from "../hooks/hooks";
import { editTask } from "../redux/todo-slice";
import { removeTagsExceptLinks } from "../utils/utils";
import {TaskItemState} from "./TaskItem";

const StyledContextOverlay = styled.div`

    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    backdrop-filter: brightness(0.9);

`

const StyledContextMenu = styled.div`
    width: 300px;
    min-height: min-content;
    box-shadow: 2px 0px 3px 0px #898888;


    & p {
        padding: 10px;
        border-bottom: 1px solid silver;
        margin-bottom: 0px;
        margin-top: 0px;
        background-color: #001529!important;
        color: white;
        cursor: pointer;

        &:hover {
            background-color: #1677FF !important;
        }
    }

`

type ContextMenuProps ={
    id: number
    setState: (arg: TaskItemState) => void
    title: string
    state: TaskItemState
   
}

export const ContextMenu: FC<ContextMenuProps> = ({id, title, setState, state}) => {

    
    const dispatch = useAppDispatch()
    const [fontCounter, setFontCounter] = useState<number>(20)
    WatchOutClick(setState, 'context-overlay', state)

    const strippedText = removeTagsExceptLinks(title)  


    const transformText = (_new: string) => {
        dispatch(editTask({
            id: id,
            newText: _new
        }))
    }

    const increaseTextFont = () =>{
        return () => {
            setFontCounter(fontCounter => fontCounter + 2)
            transformText(`<span style="font-size:${fontCounter}px">${strippedText}</span>`)
        }
    }


    const clearText = () => {

        setFontCounter(20)
        dispatch(editTask({
            id: id,
            newText: removeTagsExceptLinks(title)
        }))

        
        
    }

    return (
        <StyledContextOverlay id="context-overlay">
            <StyledContextMenu id="context-menu">
                <p onClick={() => transformText(`<b>${strippedText}</b>`)}>Сделать жирным текст</p>
                <p onClick={() => transformText(`<i>${strippedText}</i>`)}>Сделать курсивным текст</p>
                <p onClick={() => transformText(`<mark>${strippedText}</mark>`)}>Сделать выделенным текст</p>
                <p onClick={increaseTextFont()}>Увеличить шрифт</p>
                <p onClick={clearText}>Очистить</p>
            </StyledContextMenu>
        </StyledContextOverlay>
    )
}

