import React, { useEffect, useState } from 'react';
import { Modal } from '../BaseModal';
import Input from '../../input';
import Button from '../../button';
import { Select } from '../../select';
import { voluntarioClient, Voluntario } from '../../../services/voluntarioClient';
import './styles.css';

const phoneMask = (value: string) => {
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
  return value;
};

type Address = {
  street: string;
  number: string;
  neighborhood: string;
  uf: string;
  city: string;
};

type Contact = {
  cellphone: string;
  email: string;
};

type FormState = {
  name: string;
  nickname: string;
  age: string;
  practice_time: string;
  graduation: string;
  gender: string;
  weight: string;
  height: string;
  address: Address;
  contact: Contact;
};

const DEFAULT_ADDRESS: Address = {
  street: '',
  number: '',
  neighborhood: '',
  uf: '',
  city: '',
};

const DEFAULT_CONTACT: Contact = {
  cellphone: '',
  email: '',
};

const createDefaultFormState = (): FormState => ({
  name: '',
  nickname: '',
  age: '',
  practice_time: '',
  graduation: '',
  gender: '',
  weight: '',
  height: '',
  address: { ...DEFAULT_ADDRESS },
  contact: { ...DEFAULT_CONTACT },
});

const normalizePracticeTimeUnit = (unit: string) => {
  if (!unit) return '';
  const normalized = unit.trim().toLowerCase();

  if (normalized.startsWith('mes')) return 'meses';
  if (normalized.startsWith('ano')) return 'anos';

  return '';
};

const getPracticeTimeParts = (value: string | null | undefined) => {
  if (!value) return { number: '', unit: '' };

  const trimmed = value.trim();
  if (!trimmed) return { number: '', unit: '' };

  const [numberPart, unitPart] = trimmed.split(/\s+/, 2);
  return {
    number: numberPart ?? '',
    unit: normalizePracticeTimeUnit(unitPart ?? ''),
  };
};

const parseJSONField = <T,>(value: string | undefined | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch (error) {
    console.warn('Falha ao converter campo JSON do voluntário', error);
    return fallback;
  }
};

interface EditVolunteerModalProps {
  isOpen: boolean;
  volunteerId: number | null;
  onClose: () => void;
  onSuccess: (volunteer: Voluntario) => void;
  showSuccessMessage: (message: string) => void;
}

