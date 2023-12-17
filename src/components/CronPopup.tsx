import { FC } from "react";
import styled from "styled-components";
import { Cron } from "./Cron";
import { useEffect } from 'react';
import { WatchOutClick } from "../hooks/hooks";
import {TaskItemState} from "./TaskItem";


const StyledPopup = styled.div`
    background-color: #696c6d97;
    position: fixed;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;


`
type CronPopupProps = {
    setState: (arg: TaskItemState) => void,
    id: number
    state: TaskItemState

}

export const CronPopup: FC<CronPopupProps> = ({setState,  id, state}) => {


    WatchOutClick(setState, 'calendar-popup', state)

  

    return (

        <StyledPopup id="calendar-popup">


        
            <Cron id={id} />
            

        </StyledPopup>
        
    )
}