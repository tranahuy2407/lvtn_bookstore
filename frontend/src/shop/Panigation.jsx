import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination flex justify-center my-4">
      <ul className="pagination-list flex space-x-2">
        {currentPage > 1 && (
          <li className="pagination-item">
            <button
              className="pagination-link flex items-center px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => onPageChange(currentPage - 1)}
            >
              <span className="arrow-left" aria-hidden="true">&#8592;</span>
              <span className="sr-only">Previous</span>
            </button>
          </li>
        )}

        {pageNumbers.map(number => (
          <li key={number} className="pagination-item">
            <button
              className={`pagination-link ${currentPage === number ? 'pagination-link-active' : ''} px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}

        {currentPage < totalPages && (
          <li className="pagination-item">
            <button
              className="pagination-link flex items-center px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span className="arrow-right" aria-hidden="true">&#8594;</span>
              <span className="sr-only">Next</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
