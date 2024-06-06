import React from 'react';
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const Admin = () => {



  const data = {
    labels: ["water", "coffee", "sports", "shake","cola","ade"],
    datasets: [
      {
        data: [10, 8, 9, 8,10,9],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50","#FF6384","#FF6384"],
        borderWidth: 1,
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF6384",
          "#FF6384"
        ],
      },
    ],
     hoverOffset: 4
  };

  return (

    <div>
      <div>
      <button onClick={() => makeUpDrinks()}>¿‹∞Ì ∫∏√Ê</button>    
      </div>
      <div className='chart d-flex justify-content-center'>
        <h1>Drinks </h1>
      </div>
      <Doughnut data={data} width={400} height={400}/>
    </div>
  );
};

export default Admin;
