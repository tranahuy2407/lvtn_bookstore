import React from 'react'
import Banner from '../components/Banner'
import BestSellerBooks from '../home/BestSellerBooks'
import PromotionBook from './PromotionBook'
import Category from './Category'
import Service from './Service'
import FloatingIcon from '../components/chatbot/FloatingIcon'
import Chatbot from '../components/chatbot/Chatbot'

const Home = () => {
  return (
    <div> 
      <Banner/>  
      <Category />
      <PromotionBook/>
      <BestSellerBooks/>
      <Service/>
      <Chatbot /> 
      <FloatingIcon/>
    </div>
  )
}

export default Home
