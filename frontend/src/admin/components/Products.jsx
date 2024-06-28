import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        console.log('Products response:', response.data); // Kiểm tra dữ liệu sản phẩm trả về

        const productsWithDetails = await Promise.all(response.data.map(async product => {
          try {
            const publisherResponse = await axios.get(`http://localhost:5000/api/publishers/${product.publishers}/name`);
            console.log(`Publisher response for ${product.publishers}:`, publisherResponse.data); // Kiểm tra dữ liệu nhà xuất bản
            const publisherName = publisherResponse.data.name;

            const authorResponse = await axios.get(`http://localhost:5000/api/authors/${product.author}/name`);
            // console.log(`Author response for product ${product.author}:`, authorResponse.data); 
            const authorName = authorResponse.data.name;
            

            const categoryResponses = await Promise.all(product.categories.map(async categoryId => {
              const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}/name`);
              // console.log(`Category response for ${categoryId}:`, categoryResponse.data); 
              return categoryResponse.data.name;
            }));
            const categoryNames = categoryResponses.join(', '); // Kết hợp các tên thể loại thành một chuỗi

            

            return { ...product, publisherName, authorName, categoryNames };
          } catch (error) {
            console.error(`Error fetching details for product ${product._id}:`, error);
            return { ...product, publisherName: 'Unknown', categoryNames: 'Unknown', authorName: 'Unknown' }; // Gán giá trị mặc định nếu có lỗi
          }
        }));

        console.log('Products with details:', productsWithDetails); // Kiểm tra dữ liệu sản phẩm sau khi xử lý
        setProducts(productsWithDetails);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách sản phẩm</strong>
      <div className="mt-4 flex justify-start">
                <button
                    // onClick={handleAddPublisher}
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Thêm sản phẩm
                </button>
            </div>
      <div className='mt-3'>
        
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Giá niêm yết</th>
              <th>Giá khuyến mãi</th>
              <th>Thể loại</th>
              <th>Tác giả</th>
              <th>Nhà xuất bản</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.discount_price}</td>
                <td>{product.categoryNames}</td> {/* Hiển thị nhiều tên thể loại */}
                <td>{product.authorName}</td>
                <td>{product.publisherName}</td> {/* Hiển thị tên nhà xuất bản */}
                <td>{product.quantity}</td>
                <td>
                  <Link to={`/edit-product/${product._id}`} className='text-blue-500'>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;