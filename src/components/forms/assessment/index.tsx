import React, { useState } from "react"
import { useForm } from "react-hook-form"
import "./style.css"
import Input from "../../input"
import Button from "../../button"

interface AssessmentFormProps {
  onSubmit: (data: FormData) => void;
}

export type FormData = {
    first_round_blows: number;
    second_round_blows: number;
    third_round_blows: number;
    third_roud_latest_seconds_blows: number;
    third_round_total_blows: number;
    final_heart_rate: number;
    heart_rate_after_one_minute: number;
    rate_of_perceived_exertion: number;
};

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit }) => {
    const { register, handleSubmit } = useForm<FormData>();

    const onSubmitHandler = (data: FormData) => {
        onSubmit(data);
      }

    return(
        // handleSubmit executa sua função onSubmitHandler
        <form className="assessment-form" onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="form-grid">
            {/* O 'register' é usado para conectar os inputs ao formulário */}
            <Input
              {...register("first_round_blows", { required: true, valueAsNumber: true })}
              type="number"
              min={0}
              max={25}
              label="Golpes - 1ª série (15 segundos)"
            />
            <Input
              {...register("second_round_blows", { required: true, valueAsNumber: true })}
              type="number"
              min={0}
              max={50}
              label="Golpes - 2ª série (30 segundos)"
            />
            <Input
              {...register("third_round_blows", { required: true, valueAsNumber: true })}
              type="number"
              min={0}
              max={50}
              label="Golpes - 3ª série (30 segundos)"
            />
            <Input
              {...register("third_roud_latest_seconds_blows", { required: true, valueAsNumber: true })}
              type="number"
              min={0}
              max={25}
              label="Golpes - 15 segundos finais da 3ª série"
            />
            <Input
              {...register("third_round_total_blows", { required: true, valueAsNumber: true })}
              type="number"
              min={0}
              max={75}
              label="Golpes totais - 3ª série"
            />
            <Input
              {...register("final_heart_rate", { required: true, valueAsNumber: true })}
              type="number"
              min={60}
              max={250}
              label="Frequência cardíaca - Final"
            />
            <Input
              {...register("heart_rate_after_one_minute", { required: true, valueAsNumber: true })}
              type="number"
              min={60}
              max={250}
              label="Frequência cardíaca - Após 1 minuto"
            />
            <Input
              {...register("rate_of_perceived_exertion", { required: true, valueAsNumber: true })}
              type="number"
              min={20}
              label="Percepção subjetiva de esforço"
            />
          </div>
          <div className="button-container">
            <Button type="submit" variant="success">Avaliar</Button>
          </div>
        </form>
      )
    }

export default AssessmentForm