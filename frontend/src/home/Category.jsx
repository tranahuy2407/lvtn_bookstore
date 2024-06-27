import React, { useEffect, useState } from 'react'


import CategoryCard from './CategoryCard';

const Category = () => {
    const[categories,setCategories] = useState([]);

    useEffect(() =>{
        fetch("http://localhost:5000/api/categories").then(res => res.json()).then(data => setCategories(data.slice(0,50)));
    },[])
     return (
    <div className="container pt-16">
      <div className="grud sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         <CategoryCard categories = {categories} headline ="Thể loại sách"/>
    </div>
    </div> 
  )
}

export default Category
