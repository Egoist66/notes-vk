import {FC, ReactElement, ReactNode, useState} from "react";

type AccordionPropsType = {
    title?: string,
    body?: ReactNode | ReactElement
    isOpen?: boolean
    onClickHandler?: () => void
    trigger?: (toggleAccordion?: () => void, title?: string) => ReactNode | ReactElement
}


export const Accordion: FC<AccordionPropsType> = ({title, isOpen, body, trigger}) => {

    const [open, setOpen] = useState<boolean>(false || isOpen ? isOpen : false)

    const toggleAccordion = () => {
        setOpen(open => !open)
    }

    return (
        <div>

            <AccordionTitle
                trigger={trigger}
                title={title ?? 'Default Title'}
                onClickHandler={toggleAccordion}
            />

            {open && <div><AccordionBody body={body}/></div>}


        </div>
    )

}



//@ts-ignore
const AccordionTitle: FC<AccordionPropsType> = ({title, trigger, onClickHandler}) : ReactNode | ReactElement => {
    if(trigger){
        return trigger(onClickHandler, title)
    }
    else {
        return <h2 onClick={onClickHandler}>{title}</h2>
    }

}

const AccordionBody: FC<AccordionPropsType> = ({body}) => {

    return (
        <>

            {body ? body : <p>Empty body</p>}


        </>
    )
}