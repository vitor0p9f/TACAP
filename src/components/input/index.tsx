import React, { useState } from "react"
import "./style.css"

type InputProps = {
    label: string
    mask?: (value: string) => string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<InputProps> = ({label, mask, className, value, ...rest}) =>{
    const [internalValue, setInternalValue] = useState<string>(
        typeof value === "string" ? value : ""
    )

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let input_value = event.target.value

        if(mask){
            input_value = mask(input_value)
        }

        setInternalValue(input_value)

        if(event.target.value !== input_value){
            (event.target as HTMLInputElement).value = input_value
        }

        rest.onChange?.(event)
    }

    const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const hasStep = rest.step !== undefined;
    
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];
      
        // 1. Permite números (0-9) e teclas de controle
        if (/[0-9]/.test(event.key) || allowedKeys.includes(event.key)) {
            return
        }
        
        // 2. Lógica do ponto
        if (hasStep && event.key === ".") {
            const currentValue = event.currentTarget.value
            
            // Bloqueia se já houver um ponto
            if (/,/.test(currentValue)) {
                event.preventDefault()
                return
            }
            
            // Bloqueia se o ponto for a primeira entrada (".9")
            if (currentValue.length === 0) {
                event.preventDefault()
                return
            }
            return
        }
        
        // 3. Bloqueia qualquer outra coisa (letras, símbolos, etc.)
        event.preventDefault()
    }

    return (
        <div className={`InputComponent ${className}`}>
            <label>{label}</label>
            <input 
                {...rest} 
                value={internalValue} 
                onChange={onChangeHandler} 
                onKeyDown={rest.type == "number" ? onKeyDownHandler : undefined}
            />
        </div>
    )
}

export default Input