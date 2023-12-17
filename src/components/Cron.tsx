import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { watchTaskUnixTime, watchEditTaskTime } from "../redux/todo-slice";
import { formatDate } from "../utils/utils";
import {DatePicker, DatePickerProps, Flex} from "antd";

type CronTypeProps = {
    id: number
}


export const Cron: FC<CronTypeProps> = ({id}) => {


    const [timeValue, setTimeValue] = useState<string>(new Date().toISOString())
    const dispatch = useAppDispatch()


    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setTimeValue(dateString)
    };

    useEffect(() => {
       
        dispatch(watchTaskUnixTime({
            id: id,
            unixTime: new Date(timeValue).getTime()
        }))
     
        dispatch(watchEditTaskTime({
            id: id,
            newTime: formatDate(new Date(timeValue).getTime())
        }))
    }, [timeValue])

    

    return (
        <div style={{
            backgroundColor: 'white',
            padding: 50,
            borderRadius: 10
        }}>

            <Flex gap={20}>
                <DatePicker onChange={onChange}/>


            </Flex>



        </div>
    )
}