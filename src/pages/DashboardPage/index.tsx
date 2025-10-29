import React, { useContext, useEffect, useState } from "react"
import styles from "./style.module.css"
import { Scatter } from 'react-chartjs-2';
import { Select } from "../../components/select";
import { ChartOptions } from "chart.js";
import { Avaliacao } from "../../../electron/models/avaliacao";
import { PopulationContext } from "../../context/population";

function getTextValuePairByVariable(assessment: Avaliacao, variable: string){
  
  switch (variable) {
    case "iacap":
      return ["IACAP: ", assessment.iacap]

    case "tacap_power":
      return ["Potência TACAP: ", assessment.potencia]

    case "rfc":
      return ["Recuperação da frequência cardíaca: ", assessment.rfc]

    case "pse":
      return ["Percepção subjetiva de esforço: ", assessment.pse]
  
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

      const points = population.all_volunteers.map((v, index) => {
        if (!v.id || !population.all_assessments[v.id]) return null;

        const pair = getTextValuePairByVariable(population.all_assessments[v.id], currentShowingData);

        return {
          x: index + 1,
          y: pair[1],
          name: v.nome,
          graduation: v.graduacao,
          practice_time: v.tempo_pratica,
          label: pair[0],
        };
      }).filter(Boolean)
      // 🔹 Reindexa os pontos após o filtro
      .map((p, i) => ({
        ...p,
        x: i + 1,
      }));

      setChartPoints(points as any[]);

      console.log(points)
      
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
        },
        {
          label: 'Média da população',
          data: [
            { x: 0, y: mean },
            { x: chartPoints.length + 1, y: mean },
          ],
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          fill: false,
          type: 'line' as const,
          pointRadius: 0,
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
            callbacks: {
              label: ctx => {
                let data = ctx.raw as any

                return [
                  `Nome: ${data.name}`,
                  `Tempo de prática: ${data.practice_time}`,
                  `Graduação: ${data.graduation}`,
                  `${data.label}${data.y}`
                ]
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
                }
              ]} 
            />
        </main>
    )
}

export default DashboardPage