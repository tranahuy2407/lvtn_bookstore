
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footerr from './components/Footerr'
import { UserContextProvider } from './authencation/UserContext'
import { CartProvider } from './shop/CartContext'
import { AuthProvider } from './admin/authencation/AuthContext';
import axios from 'axios'

axios.baseUrl = 'http://127.0.0.1:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
    <AuthProvider>
    <UserContextProvider>
    <CartProvider>
        <Navbar/>
        <div className='min-h-screen'>
        <Outlet/>
        </div>
        <Footerr/>
     </CartProvider>
    </UserContextProvider>
    </AuthProvider>
    </>   
  )
}

export default App
