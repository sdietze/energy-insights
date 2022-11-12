import React from 'react';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    plugins: {
        title: {
            display: true,
            text: 'Heizverbrauch',
        },
    },
    responsive: true,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

const labels_m: string[] = ['Jan', 'Feb', 'März', 'April', 'Mai', 'Jun', 'Jul', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'];

type EnergyChartDataSet = {
    year: number;
    data: number[];
}

type EnergyChartProps = {
    monthly: boolean;
    consumptions: EnergyChartDataSet[];
}


export default function EnergyChart({consumptions, monthly}: EnergyChartProps) {
    const m_datasets = consumptions.map((ds, index) => {
            const opacity = 0.5 + index * 0.1;
            return {
                label: ds.year.toFixed(0),
                stack: ds.year.toFixed(0),
                data: ds.data,
                backgroundColor: `rgb(75, 192, 192, ${opacity})`,
            }
        }
    )

    let data;

    if (monthly) {
        data = {
            labels: labels_m,
            datasets: m_datasets
        };
    } else {
        const labels_y = consumptions.map(consumption => consumption.year.toFixed(0));
        const dataset_y = {
            label: 'verbrauch',
            stack: 'verbrauch',
            data: consumptions.map((ds) => ds.data.reduce((pv, cv) => pv + cv, 0)),
            backgroundColor: `rgb(75, 192, 192)`,
        };
        data = {
            labels: labels_y,
            datasets: [dataset_y]
        };
    }


    return <Bar options={options} data={data}/>;
}
