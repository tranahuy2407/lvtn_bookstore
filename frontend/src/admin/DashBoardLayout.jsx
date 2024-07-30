import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/components/Sidebar'
import Header from './components/Header';
const DashBoardLayout = () => {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-y-hidden'>
      
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden '>
        <Header />

        <div className='flex-1 p-4 overflow-y-auto'>{<Outlet />} </div>

      </div>
    </div>
    
  )
}

export default DashBoardLayout