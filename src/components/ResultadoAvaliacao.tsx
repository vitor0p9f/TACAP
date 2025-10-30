import React, { useEffect, useRef, useState, useContext } from 'react';
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
  voluntarioId?: number | null;
}

interface DadosAvaliacao {
  RFC: { individuo: number; populacao: number };
  IACAP: { individuo: number; populacao: number };
  IF: { individuo: number; populacao: number };
  PSE: { individuo: number; populacao: number };
  potenciaTACAP: { individuo: number; populacao: number };
}

const mockRadarData: DadosAvaliacao = {
  RFC: { individuo: 8, populacao: 10 },
  IACAP: { individuo: 7.5, populacao: 6.8 },
  IF: { individuo: 6, populacao: 7.5 }, 
  PSE: { individuo: 8, populacao: 10 },
  potenciaTACAP: { individuo: 9, populacao: 8 },
};

const ResultadoAvaliacao: React.FC<ResultadoAvaliacaoProps> = ({ isOpen, onClose, voluntarioId }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [avaliacao, setAvaliacao] = useState<any | null>(null);
  const population = useContext(PopulationContext);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetch = async () => {
      if (!isOpen || !voluntarioId) return;
      try {
        const avaliacoes = (await window.api.invoke(
          'avaliacao:listByVoluntario',
          voluntarioId
        )) as any[];
        if (avaliacoes && avaliacoes.length > 0) {
          setAvaliacao(avaliacoes[0]);
        } else {
          setAvaliacao(null);
        }
      } catch (e) {
        console.error('Erro ao carregar avaliação:', e);
        setAvaliacao(null);
      }
    };
    fetch();
  }, [isOpen, voluntarioId]);

  const labels = ['RFC', 'IACAP', 'IF', 'PSE', 'Potência TACAP'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Indivíduo',
        data: [
          avaliacao?.rfc ?? 0,
          avaliacao?.iacap ?? 0,
          avaliacao?.if_valor ?? 0,
          avaliacao?.pse ?? 0,
          avaliacao?.potencia ?? 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Média da População',
        data: [
            population.means.rfc || 0,
            population.means.iacap || 0,
            population.means.if_value || 0,
            population.means.pse || 0,
            population.means.power || 0,
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
        suggestedMax: 10,
        ticks: {
          stepSize: 1,
          font: {
            size: 8,
            family: 'Arial, sans-serif'
          },
          maxTicksLimit: 6
        },
        pointLabels: {
          font: {
            size: 10
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 10,
            family: 'Arial, sans-serif'
          },
          padding: 15
        }
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
      </div>
    </dialog>
  );
};

export default ResultadoAvaliacao;
