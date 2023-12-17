import {FC, memo} from "react";

type SwitchProps = {
    toggleMode: () => void
    mode: boolean,
    label?: string
    title?: string
}

const Switch: FC<SwitchProps> = ({label, title, mode, toggleMode}) => {
    return (
        <>
            <div className="switch">
                <label title={title}>
                    {label || 'Точный анализ URL ссылки'}
                    <input data-mode={mode} onChange={toggleMode} checked={mode} type="checkbox"/>
                    <span  className="lever"></span>

                </label>
            </div>


        </>
    )
}

export default memo(Switch)