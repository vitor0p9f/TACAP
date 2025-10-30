import React, { useContext, useEffect, useRef, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './ResultadoAvaliacao.module.css';
import { PopulationContext } from '../context/population';
import { Avaliacao, avaliacaoClient } from '../services/avaliacaoClient';
import { Voluntario } from '../services/voluntarioClient';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ResultadoAvaliacaoProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Voluntario | null
}

const ResultadoAvaliacao: React.FC<ResultadoAvaliacaoProps> = ({ isOpen, onClose, volunteer }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const populationContext = useContext(PopulationContext)
  const [assesment, setAssesment] = useState<Avaliacao>({
    voluntario_id: 0,
    iacap: 0,
    if_valor: 0,
    potencia: 0,
    pse: 0,
    rfc: 0
  })

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      (async () => {
        if (volunteer?.id) {
          const result = await avaliacaoClient.listByVoluntario(volunteer.id);
          if (Array.isArray(result) && result.length > 0 && result[0]) {
            setAssesment(result[0]);
          }
        }
      })();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, volunteer?.id]);

  const labels = ['RFC', 'IACAP', 'IF', 'PSE', 'Potência TACAP'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Indivíduo',
        data: [
          assesment.rfc,
          assesment.iacap,
          assesment.if_valor,
          assesment.pse,
          assesment.potencia
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Média da População',
        data: [
          populationContext.means.rfc,
          populationContext.means.iacap,
          populationContext.means.if_value,
          populationContext.means.pse,
          populationContext.means.power
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10, // Escala de 0-10 para normalizar todas as métricas
        ticks: {
          stepSize: 2 // Intervalos de 2 para melhor visualização
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <dialog ref={dialogRef} className={styles.modal} onClose={onClose}>
      <div className={styles.modalContent}>
        <header className={styles.header}>
          <h2>Resultado da avaliação</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </header>
        
        <main className={styles.chartContainer}>
          <Radar data={chartData} options={chartOptions} />
        </main>

        <footer className={styles.footer}>
          <button className={styles.exportButton}>Exportar</button>
        </footer>
      </div>
    </dialog>
  );
};

export default ResultadoAvaliacao;