import {FC, memo, useEffect} from "react";
import {LS, useToggle} from "../hooks/hooks";
import {FilterMemory} from "./FilterControls";
import {Checkbox, message} from "antd";

export const FilterMemoryControls: FC<FilterMemory> = memo(({filter}) => {
    const {save, remove, exist, get} = LS()
    console.log('render memory')
    const defaultToggle = exist('filterSaveMode') ? get('filterSaveMode') : false

    const {toggle, setToggle} = useToggle(defaultToggle)

    const activateFilterMemory = () => {
        if(toggle){
            if(!get('filterSaveMode')){
                save('filter', filter)
                save('filterSaveMode', toggle)
                message.open({
                    type: 'success',
                    content: 'Включено',

                })
            }

            save('filter', filter)
            save('filterSaveMode', toggle)
        }
        else {
            if(exist('filter') && exist('filterSaveMode')){

               message.open({
                   type: 'warning',
                   content: 'Выключено'
               })

                remove('filter')
                remove('filterSaveMode')
            }
        }
    }

    useEffect(() => {
            activateFilterMemory()
    }, [toggle, filter])

    return (
        <div id={'memory'} style={{marginBottom: 50}}>
            <Checkbox checked={toggle} onChange={() => setToggle(toggle => !toggle)} data-on={toggle} >
                Запомнить состояние фильтров?
            </Checkbox>
        </div>
    )
})

