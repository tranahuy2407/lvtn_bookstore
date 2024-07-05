import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryCard from "./CategoryCard";

const CategoryNav = ({ onCategorySelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredType, setHoveredType] = useState("");
  const [typeCategories, setTypeCategories] = useState({});
  const [selectedType, setSelectedType] = useState(""); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          const groupedCategories = {};
          response.data.forEach((category) => {
            if (!groupedCategories[category.type]) {
              groupedCategories[category.type] = [];
            }
            groupedCategories[category.type].push(category);
          });
          setTypeCategories(groupedCategories);
        } else {
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setHoveredCategory(categoryName);
    onCategorySelect(categoryName);
    setDropdownVisible(false); // Đóng dropdown khi chọn danh mục
  };

  const handleMouseEnter = (type) => {
    setDropdownVisible(true);
    setHoveredType(type);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
    setHoveredType("");
  };

  const renderCategoryNames = (type) => {
    const filteredCategories = typeCategories[type] || [];
    if (filteredCategories.length === 0) {
      return <p>No categories found for {type}</p>;
    }
    return (
      <div className="grid grid-cols-4 gap-4">
        {filteredCategories.map((cat) => (
          <div key={cat._id}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{cat.name}</h3>
            {cat.categories &&
              cat.categories.map((subCat) =>
                subCat.categories ? (
                  subCat.categories.map((category) => (
                    <div
                      key={category._id}
                      className={`p-2 cursor-pointer ${
                        hoveredCategory === category.name ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </div>
                  ))
                ) : (
                  <div
                    key={subCat._id}
                    className={`p-2 cursor-pointer ${
                      hoveredCategory === subCat.name ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleCategorySelect(subCat.name)}
                  >
                    {subCat.name}
                  </div>
                )
              )}
          </div>
        ))}
      </div>
    );
  };

  const renderLeftColumn = () => {
    return (
      <div className="pr-4" style={{ width: '30%' }}>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tất cả danh mục</h2>
        {Object.keys(typeCategories).map((type, idx) => (
          <div
            key={idx}
            className="mb-4 cursor-pointer"
            onMouseEnter={() => handleMouseEnter(type)}
          >
            <span>{type}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="relative flex"
      onMouseEnter={() => handleMouseEnter("")}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white transition-colors duration-300 hover:text-blue-700 cursor-pointer"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
        />
      </svg>
      {dropdownVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-4 max-w-screen-lg w-3/4 h-3/4 max-h-none overflow-y-auto flex">
            {renderLeftColumn()}
            <div className="flex flex-col space-y-4 flex-grow">
              {hoveredType && (
                <div key={hoveredType} className="flex items-start">
                  <CategoryCard
                    headline={hoveredType}
                    categories={typeCategories[hoveredType] || []} 
                    onCloseDropdown={() => setDropdownVisible(false)} // Truyền callback để đóng dropdown
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryNav;
