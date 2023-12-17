import {FC, memo, useEffect, useRef} from "react";
import {useBackUp} from "../../hooks/useBackUp";
import Swal from "sweetalert2";
import {Button, Col, Flex, message, Row} from "antd";
import {message as _message} from "antd";
import {useNavigate} from "react-router-dom";


const Settings: FC = memo(() => {

    const {backup, restore, eraseAll, loading, error, message} = useBackUp()
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const warnClear = () => {

        Swal.fire({
            title: 'Данные удалены!',
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonColor: '#1677FF',
            confirmButtonText: 'OK',

        }).then(() => {
            window.location.reload()
        })

    }

    const uploadFile = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }



    return (
        <>

            <Col  lg={12}>
                <Flex wrap={'wrap'} gap={20}>
                    <Button
                        onClick={backup}
                    >Создать резервную копию копию</Button>
                    <Button
                        onClick={uploadFile}
                    >{loading ? 'Восстановление...' : 'Восстановить из копии'}</Button>
                    <Button
                        danger
                        title={'Перед очисткой рекомендуем сделать копию'}
                        onClick={() => eraseAll([warnClear, () => navigate('/')])}
                    >Стереть все</Button>

                    <input onChange={restore} ref={inputRef} hidden accept={'application/json'} id={'file'}
                           type="file"/>
                </Flex>
            </Col>




        </>
    )
})

export default Settings