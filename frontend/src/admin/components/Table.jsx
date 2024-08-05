import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function Table() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/admin/analytics')
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  }, []);
  
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: data.map(item => item.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Tổng chi phí',
        data: data.map(item => item.totalExpense),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Doanh thu và Chi phí theo thời gian'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Số tiền'
        }
      }
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 '>
      <strong className='text-gray-700 font-medium'>Thống kê Doanh thu và Chi phí</strong>
      <div className='mt-4'>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Table;
