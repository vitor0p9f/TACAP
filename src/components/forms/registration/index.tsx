import React, { useContext, useEffect, useState } from "react"
import "./style.css"
import Input from "../../input"
import Button from "../../button"
import { Select } from "../../select"
import { voluntarioClient } from "../../../services/voluntarioClient"
import { SuccessModal } from "../../modals/SuccessModal"
import { Pages } from "../../../types/pages"
import { PopulationContext } from "../../../context/population"

const phoneMask = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove all digits

    // Put the DDD (area code) inside parentheses and add a space before the number
    value = value.replace(/^(\d{2})(\d)/, "($1) $2"); 

    // Add a hyphen before the last 4 digits
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
  
    return value;
}

interface RegistrationFormProps {
    setCurrentPage: (page: Pages) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({setCurrentPage}) => {
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
        },
        documento_id: "1"
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    const [practice_time_number, setPracticeTimeNumber] = useState("")
    const [practice_time_unit, setPracticeTimeUnit] = useState("")
    const populationContext = useContext(PopulationContext)

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

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        voluntarioClient.create({
            nome: formData.name,
            altura: Number(formData.height),
            apelido: formData.nickname,
            contato: JSON.stringify(formData.contact),
            endereco: JSON.stringify(formData.address),
            genero: formData.gender,
            graduacao: formData.graduation,
            idade: Number(formData.age),
            peso: Number(formData.weight),
            tempo_pratica: formData.practice_time,
        })
        .then(volunter => {
            setModalMessage("Voluntário cadastrado com sucesso!")
            populationContext.addVolunteer(volunter)
        })
        .catch(error => setModalMessage(`Erro ao cadastrar voluntário!\n\n${error}!`))

        setIsModalOpen(true)
        setCurrentPage("Volunteers")
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage("")
    };

    const onPracticeTimeNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPracticeTimeNumber(event.target.value)
    }

    const onPracticeTimeUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPracticeTimeUnit(event.target.value)
    }

    useEffect(() => {
        setFormData(previousData => {
            const nextPracticeTime = practice_time_number && practice_time_unit
                ? `${practice_time_number} ${practice_time_unit}`
                : ""

            if (previousData.practice_time === nextPracticeTime) {
                return previousData
            }

            return { ...previousData, practice_time: nextPracticeTime }
        })
    }, [practice_time_number, practice_time_unit])

    return(
        <>
            <SuccessModal 
                isOpen={isModalOpen} 
                message={modalMessage}
                onClose={closeModal}
            />

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
                        min={5}
                        max={100}
                        onChange={onInputChangeHandler}
                    />
                    <div className="Line">
                        <Input 
                            label="Tempo de prática"
                            type="number" 
                            name="practice_time_number"
                            value={practice_time_number}
                            min={0}
                            required 
                            onChange={onPracticeTimeNumberChange}
                        />
                        <Select 
                            items={[
                                { text: "Selecione a unidade", value: "", disabled: true },
                                { text: "Meses", value: "meses" },
                                { text: "Anos", value: "anos" },
                            ]} 
                            label="Unidade"
                            name="practice_time_unit" 
                            required
                            value={practice_time_unit}
                            onChange={onPracticeTimeUnitChange}
                        />
                    </div>
                    <Select 
                        items={[
                            { text: "Selecione a graduação", value: "", disabled: true },
                            { text: "Crua", value: "Crua" },
                            { text: "Ponta Crua Amarela", value: "Ponta Crua Amarela" },
                            { text: "Ponta Amarela", value: "Ponta Amarela" },
                            { text: "Ponta Amarela Laranja", value: "Ponta Amarela Laranja" },
                            { text: "Ponta Laranja", value: "Ponta Laranja" },
                            { text: "Ponta Laranja Azul", value: "Ponta Laranja Azul" },
                            { text: "Ponta Azul", value: "Ponta Azul" },
                            { text: "Crua Amarela", value: "Crua Amarela" },
                            { text: "Amarela", value: "Amarela" },
                            { text: "Crua Laranja", value: "Crua Laranja" },
                            { text: "Amarela Laranja", value: "Amarela Laranja" },
                            { text: "Laranja", value: "Laranja" },
                            { text: "Crua Azul", value: "Crua Azul" },
                            { text: "Amarela Azul", value: "Amarela Azul" },
                            { text: "Laranja Azul", value: "Laranja Azul" },
                            { text: "Azul", value: "Azul" },
                            { text: "Azul Verde", value: "Azul Verde" },
                            { text: "Verde", value: "Verde" },
                            { text: "Verde Roxa", value: "Verde Roxa" },
                            { text: "Roxa", value: "Roxa" },
                            { text: "Roxa Marrom", value: "Roxa Marrom" },
                            { text: "Marrom", value: "Marrom" },
                            { text: "Marrom Vermelha", value: "Marrom Vermelha" },
                            { text: "Roxa Amarela (Instrutor Baobá)", value: "Roxa Amarela" },
                            { text: "Roxa Laranja (Instrutor Baobá)", value: "Roxa Laranja" },
                            { text: "Roxa Azul (Instrutor Baobá)", value: "Roxa Azul" },
                            { text: "Marrom Amarela (Professor Baobá)", value: "Marrom Amarela" },
                            { text: "Marrom Laranja (Professor Baobá)", value: "Marrom Laranja" },
                            { text: "Marrom Azul (Professor Baobá)", value: "Marrom Azul" },
                            { text: "Marrom Verde (Professor Baobá)", value: "Marrom Verde" },
                            { text: "Marrom Branca (Professor Baobá)", value: "Marrom Branca" },
                            { text: "Vermelha", value: "Vermelha" },
                            { text: "Vermelha Branca", value: "Vermelha Branca" },
                            { text: "Branca", value: "Branca" }
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
                        label="Peso (Kg)" 
                        type="number" 
                        name="weight" 
                        required 
                        value={formData.weight} 
                        min={15}
                        max={200}
                        step={0.01} 
                        onChange={onInputChangeHandler}
                    />
                    <Input 
                        label="Altura (m)" 
                        type="number" 
                        name="height" 
                        required 
                        value={formData.height} 
                        min={1}
                        max={2.5}
                        step={0.01} 
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
                    <Button onClick={()=> setCurrentPage("Volunteers")}>Voltar</Button>
                    <Button variant="success">Cadastrar</Button>
                </div>
            </form>
        </> 
    )
}

export default RegistrationForm
