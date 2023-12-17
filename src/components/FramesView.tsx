import styled from "styled-components";
import {FC, memo, useEffect, useState} from "react";
import {useAppDispatch, useDomSelector} from "../hooks/hooks";
import {removeFrame} from "../redux/todo-frames-slice";
import {isElementFullscreen, requestFullFramescreen} from "../utils/utils";
import {Button, message} from "antd";

const StyledFramesView = styled.div`
  box-shadow: 1px 1px 7px 1px #a89f9f;
  height: 270px;
  border-radius: 10px;
  margin-bottom: 50px;

`
const FramesItems = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 10px;
  display: block;


`

type FramesViewProps = {
    url: string
    id: string
}

export const FramesView: FC<FramesViewProps> = memo(({url, id}) => {

    const [isFullScreened, setFullScreen] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const {selector} = useDomSelector(`#frame-${id}`)

    const OnRemoveFrame = () => {
        dispatch(removeFrame({
            id,
        }))

        message.open({
            type: 'warning',
            content: 'Фрейм удален!',

        })
    }
    const requestFrameFullScreen = () => {
        requestFullFramescreen(selector)
    }
    const watchFullScreen = () => {


        if (document.fullscreenElement === selector) {
            console.log('full')
            setFullScreen(true)
        } else {
            console.log('not full')
            setFullScreen(false)
        }
    }


    useEffect(() => {

        selector?.addEventListener('fullscreenchange', watchFullScreen)


        return () => {
            selector?.removeEventListener('fullscreenchange', watchFullScreen)
        }

    }, [selector])

    return (
        <>
            <StyledFramesView data-fullscreen={isFullScreened} className={'frames-view'}>

                <FramesItems data-fullscreen={isFullScreened} id={`frame-${id}`} allowFullScreen src={url}/>


                <div className={'frame-controls'} style={{marginTop: 20, display: 'flex', gap: 10}}>
                    <Button style={{width: '100%'}} danger onClick={OnRemoveFrame}>Удалить фрейм</Button>
                    <Button style={{width: '100%'}} onClick={requestFrameFullScreen}>Во весь экран</Button>
                </div>
            </StyledFramesView>



        </>
    )
})