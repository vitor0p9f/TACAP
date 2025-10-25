import React, { useEffect, useMemo, useState } from "react"
import styles from "./style.module.css"
import { Scatter } from 'react-chartjs-2';
import { Select } from "../../components/select";
import { ChartOptions } from "chart.js";
import { Voluntario, voluntarioClient } from "../../services/voluntarioClient";
import { Avaliacao } from "../../../electron/models/avaliacao";
import { avaliacaoClient } from "../../services/avaliacaoClient";

async function getAllVolunteers(){
  let volunteers = await voluntarioClient.list()
  
  return volunteers
}

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

const DashboardPage: React.FC = () => {
    const [allVolunteers, setAllVolunteers] = useState<Voluntario[]>([]);
    const [allEvaluations, setAllEvaluations] = useState<Record<number, Avaliacao>>({});
    const [currentShowingData, setCurrentShowingData] = useState("");
    const [chartPoints, setChartPoints] = useState<any[]>([]);

    useEffect(() => {
      (async () => {
        const volunteers = await getAllVolunteers();
        setAllVolunteers(volunteers);

        const evals: Record<number, Avaliacao> = {};
        await Promise.all(
          volunteers.map(async (v) => {
            if (v.id) {
              const a = await avaliacaoClient.listByVoluntario(v.id);
              if (a[0]) evals[v.id] = a[0];
            }
          })
        );
        setAllEvaluations(evals);
      })();
    }, []);

    useEffect(() => {
      if (!currentShowingData) return;
      console.log("Vou procurar")

      const points = allVolunteers.map((v, index) => {
        if (!v.id || !allEvaluations[v.id]) return null;

        const pair = getTextValuePairByVariable(allEvaluations[v.id], currentShowingData);

        return {
          x: index + 1,
          y: pair[1],
          name: v.nome,
          graduation: v.graduacao,
          practice_time: v.tempo_pratica,
          label: pair[0],
        };
      }).filter(Boolean);

      console.log(points)

      setChartPoints(points as any[]);
    }, [currentShowingData, allVolunteers, allEvaluations]);

    const onSelectChangeHadler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {name, value} = event.target

      setCurrentShowingData(value)
    }

    const chartData = {
        datasets: [{
          label: 'Voluntários',
          data: chartPoints,
          backgroundColor: 'rgb(255, 99, 132)'
        }],
    };

    const chartOptions: ChartOptions<'scatter'> = {
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