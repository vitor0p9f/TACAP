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
import { Avaliacao } from '../../electron/models/avaliacao';

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
}

const ResumoFisico: React.FC<ResumoFisicoProps> = ({ isOpen, onClose, voluntarioId }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [userData, setUserData] = useState({
    nome: '—',
    genero: '—',
    idade: 0,
    tempoDePratica: 0,
    dataAvaliacao: ""
  });
  const population = useContext(PopulationContext);
  const [chartValues, setChartValues] = useState<DadosResumo>({
    IACAP: { individuo: 0, populacao: population.means.iacap },
    indiceFadiga: { individuo: 0, populacao: population.means.if_value },
    potenciaTACAP: { individuo: 0, populacao: population.means.power },
    recuperacaoFC: { individuo: 0, populacao: population.means.rfc },
    PSE: { individuo: 0, populacao: population.means.pse },
    peso: { individuo: 0, populacao: population.means.weight },
    altura: { individuo: 0, populacao: population.means.height },
  });
  

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
        const ultima: Avaliacao = Array.isArray(avaliacoes) && avaliacoes.length > 0 ? avaliacoes[0] : null;

        if (vol) {
          setUserData({
            nome: vol.nome ?? '—',
            genero: vol.genero ?? '—',
            idade: vol.idade ?? 0,
            tempoDePratica: vol.tempo_pratica || "",
            dataAvaliacao: ultima.created_at || ""
          });
        }

        if (ultima || vol) {
          setChartValues({
            IACAP: { individuo: ultima?.iacap ?? 0, populacao: population.means.iacap || 0 },
            indiceFadiga: { individuo: ultima?.if_valor ?? 0, populacao: population.means.if_value || 0 },
            potenciaTACAP: { individuo: ultima?.potencia ?? 0, populacao: population.means.power || 0 },
            recuperacaoFC: { individuo: ultima?.rfc ?? 0, populacao: population.means.rfc || 0 },
            PSE: { individuo: ultima?.pse ?? 0, populacao: population.means.pse || 0 },
            peso: { individuo: vol?.peso ?? 0, populacao: population.means.weight || 0 },
            altura: { individuo: vol?.altura ?? 0, populacao: population.means.height || 0 }
          });
        }
      } catch (e) {
        console.error('Erro ao carregar resumo físico:', e);
      }
    };
    fetch();
  }, [isOpen, voluntarioId]);
  
  const labels = ['IACAP', 'Índice de fadiga', 'Potência TACAP', 'Recuperação FC', 'PSE', 'Peso (kg)', 'Altura (m)'];
  
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
          chartValues.altura.individuo
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
                <p className={styles.headerDate}>{userData.dataAvaliacao}</p>
            </div>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </header>
        
        <section className={styles.userInfo}>
          <h3 className={styles.userName}>{userData.nome}</h3>
          <p className={styles.userDetails}>
            {userData.genero}, {userData.idade}, {userData.tempoDePratica}
          </p>
        </section>

        <main className={styles.chartContainer}>
          <Bar options={chartOptions} data={chartData} />
        </main>
      </div>
    </dialog>
  );
};

export default ResumoFisico;