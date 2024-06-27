import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ headline, categories }) => {
  const [expanded, setExpanded] = useState(false);

  const categoryGroups = [];
  for (let i = 0; i < categories.length; i += 4) {
    categoryGroups.push(categories.slice(i, i + 4));
  }

  const defaultRowCount = 2;
  const maxRowCount = categoryGroups.length;
  let displayRowCount = expanded ? maxRowCount : defaultRowCount;

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{headline}</h2>
      <div className="grid grid-cols-4 gap-4">
        {categoryGroups.slice(0, displayRowCount).map((group, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {group.map((category) => (
              <div key={category._id} className="col-span-1">
                <Link
                  to={`/shop/${category._id}`}
                  className="border border-gray-200 hover:border-gray-300 hover:scale-105 transition-transform rounded-lg mb-4 block"
                >
                  <div className="flex flex-col items-center p-4">
                    <img
                      className="w-24 h-24 object-cover mb-2"
                      src={category.image}
                      alt={category.name}
                    />
                    <h3 className="text-lg font-medium text-center">{category.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      {maxRowCount > defaultRowCount && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-500 hover:text-blue-700 focus:outline-none"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
};

export default CategoryCard;
