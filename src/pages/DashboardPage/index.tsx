import React, { useContext, useEffect, useState } from "react"
import styles from "./style.module.css"
import { Scatter } from 'react-chartjs-2';
import { Select } from "../../components/select";
import { ChartOptions } from "chart.js";
import { Avaliacao } from "../../../electron/models/avaliacao";
import { PopulationContext } from "../../context/population";
import {
  Chart,
  ScatterController,
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from 'chart.js';
import { Voluntario } from "../../../electron/models/voluntario";

// Registrar controladores e elementos necessários
Chart.register(
  ScatterController,
  LineController,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Title,
  Legend
);

function getTextValuePairByVariable(volunteer: Voluntario, assessment: Avaliacao, variable: string){
  
  switch (variable) {
    case "iacap":
      return ["IACAP: ", assessment.iacap]

    case "tacap_power":
      return ["Potência TACAP: ", assessment.potencia]

    case "rfc":
      return ["Recuperação da frequência cardíaca: ", assessment.rfc]

    case "pse":
      return ["Percepção subjetiva de esforço: ", assessment.pse]

    case "weight":
      return ["Peso: ", volunteer.peso]

    case "height":
      return ["Altura: ", volunteer.altura]
  
    default:
      return []
  }
}

function getMeanByVariable(means: any, variable: string): number | null {
  switch (variable) {
    case "iacap": return means?.iacap ?? null;
    case "tacap_power": return means?.power ?? null;
    case "rfc": return means?.rfc ?? null;
    case "pse": return means?.pse ?? null;
    case "weight": return means?.weight ?? null;
    case "height": return means?.height ?? null;
    default: return null;
  }
}

const DashboardPage: React.FC = () => {
    const [currentShowingData, setCurrentShowingData] = useState("");
    const [chartPoints, setChartPoints] = useState<any[]>([]);
    const [mean, setMean] = useState(0)
    const population = useContext(PopulationContext)

    useEffect(() => {
      if (!currentShowingData) return;

      const points = population.all_assessments.map((assessment, index) => {
        if (!assessment) return null;

        const volunteer = population.all_volunteers.filter(v => v.id == assessment.voluntario_id)[0]

        if (!volunteer) return null

        const pair = getTextValuePairByVariable(volunteer, assessment, currentShowingData);

        return {
          x: index + 1,
          y: pair[1],
          name: volunteer.nome,
          graduation: volunteer.graduacao,
          practice_time: volunteer.tempo_pratica,
          label: pair[0],
        };
      }).filter(p => p !== null && p !== undefined)
      // 🔹 Reindexa os pontos após o filtro
      .map((p, i) => ({
        ...p,
        x: i + 1,
      }));

      setChartPoints(points as any[]);
      
      const meanValue = getMeanByVariable(population.means, currentShowingData)
      if (meanValue) setMean(meanValue) 
    }, [currentShowingData, population]);

    const onSelectChangeHadler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {name, value} = event.target

      setCurrentShowingData(value)
    }

    const chartData = {
      datasets: [
        {
          label: 'Voluntários',
          data: chartPoints,
          backgroundColor: 'rgb(255, 99, 132)',
          showLine: false,
          pointRadius: 5,
        },
        {
          label: 'Média da população',
          data: Array.from({ length: chartPoints.length + 2 }, (_, i) => ({
            x: i,
            y: mean
          })),
          type: 'line' as const,
          pointRadius: 4,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          borderColor: 'rgb(132, 88, 255)',
        }
      ]
    };

    const chartOptions: ChartOptions<'scatter' | 'line'> = {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            display: false
          },
          y: {
            type: 'linear',
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Panorama geral dos voluntários',
            font:{
                size: 16
            }
          },
          tooltip: {
            bodyFont: {
              size: 14, // tamanho do texto do corpo
            },
            callbacks: {
              title: () => null,
              label: ctx => {
                if (ctx.dataset.label === 'Voluntários') {
                  const data = ctx.raw as any;
                  return [
                    `Nome: ${data.name}`,
                    `Tempo de prática: ${data.practice_time}`,
                    `Graduação: ${data.graduation}`,
                    `${data.label}${data.y}`,
                  ];
                }
      
                // se for a linha média, mostra apenas valor
                if (ctx.dataset.label === 'Média da população') {
                  return `Média da população: ${mean}`;
                }      
              }
            }
          }
        },
      };

    return (
        <main className={styles.main}>
            <div className={styles.chartContainer}>
                <Scatter data={chartData} options={chartOptions}/>
            </div>

            <Select 
              label="Variável de análise"
              value={currentShowingData}
              onChange={onSelectChangeHadler} 
              items={[{
                  text: "Selecione uma variável",
                  value: "",
                  disabled: true
                },
                {
                  text: "IACAP",
                  value: "iacap"
                },{
                  text: "Potência TACAP",
                  value: "tacap_power"
                },{
                  text: "Recuperação de frequência cardíaca",
                  value: "rfc"
                },
                {
                  text: "Percepção subjetiva de esforço",
                  value: "pse"
                },
                {
                  text: "Peso",
                  value: "weight"
                },
                {
                  text: "Altura",
                  value: "height"
                }
              ]} 
            />
        </main>
    )
}

export default DashboardPage