import React, {FC} from "react";
import {Header} from "antd/es/layout/layout";
import {Button, Col, Row} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Search} from "../Search";
import {usePreferredColorScheme} from "@react-hooks-library/core";


type NavBarProps = {
    changeTheme?: () => void
    theme?: string
    collapsed: boolean
    setCollapsed: () => void

}

export const NavBar: FC<NavBarProps> = ({changeTheme, collapsed, setCollapsed, theme}) => {

    const colorScheme = usePreferredColorScheme()
    return (

        <>

            <Header style={{padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    onClick={setCollapsed}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        color: 'white'
                    }}
                />


                <div style={{paddingRight: 20}}>
                    <p id={'color-scheme'} style={{color: 'white'}}>Системная тема: <span style={{
                        textTransform: 'capitalize',
                        color: '#1677FF',
                        fontWeight: 'bold'
                    }}> {colorScheme}</span></p>
                </div>


            </Header>


        </>


    )
}