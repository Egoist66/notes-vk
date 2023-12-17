import React, {FC, useEffect} from "react";
import styled from "styled-components";
import {useSearch, useToggle} from "../hooks/hooks";

import searchIcon from '../assets/search.png'
import {useDispatch} from "react-redux";
import {findTasksBySearch} from "../redux/todo-slice";
import {useEventListener} from "@react-hooks-library/core";
import {Button, Input, Modal} from "antd";
import {useSpeechRecognition} from "react-speech-recognition";



const StyledSearchIcon = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  display: block;
  filter: invert(1);
`

export const Search: FC = () => {

    const dispatch = useDispatch()
    const {toggle, setToggle} = useToggle()
    const {listening, finalTranscript} = useSpeechRecognition()

    const {handleChangeValue, setSearchByVoice, searchItem, setSearchItem} = useSearch('')

    const initSearch = () => {
        setToggle(true)
    }
    useEventListener(document, 'keydown', (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault()

            setToggle(true)
        }
    })


    const offSearch = () => {
        setToggle(false)

    }

    const findValues = () => {
        dispatch(findTasksBySearch(searchItem))
    }



    useEffect(() => {
        findValues()
    }, [searchItem])



    return (
        <div id={'search'} style={{
            display: 'inline-flex',
            gap: 20
        }}>

            <span id={'search-label'}><b>CTRL + K</b></span>
            <StyledSearchIcon id={'search-img'} draggable={false} onClick={initSearch} src={searchIcon}/>

            <Modal
                onOk={() => setToggle(false)}
                onCancel={() => setToggle(false)}
                title={'Поиск задач'}
                cancelText={'Отмена'}
                okText={'Окей'}
                open={toggle}>


                <Input autoFocus={true}
                       onChange={handleChangeValue}
                       value={searchItem}
                       onBlur={offSearch}
                       placeholder={'Введите название задачи'}
                       type={'search'}
                />


            </Modal>


        </div>
    )
}