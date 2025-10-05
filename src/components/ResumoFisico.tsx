import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './ResumoFisico.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResumoFisicoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DadosResumo {
  IACAP: { individuo: number; populacao: number };
  indiceFadiga: { individuo: number; populacao: number };
  potenciaTACAP: { individuo: number; populacao: number };
  recuperacaoFC: { individuo: number; populacao: number };
  PSE: { individuo: number; populacao: number };
  peso: { individuo: number; populacao: number };
  altura: { individuo: number; populacao: number };
  BPM: { individuo: number; populacao: number };
}

// Dados mocados para demonstração
const mockUserData = {
  nome: 'João da Silva',
  genero: 'Masculino',
  idade: 28,
  anosDePratica: 6,
};

const mockChartData: DadosResumo = {
  IACAP: { individuo: 7.5, populacao: 6.8 },
  indiceFadiga: { individuo: 12, populacao: 15 },
  potenciaTACAP: { individuo: 850, populacao: 780 },
  recuperacaoFC: { individuo: 50, populacao: 45 },
  PSE: { individuo: 8, populacao: 7 },
  peso: { individuo: 75, populacao: 78 },
  altura: { individuo: 1.78, populacao: 1.75 },
  BPM: { individuo: 185, populacao: 180 },
};

const ResumoFisico: React.FC<ResumoFisicoProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);
  
  const labels = ['IACAP', 'Índice de fadiga', 'Potência TACAP', 'Recuperação FC', 'PSE', 'Peso (kg)', 'Altura (m)', 'BPM'];
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Indivíduo',
        data: [
          mockChartData.IACAP.individuo,
          mockChartData.indiceFadiga.individuo,
          mockChartData.potenciaTACAP.individuo,
          mockChartData.recuperacaoFC.individuo,
          mockChartData.PSE.individuo,
          mockChartData.peso.individuo,
          mockChartData.altura.individuo,
          mockChartData.BPM.individuo,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'População',
        data: [
          mockChartData.IACAP.populacao,
          mockChartData.indiceFadiga.populacao,
          mockChartData.potenciaTACAP.populacao,
          mockChartData.recuperacaoFC.populacao,
          mockChartData.PSE.populacao,
          mockChartData.peso.populacao,
          mockChartData.altura.populacao,
          mockChartData.BPM.populacao,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparativo Físico',
      },
    },
    scales: {
      y: {
        type: 'logarithmic',
      },
    },
  };

  return (
    <dialog ref={dialogRef} className={styles.modal} onClose={onClose}>
      <div className={styles.modalContent}>
        <header className={styles.header}>
            <div className={styles.headerTitleContainer}>
                <h2>Resumo físico</h2>
                <p className={styles.headerDate}>30/07/2024</p>
            </div>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </header>
        
        <section className={styles.userInfo}>
          <h3 className={styles.userName}>{mockUserData.nome}</h3>
          <p className={styles.userDetails}>
            {mockUserData.genero}, {mockUserData.idade}, {mockUserData.anosDePratica} anos de prática
          </p>
        </section>

        <main className={styles.chartContainer}>
          <Bar options={chartOptions} data={chartData} />
        </main>

        <footer className={styles.footer}>
          <button className={styles.exportButton}>Exportar</button>
        </footer>
      </div>
    </dialog>
  );
};

export default ResumoFisico;