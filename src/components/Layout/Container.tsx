import {ChildrenProps} from "../../types/types";



export const Container = ({children} : ChildrenProps) => {

    return (
        <div className='container'>{children}</div>
    )
}