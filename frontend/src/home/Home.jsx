import React from 'react'
import Banner from '../components/Banner'
import BestSellerBooks from '../home/BestSellerBooks'
import PromotionBook from './PromotionBook'
import Category from './Category'
import Service from './Service'
const Home = () => {
  return (
    <div> 
      <Banner/>  
      <Category />
      <PromotionBook/>
      <BestSellerBooks/>
      <Service/>
    </div>
  )
}

export default Home
