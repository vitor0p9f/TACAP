import React, { useState, useEffect } from 'react';
import { mockVolunteers, Volunteer } from '../../mocks/volunteers';
import { FileText, Clipboard, Edit, Trash2 } from 'lucide-react';

export function VolunteerTable() {
  // 1. Estado para armazenar a lista de voluntários
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // 2. useEffect para simular a busca de dados quando o componente é montado
  useEffect(() => {
    // Simulando uma chamada de API com um pequeno atraso
    const fetchData = () => {
      console.log("Buscando dados...");
      setTimeout(() => {
        setVolunteers(mockVolunteers);
        console.log("Dados carregados!");
      }, 500);
    };

    fetchData();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Apelido</th>
            <th>Graduação</th>
            <th>Tempo de prática</th>
            <th>Realizou avaliação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* 3. Mapeamos os dados do estado para renderizar as linhas da tabela */}
          {volunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <td>{volunteer.apelido}</td>
              <td>{volunteer.graduacao}</td>
              <td>{volunteer.tempoDePratica}</td>
              <td>{volunteer.realizouAvaliacao ? 'Sim' : 'Não'}</td>
              <td className="actions-cell">
                {volunteer.realizouAvaliacao ? (
                  <button title="Ver avaliação">
                    <FileText size={20} />
                  </button>
                ) : (
                  <button title="Realizar avaliação">
                    <Clipboard size={20} />
                  </button>
                )}
                <button title="Editar">
                  <Edit size={20} />
                </button>
                <button title="Excluir">
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}