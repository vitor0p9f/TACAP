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

        setFormData({
          name: volunteer.nome ?? '',
          nickname: volunteer.apelido ?? '',
          age: volunteer.idade?.toString() ?? '',
          practice_time: volunteer.tempo_pratica ?? '',
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
      setLoadError(null);
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

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
            type="text"
            name="practice_time"
            value={formData.practice_time}
            required
            onChange={onInputChangeHandler}
          />
          <Select
            items={[
              { text: 'Selecione a graduação', value: '', disabled: true },
              { text: 'Sem corda', value: 'sem_corda' },
              { text: 'Crua (Iniciante)', value: 'crua' },
              { text: 'Verde', value: 'verde' },
              { text: 'Amarela', value: 'amarela' },
              { text: 'Azul', value: 'azul' },
              { text: 'Roxa', value: 'roxa' },
              { text: 'Marrom', value: 'marrom' },
              { text: 'Vermelha', value: 'vermelha' },
              { text: 'Laranja', value: 'laranja' },
              { text: 'Preta', value: 'preta' },
              { text: 'Graduado', value: 'graduado' },
              { text: 'Instrutor', value: 'instrutor' },
              { text: 'Professor', value: 'professor' },
              { text: 'Contra-Mestre', value: 'contra_mestre' },
              { text: 'Mestre', value: 'mestre' },
              { text: 'Grão-Mestre', value: 'grao_mestre' },
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

