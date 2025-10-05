import React, { useEffect, useRef } from 'react';
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
}

interface DadosAvaliacao {
  RFC: { individuo: number; populacao: number };
  IACAP: { individuo: number; populacao: number };
  IF: { individuo: number; populacao: number };
  PSE: { individuo: number; populacao: number };
  potenciaTACAP: { individuo: number; populacao: number };
}

// Dados de exemplo para demonstração
const mockRadarData: DadosAvaliacao = {
  RFC: { individuo: 8, populacao: 10 },
  IACAP: { individuo: 7.5, populacao: 6.8 },
  IF: { individuo: 6, populacao: 7.5 }, 
  PSE: { individuo: 8, populacao: 10 },
  potenciaTACAP: { individuo: 9, populacao: 8 },
};

const ResultadoAvaliacao: React.FC<ResultadoAvaliacaoProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const labels = ['RFC', 'IACAP', 'IF', 'PSE', 'Potência TACAP'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Indivíduo',
        data: [
          mockRadarData.RFC.individuo,
          mockRadarData.IACAP.individuo,
          mockRadarData.IF.individuo,
          mockRadarData.PSE.individuo,
          mockRadarData.potenciaTACAP.individuo,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Média da População',
        data: [
            mockRadarData.RFC.populacao,
            mockRadarData.IACAP.populacao,
            mockRadarData.IF.populacao,
            mockRadarData.PSE.populacao,
            mockRadarData.potenciaTACAP.populacao,
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
