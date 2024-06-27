import React from 'react'
import Banner from '../components/Banner'
import BestSellerBooks from '../home/BestSellerBooks'
import PromotionBook from './PromotionBook'
import Category from './Category'
const Home = () => {
  return (
    <div> 
      <Banner/>  
      <Category />
      <PromotionBook/>
      <BestSellerBooks/>
    </div>
  )
}

export default Home
