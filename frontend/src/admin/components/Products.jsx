import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faColumns, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Modal, message, Input } from 'antd';
import EditProductForm from './EditProductFormm';  
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      const productsWithDetails = await Promise.all(response.data.map(async product => {
        try {
          const publisherResponse = await axios.get(`http://localhost:5000/api/publishers/${product.publishers}/name`);
          const publisherName = publisherResponse.data.name;

          const authorResponses = await Promise.all(product.author.map(async authorId => {
            const authorResponse = await axios.get(`http://localhost:5000/api/authors/${authorId}/name`);
            return authorResponse.data.name;
          }));
          const authorNames = authorResponses.join(', ');

          const categoryResponses = await Promise.all(product.categories.map(async categoryId => {
            const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}/name`);
            return categoryResponse.data.name;
          }));
          const categoryNames = categoryResponses.join(', ');

          return { ...product, publisherName, authorNames, categoryNames };
        } catch (error) {
          console.error(`Error fetching details for product ${product._id}:`, error);
          return { ...product, publisherName: 'Unknown', categoryNames: 'Unknown', authorNames: 'Unknown' };
        }
      }));

      setProducts(productsWithDetails);
      setFilteredProducts(productsWithDetails); // Initialize filtered products
      setTotalPages(Math.ceil(productsWithDetails.length / productsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productsPerPage]);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.authorNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    setCurrentPage(1); 
  }, [searchTerm, products]);

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/admin/delete-book/${productId}`);
          await fetchProducts(); 
          message.success('Xóa sản phẩm thành công.');
        } catch (error) {
          console.error('Lỗi khi xóa sản phẩm:', error);
          message.error('Sách đang có trong đơn hàng không thể xoá');
        }
      },
    });
  };

  const handleAddProduct = () => {
    navigate('/admin/dashboard/add-product');
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
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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

  const handleShowColumnsModal = () => {
    setShowColumnsForm(true);
  };

  const handleCloseColumnsModal = () => {
    setShowColumnsForm(false);
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách sản phẩm</strong>
      
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleAddProduct}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Thêm sản phẩm
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Cột hiển thị:</span>
          <FontAwesomeIcon
            icon={faColumns}
            className="text-gray-600 ml-1 cursor-pointer"
            onClick={handleShowColumnsModal}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Input
          prefix={<FontAwesomeIcon icon={faSearch} />}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          style={{ maxWidth: '400px', width: '100%' }}
        />
      </div>

      <Modal
        title="Chọn cột hiển thị"
        visible={showColumnsForm}
        onCancel={handleCloseColumnsModal}
        footer={null}
        width={400}
      >
        <div className="flex flex-col space-y-2">
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
      </Modal>

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
                {columnsVisible.author && <td>{product.authorNames}</td>}
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
            Trang {currentPage} của {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            className={`mx-1 px-3 py-1 rounded focus:outline-none ${currentPage === totalPages ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>

      <Modal
        title="Chỉnh sửa sản phẩm"
        visible={editFormVisible}
        footer={null}
        onCancel={() => setEditFormVisible(false)}
        width={800} 
      >
        {selectedProduct && (
          <EditProductForm
            product={selectedProduct}
            onClose={() => setEditFormVisible(false)}
            onUpdateSuccess={fetchProducts} // Pass fetchProducts to update the list after edit
          />
        )}
      </Modal>
    </div>
  );
}

export default Products;
