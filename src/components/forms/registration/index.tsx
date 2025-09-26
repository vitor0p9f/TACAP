import React, { useState } from "react"
import "./style.css"
import Input from "../../input"
import Button from "../../button"
import { Select } from "../../select"

const phoneMask = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove all digits

    // Put the DDD (area code) inside parentheses and add a space before the number
    value = value.replace(/^(\d{2})(\d)/, "($1) $2"); 

    // Add a hyphen before the last 4 digits
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
  
    return value;
}

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        nickname: "",
        age: "",
        practice_time: "",
        graduation: "",
        gender: "",
        weight: "",
        height: "",
        address: {
            street: "",
            number: "",
            neighborhood: "",
            uf: "",
            city: ""
        },
        contact: {
            cellphone: "",
            email: ""
        }
    })

    const updateData = (name: string, value: string) => {
        if(name.includes(".")){
            const [parent, child] = name.split(".")

            setFormData((previousData) => ({
                ...previousData,
                [parent]: {
                    ...previousData[parent as keyof typeof previousData] as object,
                    [child]: value,
                }
            }))

            return
        }
        
        setFormData(previousData => ({...previousData, [name]: value}))
    }

    const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        updateData(name, value)
    }

    const onSelectChangeHadler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target

        updateData(name, value)
    }

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(formData)
    }

    return(
        <form onSubmit={onSubmitHandler}>
            <div className="Line">
                <Input 
                    label="Nome completo" 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Apelido" 
                    type="text" 
                    name="nickname" 
                    required 
                    value={formData.nickname}
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Input 
                    label="Idade" 
                    type="number" 
                    name="age" 
                    required 
                    value={formData.age}
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Tempo de prática"
                    type="text" 
                    name="practice_time"
                    value={formData.practice_time}
                    required 
                    onChange={onInputChangeHandler}
                />
                <Select 
                    items={[
                        { text: "Selecione a graduação", value: "", disabled: true },
                        { text: "Sem corda", value: "sem_corda" },
                        { text: "Crua (Iniciante)", value: "crua" },
                        { text: "Verde", value: "verde" },
                        { text: "Amarela", value: "amarela" },
                        { text: "Azul", value: "azul" },
                        { text: "Roxa", value: "roxa" },
                        { text: "Marrom", value: "marrom" },
                        { text: "Vermelha", value: "vermelha" },
                        { text: "Laranja", value: "laranja" },
                        { text: "Preta", value: "preta" },
                        { text: "Graduado", value: "graduado" },
                        { text: "Instrutor", value: "instrutor" },
                        { text: "Professor", value: "professor" },
                        { text: "Contra-Mestre", value: "contra_mestre" },
                        { text: "Mestre", value: "mestre" },
                        { text: "Grão-Mestre", value: "grao_mestre" }
                    ]} 
                    label="Graduação"
                    name="graduation" 
                    required
                    value={formData.graduation}
                    onChange={onSelectChangeHadler}
                />
            </div>
            <div className="Line">
                <Select 
                    items={[
                        { text: "Selecione o gênero", value: "", disabled: true },
                        { text: "Masculino", value: "masculino" },
                        { text: "Feminino", value: "feminino" },
                        { text: "Não informar", value: "nao_informar" }
                    ]} 
                    label="Gênero" 
                    name="gender"
                    value={formData.gender}
                    required
                    onChange={onSelectChangeHadler}
                />
                <Input 
                    label="Peso" 
                    type="number" 
                    name="weight" 
                    required 
                    value={formData.weight} 
                    min={0} 
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Altura" 
                    type="number" 
                    name="height" 
                    required 
                    value={formData.height} 
                    min={0} 
                    onChange={onInputChangeHandler}
                />
            </div>
            <Input 
                label="Rua" 
                type="text" 
                name="address.street"
                value={formData.address.street}
                required 
                onChange={onInputChangeHandler}
            />
            <div className="Line">
                <Input 
                    label="Bairro" 
                    type="text" 
                    name="address.neighborhood" 
                    value={formData.address.neighborhood}
                    required 
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Cidade" 
                    type="text" 
                    name="address.city" 
                    value={formData.address.city}
                    required 
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Número" 
                    type="number" 
                    name="address.number" 
                    required 
                    value={formData.address.number} 
                    min={0} 
                    onChange={onInputChangeHandler}
                />
                <Select 
                    items={[
                        { text: "Selecione a UF", value: "", disabled: true },
                        { text: "Acre", value: "AC" },
                        { text: "Alagoas", value: "AL" },
                        { text: "Amapá", value: "AP" },
                        { text: "Amazonas", value: "AM" },
                        { text: "Bahia", value: "BA" },
                        { text: "Ceará", value: "CE" },
                        { text: "Distrito Federal", value: "DF" },
                        { text: "Espírito Santo", value: "ES" },
                        { text: "Goiás", value: "GO" },
                        { text: "Maranhão", value: "MA" },
                        { text: "Mato Grosso", value: "MT" },
                        { text: "Mato Grosso do Sul", value: "MS" },
                        { text: "Minas Gerais", value: "MG" },
                        { text: "Pará", value: "PA" },
                        { text: "Paraíba", value: "PB" },
                        { text: "Paraná", value: "PR" },
                        { text: "Pernambuco", value: "PE" },
                        { text: "Piauí", value: "PI" },
                        { text: "Rio de Janeiro", value: "RJ" },
                        { text: "Rio Grande do Norte", value: "RN" },
                        { text: "Rio Grande do Sul", value: "RS" },
                        { text: "Rondônia", value: "RO" },
                        { text: "Roraima", value: "RR" },
                        { text: "Santa Catarina", value: "SC" },
                        { text: "São Paulo", value: "SP" },
                        { text: "Sergipe", value: "SE" },
                        { text: "Tocantins", value: "TO" }
                    ]} 
                    label="UF"
                    name="address.uf" 
                    required
                    onChange={onSelectChangeHadler}
                />
            </div>
            <div className="Line">
                <Input 
                    label="Telefone" 
                    type="tel" 
                    name="contact.cellphone" 
                    value={formData.contact.cellphone}
                    required 
                    min={14}
                    maxLength={14} 
                    mask={phoneMask} 
                    placeholder="(##) #####-####" 
                    onChange={onInputChangeHandler}
                />
                <Input 
                    label="Email" 
                    type="email" 
                    name="contact.email"
                    value={formData.contact.email}
                    required 
                    onChange={onInputChangeHandler}
                />
            </div>
            <div className="Line">
                <Button>Voltar</Button>
                <Button variant="success">Cadastrar</Button>
            </div>
        </form>
    )
}

export default RegistrationForm