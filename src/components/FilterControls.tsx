import {Button} from 'antd'
import {FC, memo} from "react";

export type FilterTypes = 'All' | 'Active' | 'Completed'

export type FilterMemory = {
    filter: FilterTypes
}

export type FilterControlsType = {
    filterTask: (filter: FilterTypes) => void
    filter: FilterTypes
}

export const  FilterControls: FC<FilterControlsType> = memo(({filterTask, filter}) => {

    return (
        <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }}>
            <Button
                type={filter === 'All' ? 'primary': 'default'}
                onClick={() => filterTask('All')}

            >Все задачи</Button>
            <Button
                type={filter === 'Active' ? 'primary': 'default'}
                onClick={() => filterTask('Active')}>
                Активные
            </Button>
            <Button
                type={filter === 'Completed' ? 'primary': 'default'}
                onClick={() => filterTask('Completed')}

            >Завершенные</Button>
        </div>
    )
})