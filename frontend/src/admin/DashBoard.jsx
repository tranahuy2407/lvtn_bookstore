import React from 'react'
import DashboardStatsGrid from './components/DashboardStatsGrid'
import Table from './components/Table'


const DashBoard = () => {
  return (
    <div className='flex flex-col gap-4'>
      <DashboardStatsGrid />
      <Table />
    </div>
  )
}

export default DashBoard