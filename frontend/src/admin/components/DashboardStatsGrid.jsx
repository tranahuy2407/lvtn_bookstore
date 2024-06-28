import React, { useState, useEffect } from 'react';
import { IoBagHandle } from 'react-icons/io5';

function DashboardStatsGrid() {
  const [categoryCount, setCategoryCount] = useState(0); // State để lưu số lượng thể loại
  const [publisherCount, setPublisherCount] = useState(0); // State để lưu số lượng nhà xuất bản

  useEffect(() => {
    // Gọi API để lấy số lượng thể loại
    const fetchCategoryCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/category/count');
        if (!response.ok) {
          throw new Error('Failed to fetch category count');
        }
        const data = await response.json();
        setCategoryCount(data.count); // Cập nhật state với số lượng thể loại từ API
      } catch (error) {
        console.error('Error fetching category count:', error);
      }
    };

    // Gọi API để lấy số lượng nhà xuất bản
    const fetchPublisherCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/publisher/count');
        if (!response.ok) {
          throw new Error('Failed to fetch publisher count');
        }
        const data = await response.json();
        setPublisherCount(data.count); // Cập nhật state với số lượng nhà xuất bản từ API
      } catch (error) {
        console.error('Error fetching publisher count:', error);
      }
    };

    // Gọi hàm fetchCategoryCount và fetchPublisherCount khi component được render
    fetchCategoryCount();
    fetchPublisherCount();
  }, []);

  return (
    <div className='flex gap-4 w-full'>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Đơn đặt hàng</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>$1234</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Sản phẩm</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>$1234</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Thể loại</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{categoryCount}</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Nhà xuất bản</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{publisherCount}</strong>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
}

export default DashboardStatsGrid;

function BoxWrapper({ children }) {
  return (
    <div className='bg-white rounded-sm p-4 flex-1 border-gray-200 flex items-center'>{children}</div>
  );
}