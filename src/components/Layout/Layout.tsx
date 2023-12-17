import React, {lazy, Suspense, useEffect} from "react";
import {NavLink, Route, Routes} from "react-router-dom";
import {preventDocumentContextMenu, useAppDispatch, useAppGuide, useAppSelector} from "../../hooks/hooks";
import {Storage} from "../Storage";
import {ControlOutlined, ExpandOutlined, FormOutlined, InfoCircleOutlined, SearchOutlined,} from '@ant-design/icons';
import {Layout, Menu, Skeleton} from 'antd';
import {Content} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {NavBar} from "./NavBar";
import {Search} from "../Search";
import {useToggle} from "@react-hooks-library/core";
import {Pallete} from "../Pallete";
import {setAppUrlImageFromLS} from "../../redux/todo-pallete-options-slice";


const LazyTodolist = lazy(() => import('../Pages/TodoList'))
const LazyInformation = lazy(() => import('../Pages/Info'))
const LazyFrames = lazy(() => import('../Pages/Frames'))
const LazySettings = lazy(() => import('../Pages/Settings'))

export const AppLayout: React.FC = () => {

    const {initAppGuide} = useAppGuide()
    const dispatch = useAppDispatch()
    const {toggle, bool} = useToggle()
    const {appBackgroundImage} = useAppSelector(state => state.todoPalleteOptions)

    useEffect(() => {
        preventDocumentContextMenu()
        initAppGuide(true)

        return () => {

        }

    }, [])


    useEffect(() => {
        dispatch(setAppUrlImageFromLS())

    }, [appBackgroundImage])


    return (


        <div className='app'>

            <Layout>


                <Sider trigger={null} collapsible collapsed={bool}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={[

                            {
                                key: '1',
                                icon: <FormOutlined/>,
                                label: <NavLink className={'nav-link'} to={'/'}>Список дел</NavLink>

                            },
                            {
                                key: '2',
                                icon: <ExpandOutlined/>,
                                label: <NavLink id={'frame'} className={'nav-link'} to={'/frames'}>Фреймы</NavLink>
                                ,
                            },
                            {
                                key: '3',
                                icon: <InfoCircleOutlined/>,
                                label: <NavLink id={'info-page'} className={'nav-link'}
                                                to={'/information'}>Информация</NavLink>

                            },

                            {
                                key: '4a',
                                icon: <ControlOutlined/>,
                                label: <NavLink id={'settings'} className={'nav-link'} to={'/settings'}>Настройки</NavLink>



                            },

                            {
                                key: '5',
                                icon: <SearchOutlined/>,
                                label: <Search/>



                            },
                        ]}
                    />
                </Sider>

                <Layout>

                    <NavBar collapsed={bool} setCollapsed={toggle}/>

                    <Content

                        className={'main-content'}
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 300,
                            backgroundColor: "#f8f8ffb3",
                            borderRadius: 5,
                            backgroundImage: `url(${appBackgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            backgroundRepeat: 'no-repeat'

                        }}
                    >
                        <Suspense fallback={<Skeleton avatar paragraph={{rows: 4}}/>}>
                            <Routes>
                                <Route index path={'/'} element={<LazyTodolist/>}/>
                                <Route path={'/frames'} element={<LazyFrames/>}/>
                                <Route path={'/information'} element={<LazyInformation/>}/>
                                <Route path={'/settings'} element={<LazySettings/>}/>
                            </Routes>
                        </Suspense>


                        <Storage/>
                    </Content>
                </Layout>


            </Layout>


            {/*<Pallete />*/}
            <Pallete/>
        </div>
    )
}