export function EditVolunteerModal({
  isOpen,
  volunteerId,
  onClose,
  onSuccess,
  showSuccessMessage,
}: EditVolunteerModalProps) {
  const [formData, setFormData] = useState<FormState>(() => createDefaultFormState());
  const [practiceTimeNumber, setPracticeTimeNumber] = useState('');
  const [practiceTimeUnit, setPracticeTimeUnit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadVolunteer = async () => {
      if (!isOpen) {
        return;
      }

      if (!volunteerId) {
        setLoadError('Nenhum voluntário selecionado para edição.');
        setFormData(createDefaultFormState());
        setPracticeTimeNumber('');
        setPracticeTimeUnit('');
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);
        const volunteer = await voluntarioClient.get(volunteerId);
        if (!volunteer || ignore) {
          return;
        }

        const address = parseJSONField<Address>(volunteer.endereco, DEFAULT_ADDRESS);
        const contact = parseJSONField<Contact>(volunteer.contato, DEFAULT_CONTACT);
        const practiceTime = volunteer.tempo_pratica ?? '';
        const practiceTimeParts = getPracticeTimeParts(practiceTime);

        setPracticeTimeNumber(practiceTimeParts.number);
        setPracticeTimeUnit(practiceTimeParts.unit);

        setFormData({
          name: volunteer.nome ?? '',
          nickname: volunteer.apelido ?? '',
          age: volunteer.idade?.toString() ?? '',
          practice_time: practiceTime,
          graduation: volunteer.graduacao ?? '',
          gender: volunteer.genero ?? '',
          weight: volunteer.peso?.toString() ?? '',
          height: volunteer.altura?.toString() ?? '',
          address: { ...DEFAULT_ADDRESS, ...address },
          contact: { ...DEFAULT_CONTACT, ...contact },
        });
      } catch (error) {
        console.error('Erro ao carregar voluntário para edição', error);
        setLoadError('Erro ao carregar os dados do voluntário.');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadVolunteer();

    return () => {
      ignore = true;
    };
  }, [isOpen, volunteerId]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(createDefaultFormState());
      setPracticeTimeNumber('');
      setPracticeTimeUnit('');
      setLoadError(null);
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData((previousData) => {
      const nextPracticeTime =
        practiceTimeNumber && practiceTimeUnit
          ? `${practiceTimeNumber} ${practiceTimeUnit}`
          : '';

      if (previousData.practice_time === nextPracticeTime) {
        return previousData;
      }

      return {
        ...previousData,
        practice_time: nextPracticeTime,
      };
    });
  }, [practiceTimeNumber, practiceTimeUnit]);

  const updateData = (name: string, value: string) => {
    setFormData((previousData) => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...previousData,
          [parent]: {
            ...(previousData as any)[parent],
            [child]: value,
          },
        } as FormState;
      }

      return { ...previousData, [name]: value };
    });
  };

  const onInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateData(name, value);
  };

  const onSelectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    updateData(name, value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!volunteerId) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const updatedVolunteer = await voluntarioClient.update(volunteerId, {
        nome: formData.name,
        apelido: formData.nickname,
        idade: Number(formData.age),
        tempo_pratica: formData.practice_time,
        graduacao: formData.graduation,
        genero: formData.gender,
        peso: Number(formData.weight),
        altura: Number(formData.height),
        endereco: JSON.stringify(formData.address),
        contato: JSON.stringify(formData.contact),
      });

      showSuccessMessage('Voluntário atualizado com sucesso!');
      onSuccess(updatedVolunteer);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar voluntário', error);
      setSubmitError('Erro ao atualizar voluntário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="edit-modal__feedback">
          Carregando dados do voluntário...
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="edit-modal__feedback">
          {loadError}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="edit-modal__form">
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
          <Input
            label="Idade"
            type="number"
            name="age"
            required
            value={formData.age}
            min={10}
            max={90}
            onChange={onInputChangeHandler}
          />
        </div>
        <div className="Line">
          <Input
            label="Tempo de prática"
            type="number"
            name="practice_time_number"
            value={practiceTimeNumber}
            min={0}
            required
            onChange={(event) => setPracticeTimeNumber(event.target.value)}
          />
          <Select
            items={[
              { text: 'Selecione a unidade', value: '', disabled: true },
              { text: 'Meses', value: 'meses' },
              { text: 'Anos', value: 'anos' },
            ]}
            label="Unidade"
            name="practice_time_unit"
            required
            value={practiceTimeUnit}
            onChange={(event) => setPracticeTimeUnit(event.target.value)}
          />
          <Select
            items={[
              { text: 'Selecione a graduação', value: '', disabled: true },
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
            onChange={onSelectChangeHandler}
          />
          <Select
            items={[
              { text: 'Selecione o gênero', value: '', disabled: true },
              { text: 'Masculino', value: 'masculino' },
              { text: 'Feminino', value: 'feminino' },
              { text: 'Não informar', value: 'nao_informar' },
            ]}
            label="Gênero"
            name="gender"
            required
            value={formData.gender}
            onChange={onSelectChangeHandler}
          />
        </div>
        <div className="Line">
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
              { text: 'Selecione a UF', value: '', disabled: true },
              { text: 'Acre', value: 'AC' },
              { text: 'Alagoas', value: 'AL' },
              { text: 'Amapá', value: 'AP' },
              { text: 'Amazonas', value: 'AM' },
              { text: 'Bahia', value: 'BA' },
              { text: 'Ceará', value: 'CE' },
              { text: 'Distrito Federal', value: 'DF' },
              { text: 'Espírito Santo', value: 'ES' },
              { text: 'Goiás', value: 'GO' },
              { text: 'Maranhão', value: 'MA' },
              { text: 'Mato Grosso', value: 'MT' },
              { text: 'Mato Grosso do Sul', value: 'MS' },
              { text: 'Minas Gerais', value: 'MG' },
              { text: 'Pará', value: 'PA' },
              { text: 'Paraíba', value: 'PB' },
              { text: 'Paraná', value: 'PR' },
              { text: 'Pernambuco', value: 'PE' },
              { text: 'Piauí', value: 'PI' },
              { text: 'Rio de Janeiro', value: 'RJ' },
              { text: 'Rio Grande do Norte', value: 'RN' },
              { text: 'Rio Grande do Sul', value: 'RS' },
              { text: 'Rondônia', value: 'RO' },
              { text: 'Roraima', value: 'RR' },
              { text: 'Santa Catarina', value: 'SC' },
              { text: 'São Paulo', value: 'SP' },
              { text: 'Sergipe', value: 'SE' },
              { text: 'Tocantins', value: 'TO' },
            ]}
            label="UF"
            name="address.uf"
            required
            value={formData.address.uf}
            onChange={onSelectChangeHandler}
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
        {submitError && <span className="edit-modal__error">{submitError}</span>}
        <div className="Line">
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar alterações
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar voluntário" size="large">
      {renderContent()}
    </Modal>
  );
}

