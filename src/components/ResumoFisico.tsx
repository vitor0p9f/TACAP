import React, { useEffect, useRef, useState, useContext } from 'react';
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
import { PopulationContext } from '../context/population';

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
  voluntarioId?: number | null;
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

const mockUserData = {
  nome: '—',
  genero: '—',
  idade: 0,
  anosDePratica: 0,
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

const ResumoFisico: React.FC<ResumoFisicoProps> = ({ isOpen, onClose, voluntarioId }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [userData, setUserData] = useState(mockUserData);
  const [chartValues, setChartValues] = useState<DadosResumo>(mockChartData);
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
        const [volResp, avaliacoes] = await Promise.all([
          window.api.invoke('voluntario:get', voluntarioId),
          window.api.invoke('avaliacao:listByVoluntario', voluntarioId),
        ]);
        const vol: any = volResp as any;
        const ultima = Array.isArray(avaliacoes) && avaliacoes.length > 0 ? avaliacoes[0] : null;

        if (vol) {
          setUserData({
            nome: vol.nome ?? '—',
            genero: vol.genero ?? '—',
            idade: vol.idade ?? 0,
            anosDePratica: Number(vol.tempo_pratica) || 0,
          });
        }

        if (ultima || vol) {
          setChartValues({
            IACAP: { individuo: ultima?.iacap ?? 0, populacao: population.means.iacap || 0 },
            indiceFadiga: { individuo: ultima?.if_valor ?? 0, populacao: population.means.if_value || 0 },
            potenciaTACAP: { individuo: ultima?.potencia ?? 0, populacao: population.means.power || 0 },
            recuperacaoFC: { individuo: ultima?.rfc ?? 0, populacao: population.means.rfc || 0 },
            PSE: { individuo: ultima?.pse ?? 0, populacao: population.means.pse || 0 },
            peso: { individuo: vol?.peso ?? 0, populacao: 0 },
            altura: { individuo: vol?.altura ?? 0, populacao: 0 },
            BPM: { individuo: ultima?.rfc ?? 0, populacao: population.means.rfc || 0 },
          });
        }
      } catch (e) {
        console.error('Erro ao carregar resumo físico:', e);
      }
    };
    fetch();
  }, [isOpen, voluntarioId]);
  
  const labels = ['IACAP', 'Índice de fadiga', 'Potência TACAP', 'Recuperação FC', 'PSE', 'Peso (kg)', 'Altura (m)', 'BPM'];
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Indivíduo',
        data: [
          chartValues.IACAP.individuo,
          chartValues.indiceFadiga.individuo,
          chartValues.potenciaTACAP.individuo,
          chartValues.recuperacaoFC.individuo,
          chartValues.PSE.individuo,
          chartValues.peso.individuo,
          chartValues.altura.individuo,
          chartValues.BPM.individuo,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'População',
        data: [
          chartValues.IACAP.populacao,
          chartValues.indiceFadiga.populacao,
          chartValues.potenciaTACAP.populacao,
          chartValues.recuperacaoFC.populacao,
          chartValues.PSE.populacao,
          chartValues.peso.populacao,
          chartValues.altura.populacao,
          chartValues.BPM.populacao,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: any = {
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
          <h3 className={styles.userName}>{userData.nome}</h3>
          <p className={styles.userDetails}>
            {userData.genero}, {userData.idade}, {userData.anosDePratica} anos de prática
          </p>
        </section>

        <main className={styles.chartContainer}>
          <Bar options={chartOptions} data={chartData} />
        </main>

        {/* footer removido conforme solicitado */}
      </div>
    </dialog>
  );
};

export default ResumoFisico;