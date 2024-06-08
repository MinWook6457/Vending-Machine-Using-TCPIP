import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Admin = () => {
  const [makeUpData, setMakeUpData] = useState(null);
  const [makeUpCoinData, setMakeUpCoinData] = useState(null);
  const [makeUpRecordData, setMakeUpRecordData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // 날짜 상태 추가

  const fetchData = async () => {
    try {
      const vendingResponse = await window.ipcRenderer.invoke('makeUpVending', {});
      const vendingData = JSON.parse(vendingResponse.refreshData);

      const coinResponse = await window.ipcRenderer.invoke('makeUpCoin', {});
      const coinData = JSON.parse(coinResponse.refreshData);

      const vendingLabels = vendingData.map(drink => drink.beverage);
      const vendingDrinkData = vendingData.map(drink => drink.money);
      const vendingBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];
      const vendingHoverBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];

      const vendingChartData = {
        labels: vendingLabels,
        datasets: [
          {
            label: 'Statistics for each beverage',
            data: vendingDrinkData,
            backgroundColor: vendingBackgroundColor,
            borderWidth: 1,
            hoverBackgroundColor: vendingHoverBackgroundColor
          }
        ],
      };

      setMakeUpData(vendingChartData);

      const coinLabels = coinData.map(coin => coin.unit);
      const coinDrinkData = coinData.map(coin => coin.change);
      const coinBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C"];
      const coinHoverBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C"];

      const coinChartData = {
        labels: coinLabels,
        datasets: [
          {
            label: 'Statistics for each coin unit',
            data: coinDrinkData,
            backgroundColor: coinBackgroundColor,
            borderWidth: 1,
            hoverBackgroundColor: coinHoverBackgroundColor
          }
        ],
      };

      setMakeUpCoinData(coinChartData);

      // const recordResponse = await window.ipcRenderer.invoke('record',{});
      // console.log(recordResponse) 

      // const recordLabels = Object.keys(responseRecordData);
      // const recordData = Object.values(responseRecordData);
      // const recordBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];
      // const recordHoverBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];

      // const recordChart = {
      //   labels: recordLabels,
      //   datasets: [
      //     {
      //       label: 'Statistics for each beverage',
      //       data: recordData,
      //       backgroundColor: recordBackgroundColor,
      //       borderWidth: 1,
      //       hoverBackgroundColor: recordHoverBackgroundColor
      //     }
      //   ],
      // };

      // setMakeUpRecordData(recordChart);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const record = async () => {
    try {
      const recordResponse = await window.ipcRenderer.invoke('record', { date: selectedDate });

      const responseRecordData = recordResponse.records;
      console.log(responseRecordData); 

      const recordLabels = Object.keys(responseRecordData);
      const recordData = Object.values(responseRecordData);
      const recordBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];
      const recordHoverBackgroundColor = ["#00FFFF", "#A0522D", "#0000FF", "#FFC0CB", "#DC143C", "#FFD700"];

      const recordChart = {
        labels: recordLabels,
        datasets: [
          {
            label: 'Statistics for each beverage',
            data: recordData,
            backgroundColor: recordBackgroundColor,
            borderWidth: 1,
            hoverBackgroundColor: recordHoverBackgroundColor
          }
        ],
      };

      setMakeUpRecordData(recordChart);
    } catch (error) {
      console.error('Failed to fetch data by date:', error);
    }
  };

  const collectCoin = async() => {
    const response = await window.ipcRenderer.invoke('collect',{});
    console.log(response)
  }

  useEffect(() => {
    fetchData();
  }, []);

  const offAdmin = async () => {
    localStorage.setItem('isCheck', 'false');
    alert('admin mode is off');
    window.location.hash = "#/";  
    window.ipcRenderer.send('reloadAllWindows', {});
  };

  return (
    <div>
      <div className='chart d-flex justify-content-center'>
        <h1>Statistics</h1>
      </div>
      <div className='d-flex justify-content-center'>
        <button onClick={fetchData}>Update Data</button>
      </div>
      <div className='d-flex justify-content-center flex-wrap'>
        <div style={{ width: '40%', height: '40%' }}>
          {makeUpData && <Bar data={makeUpData} options={{ maintainAspectRatio: false }} />}
        </div>
        <div style={{ width: '40%', height: '40%' }}>
          {makeUpCoinData && <Bar data={makeUpCoinData} options={{ maintainAspectRatio: false }} />}
        </div>
      </div>
      <div className='d-flex justify-content-center flex-wrap'>
        <div style={{ width: '40%', height: '40%' }}>
          {makeUpRecordData && <Bar data={makeUpRecordData} options={{ maintainAspectRatio: false }} />}
        </div>
        <div>
          <label htmlFor="record">
            <input 
              type="date" 
              name="record" 
              min="2024-01-01" 
              max="2024-12-31"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} // 날짜 상태 업데이트
            />
          </label>
          <button onClick={record}>record</button> 
        </div>
        <div>
        <button onClick={collectCoin}>collect</button> 
        </div>
      </div>
      <div>
        <button onClick={offAdmin}>OFF ADMIN MODE</button>
      </div>
    </div>
  );
};

export default Admin;
