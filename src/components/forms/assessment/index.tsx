import React, { useState } from "react"
import "./style.css"
import Input from "../../input"
import Button from "../../button"

const AssessmentForm: React.FC = () => {
    const [formData, setFormData] = useState({
        first_round_blows: "",
        second_round_blows: "",
        third_round_blows: "",
        third_roud_latest_seconds_blows: "",
        third_round_total_blows: "",
        final_heart_rate: "",
        heart_rate_after_one_minute: "",
        rate_of_perceived_exertion: ""
    })

    const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setFormData((previousData) => ({...previousData, [name]: value}))
    }

    const onSubmitHandler = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(formData)
    }

    return(
        <form onSubmit={onSubmitHandler}>
            <div className="Line">
                <Input 
                    name="first_round_blows" 
                    type="number" 
                    label="Golpes - 1ª série (15 segundos)"
                    required
                    onChange={onInputChangeHandler}
                />
                <Input 
                    name="second_round_blows" 
                    type="number" 
                    label="Golpes - 2ª série (30 segundos)"
                    required
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Input 
                    name="third_round_blows" 
                    type="number" 
                    label="Golpes - 3ª série (30 segundos)"
                    required
                    onChange={onInputChangeHandler}
                />
                <Input 
                    name="third_roud_latest_seconds_blows" 
                    type="number" 
                    label="Golpes - 15 segundos finais da 3ª série"
                    required
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Input 
                    name="third_round_total_blows" 
                    type="number" 
                    label="Golpes totais - 3ª série"
                    required
                    onChange={onInputChangeHandler}
                />
                <Input 
                    name="final_heart_rate" 
                    type="number" 
                    label="Frequência cardíaca - Final"
                    required
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Input 
                    name="heart_rate_after_one_minute" 
                    type="number" 
                    label="Frequência cardíaca - Após 1 minuto"
                    required
                    onChange={onInputChangeHandler}
                />
                <Input 
                    name="rate_of_perceived_exertion" 
                    type="number" 
                    label="Percepção subjetiva de esforço"
                    required
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Button variant="success">Avaliar</Button>
            </div>
        </form>
    )
}

export default AssessmentForm