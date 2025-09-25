import React, { useState } from "react"
import "./style.css"

type InputProps = {
    label: string
    mask?: (value: string) => string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<InputProps> = ({label, mask, className, ...rest}) =>{
    const [value, setValue] = useState<any>()

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input_value = event.target.value

        if(mask){
            input_value = mask(input_value)
        }

        setValue(input_value)

        rest.onChange?.({ ...event, target: { ...event.target, value: input_value } } as any);
    }

    return (
        <div className={`InputComponent ${className}`}>
            <label>{label}</label>
            <input {...rest} value={value} onChange={onChangeHandler}/>
        </div>
    )
}

export default Input