import React, { useEffect } from "react"
import styles from "./style.module.css"
import { Scatter } from 'react-chartjs-2';
import { Select } from "../../components/select";
import { ChartOptions } from "chart.js";

const DashboardPage: React.FC = () => {
    useEffect(()=>{

    }, [])

    const chartData = {
        datasets: [{
          label: 'Scatter Dataset',
          data: [{
            x: -10,
            y: 0
          }, {
            x: 0,
            y: 10
          }, {
            x: 10,
            y: 5
          }, {
            x: 0.5,
            y: 5.5
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        }],
    };

    const chartOptions: ChartOptions<'scatter'> = {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
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
        },
      };

    return (
        <main className={styles.main}>
            <div className={styles.chartContainer}>
                <Scatter data={chartData} options={chartOptions}/>
            </div>

            <Select label="Variável de análise" items={[{
                text: "IACAP",
                value: "iacap"
            },{
                text: "Potência TACAP",
                value: "potencia_tacap"
            }]} />
        </main>
    )
}

export default DashboardPage