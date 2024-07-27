import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faColumns } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Modal, message } from 'antd';
import EditProductForm from './EditProductFormm';

function Products() {
  const [products, setProducts] = useState([]);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showColumnsForm, setShowColumnsForm] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    image: true,
    description: true,
    price: true,
    promotionPrice: true,
    categories: true,
    author: true,
    publisher: true,
    quantity: true,
    actions: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const productsWithDetails = await Promise.all(response.data.map(async product => {
          try {
            const publisherResponse = await axios.get(`http://localhost:5000/api/publishers/${product.publishers}/name`);
            const publisherName = publisherResponse.data.name;

            const authorResponse = await axios.get(`http://localhost:5000/api/authors/${product.author}/name`);
            const authorName = authorResponse.data.name;

            const categoryResponses = await Promise.all(product.categories.map(async categoryId => {
              const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}/name`);
              return categoryResponse.data.name;
            }));
            const categoryNames = categoryResponses.join(', ');

            return { ...product, publisherName, authorName, categoryNames };
          } catch (error) {
            console.error(`Error fetching details for product ${product._id}:`, error);
            return { ...product, publisherName: 'Unknown', categoryNames: 'Unknown', authorName: 'Unknown' };
          }
        }));

        setProducts(productsWithDetails);
        setTotalPages(Math.ceil(productsWithDetails.length / productsPerPage));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [productsPerPage]);

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await axios.post('http://localhost:5000/admin/delete-product', { id: productId });
          setProducts(products.filter(product => product._id !== productId));
          setTotalPages(Math.ceil((products.length - 1) / productsPerPage));
          if (currentPage > Math.ceil((products.length - 1) / productsPerPage)) {
            setCurrentPage(currentPage - 1);
          }
          message.success('Xóa sản phẩm thành công.');
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm:', error);
          message.error('Xóa sản phẩm không thành công. Vui lòng thử lại.');
        }
      },
    });
  };

  const openEditForm = (product) => {
    setSelectedProduct(product);
    setEditFormVisible(true);
  };

  const toggleColumnVisibility = (columnName) => {
    if (columnName === 'id' || columnName === 'actions') {
      return;
    }
    
    setColumnsVisible({
      ...columnsVisible,
      [columnName]: !columnsVisible[columnName],
    });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách sản phẩm</strong>
      <div className="mt-4 flex justify-end items-center relative">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Cột hiển thị:</span>
          <FontAwesomeIcon
            icon={faColumns}
            className="text-gray-600 ml-1 cursor-pointer"
            onClick={() => setShowColumnsForm(!showColumnsForm)}
          />
        </div>
        {showColumnsForm && (
          <div className="absolute top-full right-0 mt-2 flex flex-col items-start space-y-2 border rounded p-2 bg-white shadow-lg">
            {Object.keys(columnsVisible).map(column => (
              <label key={column} className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={columnsVisible[column]}
                  onChange={() => toggleColumnVisibility(column)}
                  className="form-checkbox h-4 w-4 text-green-500"
                />
                <span className="text-gray-700 text-sm">{column}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className='mt-3'>
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              {columnsVisible.id && <th>Số thứ tự</th>}
              {columnsVisible.name && <th>Tên sản phẩm</th>}
              {columnsVisible.image && <th>Hình ảnh</th>}
              {columnsVisible.description && <th>Mô tả</th>}
              {columnsVisible.price && <th>Giá niêm yết</th>}
              {columnsVisible.promotionPrice && <th>Giá khuyến mãi</th>}
              {columnsVisible.categories && <th>Thể loại</th>}
              {columnsVisible.author && <th>Tác giả</th>}
              {columnsVisible.publisher && <th>Nhà xuất bản</th>}
              {columnsVisible.quantity && <th>Số lượng</th>}
              {columnsVisible.actions && <th className='w-20'>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product._id}>
                {columnsVisible.id && <td>{indexOfFirstProduct + index + 1}</td>}
                {columnsVisible.name && <td>{product.name}</td>}
                {columnsVisible.image && (
                  <td>
                    {product.images && <img src={product.images} alt={product.name} className="h-12 w-12 object-contain" />}
                  </td>
                )}
                {columnsVisible.description && <td>{product.description}</td>}
                {columnsVisible.price && <td>{product.price}</td>}
                {columnsVisible.promotionPrice && <td>{product.promotion_price}</td>}
                {columnsVisible.categories && <td>{product.categoryNames}</td>}
                {columnsVisible.author && <td>{product.authorName}</td>}
                {columnsVisible.publisher && <td>{product.publisherName}</td>}
                {columnsVisible.quantity && <td>{product.quantity}</td>}
                {columnsVisible.actions && (
                  <td className='flex space-x-2'>
                    <button onClick={() => openEditForm(product)} className='text-blue-500'>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className='text-red-500'>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button onClick={() => openViewForm(product)} className='text-green-500'>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            className={`mx-1 px-3 py-1 rounded focus:outline-none ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <div className="text-gray-600">
            Trang {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            className={`mx-1 px-3 py-1 rounded focus:outline-none ${currentPage === totalPages ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === totalPages}
          >
            Trang tiếp
          </button>
        </div>
      </div>

      {editFormVisible && selectedProduct && (
        <Modal
          visible={editFormVisible}
          onCancel={() => setEditFormVisible(false)}
          footer={null}
          title="Chỉnh sửa sản phẩm"
          width={1000}
          style={{ top: 20 }}
        >
          <EditProductForm product={selectedProduct} onClose={() => setEditFormVisible(false)} />
        </Modal>
      )}
    </div>
  );
}

export default Products;
