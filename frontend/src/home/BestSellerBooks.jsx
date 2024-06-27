import React, { useEffect, useState } from 'react'
import BookCard from '../components/BookCard';

const BestSellerBooks = () => {
    const[books,setBooks] = useState([]);

    useEffect(() =>{
        fetch("http://localhost:5000/api/products").then(res => res.json()).then(data => setBooks(data.slice(0,8)));
    },[])
  return (
    <div>
      <BookCard books ={books} headline ="Sách Bán Chạy"/>
    </div>
  )
}

export default BestSellerBooks
