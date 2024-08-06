import React, { useState, useEffect } from 'react';
import { IoBagHandle, IoCartOutline, IoBookOutline } from 'react-icons/io5';
import { FcManager, FcMenu } from "react-icons/fc";

function DashboardStatsGrid() {
  const [categoryCount, setCategoryCount] = useState(0); 
  const [publisherCount, setPublisherCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch category count');
        }
        const data = await response.json();
        setCategoryCount(data.length); 
      } catch (error) {
        console.error('Error fetching category count:', error);
      }
    };

    // Gọi API để lấy số lượng nhà xuất bản
    const fetchPublisherCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/publishers');
        if (!response.ok) {
          throw new Error('Failed to fetch publisher count');
        }
        const data = await response.json();
        setPublisherCount(data.length); // Cập nhật state với số lượng nhà xuất bản từ API
      } catch (error) {
        console.error('Error fetching publisher count:', error);
      }
    };
    // Gọi API để lấy số lượng sản phẩm
    const fetchProductCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch publisher count');
        }
        const data = await response.json();
        setProductCount(data.length); // Cập nhật state với số lượng nhà xuất bản từ API
      } catch (error) {
        console.error('Error fetching publisher count:', error);
      }
    };

    // Gọi API để lấy số lượng đơn hàng
    const fetchOrderCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/all-orders');
        if (!response.ok) {
          throw new Error('Failed to fetch publisher count');
        }
        const data = await response.json();
        setOrderCount(data.length); // Cập nhật state với số lượng nhà xuất bản từ API
      } catch (error) {
        console.error('Error fetching publisher count:', error);
      }
    };

    // Gọi hàm fetchCategoryCount và fetchPublisherCount khi component được render
    fetchOrderCount();
    fetchProductCount();
    fetchCategoryCount();
    fetchPublisherCount();
  }, []);

  return (
    <div className='flex gap-4 w-full'>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-300'>
          <IoCartOutline className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Đơn đặt hàng</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{orderCount}</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-300'>
          <IoBookOutline className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Sản phẩm</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{productCount}</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-300'>
          <FcMenu className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Thể loại</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{categoryCount}</strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-300'>
          <FcManager className='text-2xl text-white' />
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