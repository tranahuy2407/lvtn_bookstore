import React from 'react';
import { SiGitbook } from 'react-icons/si';

const Invoice = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto py-0 md:py-16">
        <article className="shadow-none md:shadow-md md:rounded-md overflow-hidden">
          <div className="md:rounded-b-md bg-white">
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-6">
                <div className="flex justify-between items-top">
                  <div className="space-y-4">
                    <div>
                    <SiGitbook className="inline-block" /> HS Bookstore
                      <p className="font-bold text-lg"> Hóa đơn </p>
                      <p> HS Bookstore </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-400"> Hóa đơn cho </p>
                      <p> Tony Stark </p>
                      <p> tony@starkindustriesxyz.com </p>
                      <p> (02) 1234 1234 </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm text-gray-400"> Mã hóa đơn </p>
                      <p> INV-MJ0001 </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-400"> Ngày tạo </p>
                      <p> 31 December 2021 </p>
                    </div>
                    <div>
                      <a href="#" target="_blank" className="inline-flex items-center text-sm font-medium text-blue-500 hover:opacity-75">
                        Download PDF
                        <svg className="ml-0.5 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-9 border-b border-gray-200">
              <p className="font-medium text-sm text-gray-400"> Ghi chú </p>
              <p className="text-sm"> Cảm ơn bạn đã đặt hàng. Chúc bạn đọc sách thật vui vẻ ! </p>
            </div>
            <table className="w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th scope="col" className="px-9 py-4 text-left font-semibold text-gray-400"> Sản phẩm </th>
                  <th scope="col" className="px-9 py-4 text-left font-semibold text-gray-400"> Tên sản phẩm </th>
                  <th scope="col" className="py-3 text-left font-semibold text-gray-400"> Tổng cộng </th>
                  <th scope="col" className="py-3 text-left font-semibold text-gray-400"> Giảm giá </th>
                  <th scope="col" className="py-3 text-left font-semibold text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                    <div>
                      <p> Jericho III (YA-4) </p>
                      <p className="text-sm text-gray-400"> Nuclear-armed ICBM </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"></td>
                  <td className="whitespace-nowrap text-gray-600 truncate"> $380,000.00 </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"> 0% </td>
                </tr>
                <tr>
                  <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                    <div>
                      <p> Pym Particles (Pack of 10,000) </p>
                      <p className="text-sm text-gray-400"> Redacted Description </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"></td>
                  <td className="whitespace-nowrap text-gray-600 truncate"> $280,000.00 </td>
                  <td className="whitespace-nowrap text-gray-600 truncate"> 0% </td>
                </tr>
              </tbody>
            </table>
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm"> Tổng cộng</p>
                  </div>
                  <p className="text-gray-500 text-sm"> $660,000.00 </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm"> Thuế </p>
                  </div>
                  <p className="text-gray-500 text-sm"> $0.00 </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm"> Thành tiền </p>
                  </div>
                  <p className="text-gray-500 text-sm"> $660,000.00 </p>
                </div>
              </div>
            </div>
            <div className="p-9 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-black text-lg">Thành tiền </p>
                  </div>
                  <p className="font-bold text-black text-lg"> $360.00 </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Invoice;
