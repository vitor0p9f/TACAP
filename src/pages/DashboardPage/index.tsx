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

function calcularRegressaoLinear(data: any[]) {
  const n = data.length;
  const sumX = data.reduce((acc, p) => acc + p.x, 0);
  const sumY = data.reduce((acc, p) => acc + p.y, 0);
  const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

  const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX); // inclinação
  const b = (sumY - a * sumX) / n; // intercepto
  return { a, b };
}

const DashboardPage: React.FC = () => {
    const [currentShowingData, setCurrentShowingData] = useState("");
    const [chartPoints, setChartPoints] = useState<any[]>([]);
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
      }).filter(Boolean);

      setChartPoints(points as any[]);
    }, [currentShowingData, population]);

    const regressionLine = () => {
      if (chartPoints.length === 0) return [];
    
      const { a, b } = calcularRegressaoLinear(chartPoints);
    
      // Descobre mínimo e máximo de X para cobrir todo o gráfico
      const minX = Math.min(...chartPoints.map(p => p.x));
      const maxX = Math.max(...chartPoints.map(p => p.x));
    
      return [
        { x: minX, y: a * minX + b },
        { x: maxX, y: a * maxX + b },
      ];
    };

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
          label: 'Linha de Regressão',
          data: regressionLine(),
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