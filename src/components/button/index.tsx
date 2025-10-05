import React from "react"
import "./style.css"

type ButtonProps = {
    variant?: "success" | ""
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({children, variant = "", ...rest}) => {
    return(
        <button className={variant} {...rest}>{children}</button>
    )
}

export default Button