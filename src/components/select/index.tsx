import React from "react";
import "./style.css"

type ItemProps = {
    text: string
    value: any
    disabled?: boolean
}

type SelectProps = {
    label: string
    items: ItemProps[]
} & React.SelectHTMLAttributes<HTMLSelectElement>

export const Select: React.FC<SelectProps> = ({items, label, disabled, ...rest}) => {
    return(
        <div className="SelectComponent">
            <label>{label}</label>
            <select {...rest}>
                {items.map((item) => (
                    <option  key={item.value} disabled={disabled} value={item.value}>{item.text}</option>
                ))}
            </select>
        </div>
    )
}