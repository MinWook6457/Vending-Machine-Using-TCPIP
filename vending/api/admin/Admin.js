import React, { useState, useEffect } from 'react';
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
  const [makeUpData, setMakeUpData] = useState(null);

  const makeUpDrinks = async () => {
    try {
      const response = await window.ipcRenderer.invoke('makeUp', {});
      const data = JSON.parse(response.refreshData);

      const labels = data.map(drink => drink.beverage);
      const drinkData = data.map(drink => drink.money);
      const backgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];
      const hoverBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];

      const chartData = {
        labels,
        datasets: [
          {
            data: drinkData,
            backgroundColor,
            borderWidth: 1,
            hoverBackgroundColor
          }
        ],
        hoverOffset: 6
      };

      setMakeUpData(chartData);
    } catch (error) {
      console.error('Failed to fetch drink data:', error);
    }
  };

  useEffect(() => {
    makeUpDrinks();
  }, []);

  return (
    <div>
      <div className='chart d-flex justify-content-center'>
        <h1>Drinks</h1>
      </div>
      <div className='d-flex justify-content-center'>
        <button onClick={makeUpDrinks}>Update Data</button>
      </div>
      {makeUpData && <Doughnut data={makeUpData} width={400} height={400} />}
    </div>
  );
};

export default Admin;
