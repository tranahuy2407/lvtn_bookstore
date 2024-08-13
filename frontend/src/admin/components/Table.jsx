import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function Table() {
  const [data, setData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('day'); // State for selected time period

  useEffect(() => {
    fetch('http://localhost:5000/admin/analytics')
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  }, []);

  // Process data based on the selected time period
  const processData = () => {
    let labels = [];
    let totalRevenueData = [];
    let totalExpenseData = [];

    if (timePeriod === 'day') {
      labels = data.map(item => item.date);
      totalRevenueData = data.map(item => item.totalRevenue);
      totalExpenseData = data.map(item => item.totalExpense);
    } else if (timePeriod === 'month') {
      // Aggregate data by month
      const monthlyData = data.reduce((acc, item) => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { totalRevenue: 0, totalExpense: 0 };
        }
        acc[month].totalRevenue += item.totalRevenue;
        acc[month].totalExpense += item.totalExpense;
        return acc;
      }, {});

      labels = Object.keys(monthlyData);
      totalRevenueData = labels.map(month => monthlyData[month].totalRevenue);
      totalExpenseData = labels.map(month => monthlyData[month].totalExpense);
    } else if (timePeriod === 'year') {
      // Aggregate data by year
      const yearlyData = data.reduce((acc, item) => {
        const year = new Date(item.date).getFullYear();
        if (!acc[year]) {
          acc[year] = { totalRevenue: 0, totalExpense: 0 };
        }
        acc[year].totalRevenue += item.totalRevenue;
        acc[year].totalExpense += item.totalExpense;
        return acc;
      }, {});

      labels = Object.keys(yearlyData);
      totalRevenueData = labels.map(year => yearlyData[year].totalRevenue);
      totalExpenseData = labels.map(year => yearlyData[year].totalExpense);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Tổng doanh thu',
          data: totalRevenueData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Tổng chi phí',
          data: totalExpenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartData = processData();
  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Doanh thu và Chi phí theo ${timePeriod === 'day' ? 'ngày' : timePeriod === 'month' ? 'tháng' : 'năm'}`
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timePeriod === 'day' ? 'Ngày' : timePeriod === 'month' ? 'Tháng' : 'Năm'
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
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Thống kê Doanh thu và Chi phí</strong>
      <div className='mt-4'>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className='p-2 border border-gray-300 rounded'
        >
          <option value='day'>Theo Ngày</option>
          <option value='month'>Theo Tháng</option>
          <option value='year'>Theo Năm</option>
        </select>
      </div>
      <div className='mt-4'>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Table;
